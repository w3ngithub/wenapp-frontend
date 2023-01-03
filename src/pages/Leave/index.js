import React, {useState, useEffect} from 'react'
import {Card, Col, Row, Tabs} from 'antd'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getQuarterTakenAndRemainingLeaveDaysOfUser,
  getTakenAndRemainingLeaveDaysOfUser,
  sendEmailforLeave,
} from 'services/leaves'
import {handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeavesApply from './Apply'
import Leaves from './Leaves'
import CircularProgress from 'components/Elements/CircularProgress'
import LeavesCalendar from './LeavesCalendar'
import {useLocation} from 'react-router-dom'
import MyHistory from './MyHistory'
import {getLeaveTypes} from 'services/settings/leaveType'
import AnnualLeavesRemainingAndAppliedCards from './AnnualLeavesRemainingAndAppliedCards'
import QuarterlyLeavesRemainingAndAppliedCards from './QuarterlyLeavesRemainingAndAppliedCards'
import {EmployeeStatus} from 'constants/RoleAccess'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'
import AccessWrapper from 'components/Modules/AccessWrapper'

const TabPane = Tabs.TabPane

function Leave() {
  const location = useLocation()
  const queryClient = useQueryClient()

  let leaveCancelReason="";
  const [selectedRows, setSelectedRows] = useState([])
  const [openCancelLeaveModal, setOpenCancelLeaveModal] = useState(false)
  const [IsReject,setIsReject] = useState(false)

  const [leaveData, setLeaveData] = useState('')
  const [submittingCancelReason, setSubmittingCancelReason] = useState(false)

  const loggedInUser = useSelector(selectAuthUser)
  const {data: leaveTypes, isLoading} = useQuery(['leaveTypes'], getLeaveTypes)

  const leaveDaysQuery = useQuery(
    ['takenAndRemainingLeaveDays', loggedInUser],
    () => getTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const user = useSelector(selectAuthUser)

  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)

  const leavePermissions = permission?.['Leave Management']

  const handleCloseCancelLeaveModal = () => {
    setOpenCancelLeaveModal(false)
    setIsReject(false)
  }

  const handleOpenCancelLeaveModal = (leaveDetails,mode=false) => {
    setIsReject(mode)
    setOpenCancelLeaveModal(true)
    setLeaveData(leaveDetails)
  }

  const quarterleaveDaysQuery = useQuery(
    ['quartertakenAndRemainingLeaveDays', loggedInUser],
    () => getQuarterTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const leaveCancelMutation = useMutation(
    (payload) => changeLeaveStatus(payload.id, payload.type, payload.reason),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          `${IsReject?'Leave Rejected successfully':'Leave cancelled successfully'}`,
          `${IsReject?'Could not Reject leave':'Could not cancel leave'}`,
          [
            () => sendEmailNotification(response),
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
            () => {
              socket.emit('CUD')
            },
            () => {
              socket.emit('cancel-leave', {
                showTo: [response.data.data.data.user._id],
                remarks: `${IsReject?'Your leave has been rejected.':'Your leave has been cancelled'}`,
                module: 'Leave',
              })
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not cancel leave', type: 'error'})
      }
    }
  )


  const leavereapplyMutation = useMutation(
    (payload) => changeLeaveStatus(payload.id, payload.type, payload.reason),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Leave Reapplied successfully',
          'Could not re-apply leave',
          [
            () => sendEmailNotification({...response,reapply:true}),
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
            () => {
              socket.emit('CUD')
            },
            () => {
              socket.emit('cancel-leave', {
                showTo: [response.data.data.data.user._id],
                remarks: 'Leave reapplied succesfully',
                module: 'Leave',
              })
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not reapply leave', type: 'error'})
      },
    }
  )


  const handleCancelLeave = (leave) => {
    leaveCancelReason = IsReject? leave?.leaveRejectReason: leave?.leaveCancelReason
    leaveCancelMutation.mutate({
      id: leave._id,
      type: IsReject?'reject':'cancel',
      reason: leaveCancelReason,
    })
  }

  const reApplyLeave = (leave)=>{
    leavereapplyMutation.mutate({
      id:leave._id,
      type:'pending',
      status:''
    })
  }

  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))

  const sendEmailNotification = (res) => {
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      leaveType:res.data.data.data?.leaveType?.name,
      user: res.data.data.data.user,
      leaveReason:res?.data?.data?.data?.reason,
      reapply:res?.reapply,
      leaveCancelReason,
    })
    setSubmittingCancelReason(false)
    handleCloseCancelLeaveModal()
  }

  const handleRowSelect = (rows) => {
    setSelectedRows(rows)
  }

  const yearlyLeavesTakn = leaveDaysQuery?.data?.data?.data?.data?.reduce(
    (acc, item) => {
      acc[item?._id[0]?.name] = item.leavesTaken
      return acc
    },
    {}
  )

  const allocatedYealryLeaves = leaveTypes?.data?.data?.data?.reduce(
    (acc, item) => {
      acc[item?.name] = item.leaveDays
      return acc
    },
    {}
  )

  let IsIntern = user?.status === EmployeeStatus?.Probation

  if (leaveDaysQuery.isLoading) return <CircularProgress />
  return (
    <>
      {openCancelLeaveModal && (
        <CancelLeaveModal
          open={openCancelLeaveModal}
          onClose={handleCloseCancelLeaveModal}
          onSubmit={handleCancelLeave}
          leaveData={leaveData}
          loader={submittingCancelReason}
          setLoader={setSubmittingCancelReason}
          title={IsReject?'Reject Leave':'Cancel Leave'}
          isRequired={true}
          label={IsReject?'Leave Reject Reason':'Cancel Leave Reason'}
          name={IsReject?'leaveRejectReason':'leaveCancelReason'}
        />
      )}

      <Card title="Leave Management System">
        <Row>
          <AccessWrapper role={leavePermissions?.showQuarterlyLeaveDetails}>
            <Col
              xl={
                IsIntern || !leavePermissions?.showAnnualLeaveDetails ? 24 : 12
              }
              lg={
                IsIntern || !leavePermissions?.showAnnualLeaveDetails ? 24 : 12
              }
              md={24}
              sm={24}
              xs={24}
            >
              <Card
                title="Quarterly Leave"
                style={{background: 'rgb(232 232 232 / 26%)'}}
              >
                <QuarterlyLeavesRemainingAndAppliedCards
                  firstType="Days Remaining"
                  secondType="Days Approved"
                  firstNumber={
                    quarterleaveDaysQuery?.data?.data?.data?.remainingLeaves ||
                    0
                  }
                  secondNumber={
                    quarterleaveDaysQuery?.data?.data?.data?.leavesTaken || 0
                  }
                />
              </Card>
            </Col>
          </AccessWrapper>

          <AccessWrapper
            role={!IsIntern && leavePermissions?.showAnnualLeaveDetails}
          >
            <Col
              xl={!leavePermissions?.showQuarterlyLeaveDetails ? 24 : 12}
              lg={!leavePermissions?.showQuarterlyLeaveDetails ? 24 : 12}
              md={24}
              sm={24}
              xs={24}
            >
              <Card
                title="Annual Leave"
                style={{background: 'rgb(232 232 232 / 26%)'}}
              >
                <AnnualLeavesRemainingAndAppliedCards
                  firstTitle="Days Remaining"
                  secondTitle="Days Approved"
                  firstType="Sick"
                  secondType="Casual"
                  sickDayRemaining={
                    yearlyLeavesTakn?.['Sick Leave']
                      ? allocatedYealryLeaves?.['Sick Leave'] -
                        yearlyLeavesTakn?.['Sick Leave']
                      : allocatedYealryLeaves?.['Sick Leave']
                  }
                  casualDayRemaining={
                    yearlyLeavesTakn?.['Casual Leave']
                      ? allocatedYealryLeaves?.['Casual Leave'] -
                        yearlyLeavesTakn?.['Casual Leave']
                      : allocatedYealryLeaves?.['Casual Leave']
                  }
                  sickDayApplied={yearlyLeavesTakn?.['Sick Leave'] || 0}
                  casualDayApplied={yearlyLeavesTakn?.['Casual Leave'] || 0}
                />
              </Card>
            </Col>
          </AccessWrapper>
        </Row>

        <Tabs type="card" defaultActiveKey={location?.state?.tabKey}>
          {leavePermissions?.applyLeave && (
            <TabPane tab="Apply" key="1">
              <LeavesApply
                user={loggedInUser?._id}
                permissions={leavePermissions}
              />
            </TabPane>
          )}
          {leavePermissions?.viewMyHistory && (
            <TabPane tab="My History" key="2">
              <MyHistory
                userId={loggedInUser?._id}
                permissions={leavePermissions}
                handleOpenCancelLeaveModal={handleOpenCancelLeaveModal}
                reApplyLeave={reApplyLeave}
              />
            </TabPane>
          )}
          {leavePermissions?.viewLeaves && (
            <TabPane tab="Leaves" key="3">
              <Leaves
                selectedUser={location?.state?.user}
                status={location?.state?.leaveStatus}
                selectedDate={location?.state?.date}
                selectedRows={selectedRows}
                handleOpenCancelLeaveModal={handleOpenCancelLeaveModal}
                rowSelection={{
                  onChange: handleRowSelect,
                  selectedRowKeys: selectedRows,
                }}
                isExportDisabled={selectedRows.length === 0}
                userRole={loggedInUser?.role?.key}
                permissions={leavePermissions}
              />
            </TabPane>
          )}
          {leavePermissions?.viewLeavesCalendar && (
            <TabPane tab="Leaves Calendar" key="4">
              <LeavesCalendar />
            </TabPane>
          )}
        </Tabs>
      </Card>
    </>
  )
}

export default Leave
