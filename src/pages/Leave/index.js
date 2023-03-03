import React, {useState, useEffect} from 'react'
import {Card, Col, Row, Tabs} from 'antd'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getQuarters,
  getQuarterTakenAndRemainingLeaveDaysOfUser,
  getTakenAndRemainingLeaveDaysOfUser,
  getUserLeavesSummary,
  sendEmailforLeave,
} from 'services/leaves'
import {
  convertMsToDay,
  getCurrentFiscalYear,
  handleResponse,
} from 'helpers/utils'
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
import ReapplyLeaveModal from 'components/Modules/ReapplyLeaveModal'
import {STATUS_TYPES} from 'constants/Leaves'
import useWindowsSize from 'hooks/useWindowsSize'
import {AnnualApprovedLeaveCardClassName} from 'constants/DOM'

const TabPane = Tabs.TabPane

function Leave() {
  const location = useLocation()
  const queryClient = useQueryClient()

  let leaveCancelReason = ''
  const [selectedRows, setSelectedRows] = useState([])
  const [openCancelLeaveModal, setOpenCancelLeaveModal] = useState(false)
  const [openReapplyLeaveModal, setOpenReapplyLeaveModal] = useState({
    open: false,
    leaveData: {},
  })
  const [reapplyLoader, setreapplyLoader] = useState(false)

  const [IsReject, setIsReject] = useState(false)
  const [IsUserCancel, setUserCancel] = useState(false)

  const [leaveData, setLeaveData] = useState('')
  const [submittingCancelReason, setSubmittingCancelReason] = useState(false)

  const loggedInUser = useSelector(selectAuthUser)

  const {data: leaveTypes, isLoading} = useQuery(['leaveTypes'], getLeaveTypes)

  const leaveDaysQuery = useQuery(
    ['takenAndRemainingLeaveDays', loggedInUser],
    () => getTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const [openTab, setOpenTab] = useState(['2'])

  const user = useSelector(selectAuthUser)

  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)

  const leavePermissions = permission?.['Leave Management']

  const handleCloseCancelLeaveModal = () => {
    setOpenCancelLeaveModal(false)
    setIsReject(false)
  }

  const handleOpenCancelLeaveModal = (
    leaveDetails,
    mode = false,
    userCancel = false
  ) => {
    if (leaveDetails?.leaveStatus === STATUS_TYPES[5]?.id) {
      leaveCancelMutation.mutate({
        id: leaveDetails?._id,
        type: 'cancel',
      })
      return
    }
    setIsReject(mode)
    setOpenCancelLeaveModal(true)
    setLeaveData(leaveDetails)
    setUserCancel(userCancel)
  }

  const {data: quarters, isSuccess} = useQuery(['allquarters'], () =>
    getQuarters()
  )

  const leavesSummary = useQuery(
    ['leavesSummary'],
    () => {
      //getting the quarterId
      const currentQuarter = quarters?.data?.data?.data[0]?.quarters.find(
        (d) =>
          new Date(d?.fromDate) <= new Date().setUTCHours(0, 0, 0, 0) &&
          new Date().setUTCHours(23, 59, 59, 999) <= new Date(d?.toDate)
      )

      return getUserLeavesSummary({
        userId: loggedInUser._id,
        quarterId: currentQuarter?._id,
        fiscalYear: getCurrentFiscalYear(),
      })
    },
    {enabled: isSuccess}
  )

  const yearlyAllocatedSickLeaves =
    leavesSummary?.data?.data?.data?.[0]?.yearSickAllocatedLeaves
  const yearlyAllocatedCasualLeaves =
    leavesSummary?.data?.data?.data?.[0]?.yearCausalAllocatedLeaves

  const leaveCancelMutation = useMutation(
    (payload) => changeLeaveStatus(payload.id, payload.type, payload.reason),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          `${
            IsReject
              ? 'Leave Rejected successfully'
              : 'Leave cancelled successfully'
          }`,
          `${IsReject ? 'Could not Reject leave' : 'Could not cancel leave'}`,
          [
            () => sendEmailNotification(response),
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
            () => queryClient.invalidateQueries(['substitute']),
            () => {
              socket.emit('CUD')
            },
            () => {
              socket.emit('cancel-leave', {
                showTo: [response.data.data.data.user._id],
                remarks: `${
                  IsReject
                    ? 'Your leave has been rejected.'
                    : 'Your leave has been cancelled'
                }`,
                module: 'Leave',
              })
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not cancel leave', type: 'error'})
      },
    }
  )

  const leavereapplyMutation = useMutation(
    (payload) =>
      changeLeaveStatus(payload.id, payload.type, '', payload.reapplyreason),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Leave Reapplied successfully',
          'Could not re-apply leave',
          [
            () => sendEmailNotification({...response, reapply: true}),
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
        setreapplyLoader(false)
        notification({message: 'Could not reapply leave', type: 'error'})
      },
    }
  )

  const handleCancelLeave = (leave) => {
    leaveCancelReason = IsReject
      ? leave?.leaveRejectReason
      : leave?.leaveCancelReason
    leaveCancelMutation.mutate({
      id: leave._id,
      type: IsReject ? 'reject' : IsUserCancel ? 'user-cancel' : 'cancel',
      reason: leaveCancelReason,
    })
  }

  const reApplyLeave = (leave) => {
    setOpenReapplyLeaveModal({open: true, leaveData: leave})
  }

  const handleReapplyLeave = (data) => {
    leavereapplyMutation.mutate({
      id: data?._id,
      type: 'pending',
      status: '',
      reapplyreason: data?.reapplyreason,
    })
  }

  const handleCloseReapplyModal = () => {
    setOpenReapplyLeaveModal({open: false, leaveData: {}})
  }

  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))

  const sendEmailNotification = (res) => {
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      leaveType: res.data.data.data?.leaveType?.name,
      user: res.data.data.data.user,
      leaveReason: res?.data?.data?.data?.reason,
      reapply: res?.reapply,
      userCancelReason: res?.data?.data?.data?.cancelReason,
      leaveCancelReason,
    })
    setreapplyLoader(false)
    setSubmittingCancelReason(false)
    handleCloseReapplyModal()
    handleCloseCancelLeaveModal()
  }

  const handleRowSelect = (rows) => {
    setSelectedRows(rows)
  }

  const yearlyLeavesTakn = leaveDaysQuery?.data?.data?.data?.data?.reduce(
    (acc, item) => {
      acc[item?._id] = item.leavesTaken
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

  const YearlyLeaveExceptCasualandSick = leaveDaysQuery?.data?.data?.data?.data
    ?.filter((item) => !['Sick Leave', 'Casual Leave'].includes(item?._id))
    ?.map((d) => [d?._id, d?.leavesTaken])

  let IsIntern = user?.status === EmployeeStatus?.Probation

  const [nonCasualSickLeaveCardHeight, setNonCasualSickLeaveCardHeight] =
    useState('100%')
  useEffect(() => {
    const nonCasualSickLeaveCard = document.getElementsByClassName(
      AnnualApprovedLeaveCardClassName
    )[0]

    if (
      typeof nonCasualSickLeaveCard !== 'undefined' &&
      nonCasualSickLeaveCardHeight === '100%'
    ) {
      setNonCasualSickLeaveCardHeight(
        `${nonCasualSickLeaveCard.offsetHeight}px`
      )
    }
  }, [leaveDaysQuery.isSuccess])

  const quarterlyLeaveContent = (
    <QuarterlyLeavesRemainingAndAppliedCards
      firstType="Days Remaining"
      secondType="Days Approved"
      firstNumber={
        leavesSummary?.data?.data?.data?.[0]?.leaves?.[0]?.remainingLeaves
      }
      secondNumber={loggedInUser.leaveadjustmentBalance}
      approvedLeaves={{
        sickLeaves:
          leavesSummary?.data?.data?.data?.[0]?.leaves?.[0]?.approvedLeaves
            ?.sickLeaves,
        casualLeaves:
          leavesSummary?.data?.data?.data?.[0]?.leaves?.[0]?.approvedLeaves
            ?.casualLeaves,
      }}
      nonCasualSickLeaveCardHeight={nonCasualSickLeaveCardHeight}
    />
  )

  const annualLeaveContent = (
    <AnnualLeavesRemainingAndAppliedCards
      firstTitle="Days Remaining"
      secondTitle="Days Approved"
      firstType="Sick"
      secondType="Casual"
      sickDayRemaining={
        yearlyLeavesTakn?.['Sick Leave']
          ? yearlyAllocatedSickLeaves - yearlyLeavesTakn?.['Sick Leave']
          : yearlyAllocatedSickLeaves
      }
      casualDayRemaining={
        yearlyLeavesTakn?.['Casual Leave']
          ? yearlyAllocatedCasualLeaves - yearlyLeavesTakn?.['Casual Leave']
          : yearlyAllocatedCasualLeaves
      }
      sickDayApplied={yearlyLeavesTakn?.['Sick Leave'] || 0}
      casualDayApplied={yearlyLeavesTakn?.['Casual Leave'] || 0}
      YearlyLeaveExceptCasualandSick={YearlyLeaveExceptCasualandSick}
      nonCasualSickLeaveCardHeight={nonCasualSickLeaveCardHeight}
    />
  )

  const leaveCardContent = (
    <Row>
      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
        <Card
          title="Quarterly Leave"
          style={{background: 'rgb(232 232 232 / 26%)'}}
        >
          {quarterlyLeaveContent}
        </Card>
      </Col>

      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
        <Card
          title="Annual Leave"
          style={{background: 'rgb(232 232 232 / 26%)'}}
        >
          {annualLeaveContent}
        </Card>
      </Col>
    </Row>
  )

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
          title={IsReject ? 'Reject Leave' : 'Cancel Leave'}
          isRequired={true}
          label={IsReject ? 'Leave Reject Reason' : 'Cancel Leave Reason'}
          name={IsReject ? 'leaveRejectReason' : 'leaveCancelReason'}
        />
      )}

      <ReapplyLeaveModal
        open={openReapplyLeaveModal.open}
        onClose={handleCloseReapplyModal}
        onSubmit={handleReapplyLeave}
        leaveData={openReapplyLeaveModal.leaveData}
        loader={reapplyLoader}
        setLoader={setreapplyLoader}
        isRequired={true}
      />

      <Card title="Leave Management System">
        {!IsIntern ? (
          leaveCardContent
        ) : (
          <p className="blueText">
            Note: You are allocated 1 day leave each month.
          </p>
        )}

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
