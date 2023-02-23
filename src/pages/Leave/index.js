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
import AccessWrapper from 'components/Modules/AccessWrapper'
import ReapplyLeaveModal from 'components/Modules/ReapplyLeaveModal'
import {STATUS_TYPES} from 'constants/Leaves'
import {Collapse} from 'antd'
import useWindowsSize from 'hooks/useWindowsSize'
import {WalletOutlined} from '@ant-design/icons'

const TabPane = Tabs.TabPane
const {Panel} = Collapse

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
  const {innerWidth} = useWindowsSize()

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

  const YearlyLeaveExceptCasualandSick = leaveDaysQuery?.data?.data?.data?.data
    ?.filter(
      (item) => !['Casual Leave', 'Sick Leave'].includes(item?._id[0]?.name)
    )
    ?.map((d) => {
      const leaveStartDateArray = d?.leaveDates?.filter(
        (item, index) => index % 2 === 0
      )
      const leaveEndDateArray = d?.leaveDates?.filter(
        (item, index) => index % 2 !== 0
      )

      let leaveArray = []
      leaveStartDateArray?.forEach((item, index) => {
        leaveArray.push(
          convertMsToDay(new Date(leaveEndDateArray[index]) - new Date(item))
        )
      })
      const reducedLeaveDays = leaveArray?.reduce((acc, cur) => acc + cur, 0)
      return [
        d?._id[0]?.name,
        d?.leavesTaken,
        allocatedYealryLeaves?.[d?._id[0]?.name],
        reducedLeaveDays,
      ]
    })
    ?.filter((d) => !!d[0])

  let IsIntern = user?.status === EmployeeStatus?.Probation

  const [nonCasualSickLeaveCardHeight, setNonCasualSickLeaveCardHeight] =
    useState('100%')
  useEffect(() => {
    let tempHeight
    const nonCasualSickLeaveCard = document.getElementsByClassName(
      'non-casual-sick-leave-card'
    )[0]

    if (
      typeof nonCasualSickLeaveCard !== 'undefined' &&
      nonCasualSickLeaveCardHeight === '100%'
    ) {
      tempHeight = `${nonCasualSickLeaveCard.offsetHeight}px`
      setNonCasualSickLeaveCardHeight(
        `${nonCasualSickLeaveCard.offsetHeight}px`
      )
    }
    if (
      tempHeight ||
      (leaveDaysQuery.isSuccess && YearlyLeaveExceptCasualandSick?.length === 0)
    ) {
      setOpenTab(['1'])
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
      YearlyLeaveExceptCasualandSick={YearlyLeaveExceptCasualandSick}
      nonCasualSickLeaveCardHeight={nonCasualSickLeaveCardHeight}
    />
  )

  const leaveCardContent =
    innerWidth > 1600 ? (
      <Row gutter={[20, 20]}>
        <Col
          xl={YearlyLeaveExceptCasualandSick?.length > 0 ? 10 : 12}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          className=" leave-card-col"
        >
          <Card
            title="Quarterly Leave"
            style={{background: 'rgb(232 232 232 / 26%)'}}
            className="padding-right-0 header-pd-0"
          >
            {quarterlyLeaveContent}
          </Card>
        </Col>

        <Col
          xl={YearlyLeaveExceptCasualandSick?.length > 0 ? 14 : 12}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          className="leave-card-col"
        >
          <Card
            title="Annual Leave"
            style={{background: 'rgb(232 232 232 / 26%)'}}
            // bodyStyle={{paddingRight: 0}}
            //headStyle={{paddingTop: 0}}
            className="padding-right-0 header-pd-0"
            bordered={false}
          >
            {annualLeaveContent}
          </Card>
        </Col>
      </Row>
    ) : (
      <Collapse
        activeKey={openTab}
        style={{marginBottom: '2rem'}}
        onChange={(d, e, f) => setOpenTab(d)}
      >
        <Panel
          header={
            <h3>
              <WalletOutlined />
              <span className="gx-ml-3">Quarterly Leave</span>
            </h3>
          }
          key="1"
        >
          {quarterlyLeaveContent}
        </Panel>

        <Panel
          header={
            <h3>
              <WalletOutlined />
              <span className="gx-ml-3">Annual Leave</span>
            </h3>
          }
          key="2"
        >
          {annualLeaveContent}
        </Panel>
      </Collapse>
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
