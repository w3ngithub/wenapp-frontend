import React, {useState} from 'react'
import {Card, Col, Row, Tabs} from 'antd'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getQuarterTakenAndRemainingLeaveDaysOfUser,
  getTakenAndRemainingLeaveDaysOfUser,
  sendEmailforLeave,
} from 'services/leaves'
import {getLocalStorageData, handleResponse} from 'helpers/utils'
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
import {LOCALSTORAGE_USER} from 'constants/Settings'
import RoleAccess, {
  LEAVE_TABS_NO_ACCESS,
  PositionType,
} from 'constants/RoleAccess'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'

const TabPane = Tabs.TabPane

function Leave() {
  const location = useLocation()
  const queryClient = useQueryClient()

  let leaveCancelReason
  const [selectedRows, setSelectedRows] = useState([])
  const [openCancelLeaveModal, setOpenCancelLeaveModal] = useState(false)

  const [leaveData, setLeaveData] = useState('')
  const [submittingCancelReason, setSubmittingCancelReason] = useState(false)

  const loggedInUser = getLocalStorageData(LOCALSTORAGE_USER)

  const {data: leaveTypes, isLoading} = useQuery(['leaveTypes'], getLeaveTypes)

  const leaveDaysQuery = useQuery(['takenAndRemainingLeaveDays'], () =>
    getTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const user = localStorage.getItem('user_id')
    ? JSON.parse(localStorage.getItem('user_id'))?.user
    : {}

  const handleCloseCancelLeaveModal = () => {
    setOpenCancelLeaveModal(false)
  }

  const handleOpenCancelLeaveModal = (leaveDetails) => {
    setOpenCancelLeaveModal(true)
    setLeaveData(leaveDetails)
  }

  const quarterleaveDaysQuery = useQuery(
    ['quartertakenAndRemainingLeaveDays'],
    () => getQuarterTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const leaveCancelMutation = useMutation(
    (payload) => changeLeaveStatus(payload.id, payload.type, payload.reason),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Leave cancelled successfully',
          'Could not cancel leave',
          [
            () => sendEmailNotification(response),
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not cancel leave', type: 'error'})
      },
    }
  )

  const handleCancelLeave = (leave) => {
    leaveCancelReason = leave?.leaveCancelReason
    leaveCancelMutation.mutate({
      id: leave._id,
      type: 'cancel',
      reason: leaveCancelReason,
    })
  }
  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))

  const sendEmailNotification = (res) => {
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      user: res.data.data.data.user,
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
  
  let IsIntern = user?.position?.name === PositionType.Intern && user?.role?.key === RoleAccess.Subscriber;

  if (leaveDaysQuery.isLoading) return <CircularProgress />
  return (
    <>
      <CancelLeaveModal
        open={openCancelLeaveModal}
        onClose={handleCloseCancelLeaveModal}
        onSubmit={handleCancelLeave}
        leaveData={leaveData}
        loader={submittingCancelReason}
        setLoader={setSubmittingCancelReason}
        title={'Cancel Leave'}
        isRequired={true}
        label={'Cancel Leave Reason'}
        name={'leaveCancelReason'}
      />

      <Card title="Leave Management System">
        <Row>
          <Col xl={IsIntern?24:12} lg={IsIntern?24:12} md={24} sm={24} xs={24}>
            <Card
              title="Quarterly Leave"
              style={{background: 'rgb(232 232 232 / 26%)'}}
            >
              <QuarterlyLeavesRemainingAndAppliedCards
                firstType="Days Remaining"
                secondType="Days Approved"
                firstNumber={
                  quarterleaveDaysQuery?.data?.data?.data?.remainingLeaves || 0
                }
                secondNumber={
                  quarterleaveDaysQuery?.data?.data?.data?.leavesTaken || 0
                }
              />
            </Card>
          </Col>

          { !IsIntern && (
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
            )}
        </Row>

        <Tabs type="card" defaultActiveKey={location?.state?.tabKey}>
          {loggedInUser?.role?.key !== RoleAccess.Finance && (
            <>
              <TabPane tab="Apply" key="1">
                <LeavesApply user={loggedInUser?._id} />
              </TabPane>
              <TabPane tab="My History" key="2">
                <MyHistory
                  userId={loggedInUser?._id}
                  handleOpenCancelLeaveModal={handleOpenCancelLeaveModal}
                />
              </TabPane>
            </>
          )}
          {!LEAVE_TABS_NO_ACCESS.includes(loggedInUser?.role?.key) && (
            <>
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
                />
              </TabPane>
              <TabPane tab="Leaves Calendar" key="4">
                <LeavesCalendar />
              </TabPane>
            </>
          )}
        </Tabs>
      </Card>
    </>
  )
}

export default Leave
