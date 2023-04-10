import React, {useState} from 'react'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {
  FIRST_HALF,
  LEAVES_COLUMN,
  PAID_TIME_OFF,
  SECOND_HALF,
  STATUS_TYPES,
} from 'constants/Leaves'
import {CSVLink} from 'react-csv'
import LeaveModal from 'components/Modules/LeaveModal'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getLeavesOfAllUsers,
  getQuarters,
} from 'services/leaves'
import {
  capitalizeInput,
  changeDate,
  filterOptions,
  filterSpecificUser,
  getIsAdmin,
  handleResponse,
  MuiFormatDate,
  removeDash,
} from 'helpers/utils'
import Notification from 'components/Elements/Notification'
import {getAllUsers} from 'services/users/userDetails'
import moment from 'moment'
import useWindowsSize from 'hooks/useWindowsSize'
import AccessWrapper from 'components/Modules/AccessWrapper'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'
import {getLeaveTypes} from 'services/leaves'
import {disabledDate} from 'util/antDatePickerDisabled'
import {sendEmailforLeave} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'
import {socket} from 'pages/Main'
import {ADMINISTRATOR} from 'constants/UserNames'
import {customLeaves, leaveInterval} from 'constants/LeaveDuration'
import {immediateApprovalLeaveTypes} from 'constants/LeaveTypes'
import {PAGE25} from 'constants/Common'
import {leaveHistoryDays} from 'constants/LeaveTypes'

const FormItem = Form.Item
const {RangePicker} = DatePicker

const formattedLeaves = (leaves) => {
  return leaves?.map((leave) => {
    return {
      ...leave,
      key: leave._id,
      coWorker: leave?.user?.name,
      dates: leave?.leaveType?.isSpecial
        ? [leave?.leaveDates?.[0], leave?.leaveDates?.at(-1)]
            ?.map((date) => changeDate(date))
            ?.join('-')
        : leave?.leaveDates
            ?.map((date) => changeDate(date))
            ?.reverse()
            ?.join(' '),
      type: `${leave?.leaveType?.name} ${
        leave?.halfDay === FIRST_HALF || leave?.halfDay === SECOND_HALF
          ? '- ' + removeDash(leave?.halfDay)
          : ''
      }`,
      status: leave?.leaveStatus ? capitalizeInput(leave?.leaveStatus) : '',
    }
  })
}

const formatToUtc = (date) => {
  const m = moment(date._d)
  m.set({h: 5, m: 45, s: 0})
  return m
}

function Leaves({
  selectedDate,
  selectedUser,
  status,
  handleOpenCancelLeaveModal,
  selectedRows,
  rowSelection,
  isExportDisabled,
  userRole,
  permissions,
}) {
  const queryClient = useQueryClient()

  let approveReason
  const [openModal, setOpenModal] = useState(false)
  const [openApproveLeaveModal, setopenApproveLeaveModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [dataToEdit, setDataToEdit] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [leaveStatus, setLeaveStatus] = useState(status ?? '')
  const [leaveId, setLeaveId] = useState(undefined)
  const [leaveTitle, setLeaveTitle] = useState('')
  const [leaveInterval, setLeaveInterval] = useState(undefined)
  const {innerWidth} = useWindowsSize()
  const [leaveFilter, setLeaveFilter] = useState(undefined)

  const [form] = Form.useForm()
  const [date, setDate] = useState(
    selectedDate
      ? {
          utc: selectedDate
            ? selectedDate
            : moment.utc(formatToUtc(moment().startOf('day'))).format(),
          moment: selectedDate
            ? moment(selectedDate).startOf('day')
            : moment().startOf('day'),
        }
      : undefined
  )
  const [rangeDate, setRangeDate] = useState([])
  const [page, setPage] = useState(PAGE25)
  const [leaveDetails, setleaveDetails] = useState({})
  const [user, setUser] = useState(selectedUser ?? undefined)

  const leavesQuery = useQuery(
    [
      'leaves',
      leaveStatus,
      user,
      date,
      rangeDate,
      page,
      leaveId,
      leaveInterval,
    ],
    () =>
      getLeavesOfAllUsers(
        leaveStatus,
        user,
        date?.utc ? date?.utc : '',
        page.page,
        page.limit,
        '-leaveDates,_id',
        leaveId,
        rangeDate?.[0] ? MuiFormatDate(rangeDate[0]?._d) + 'T00:00:00Z' : '',
        rangeDate?.[1] ? MuiFormatDate(rangeDate[1]?._d) + 'T00:00:00Z' : '',
        leaveInterval === 'full-day' ? undefined : leaveInterval
      ),
    {
      onError: (err) => console.log(err),
    }
  )
  const {data: quarterQuery} = useQuery(['quarters'], getQuarters, {
    select: (res) => {
      return res.data?.data?.data?.[0]?.quarters
    },
  })

  const updatedQuarters = quarterQuery?.map((d) => ({
    ...d,
    id: d?._id,
    value: d.quarterName,
  }))
  const combinedFilter = [...leaveHistoryDays, ...(updatedQuarters || [])]

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })

  const handleLeaveTypeChange = (value, option) => {
    setPage(PAGE25)
    setLeaveId(value)
    setLeaveTitle(option?.children)
    if (option.children !== 'Sick' && option.children !== 'Casual') {
      setLeaveInterval(undefined)
    }
  }
  const handleLeaveIntervalChange = (value) => {
    setPage(PAGE25)
    setLeaveInterval(value)
  }

  const handleLeaveFilter = (value) => {
    setPage(PAGE25)
    if (value) {
      if (updatedQuarters?.find((d) => d?.id === value)) {
        const rangeDate = updatedQuarters?.find((d) => d?.id === value)
        setLeaveFilter(value)
        setRangeDate([moment(rangeDate?.fromDate), moment(rangeDate?.toDate)])
      } else if (leaveHistoryDays?.find((d) => d?.id === value)) {
        const tempDays = leaveHistoryDays?.find((d) => d?.id === value)?.value
        const selectedDays = parseInt(tempDays?.split(' ')?.[1])
        const newRangeDates = [
          moment().subtract(selectedDays, 'days'),
          moment(),
        ]
        setLeaveFilter(value)
        setRangeDate(newRangeDates)
      }
    } else {
      setRangeDate([])
      setLeaveFilter(undefined)
    }
  }

  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))
  const usersQuery = useQuery(['users'], () => getAllUsers({sort: 'name'}))

  const leaveApproveMutation = useMutation(
    (payload) => changeLeaveStatus(payload.id, payload.type),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Leave approved successfully',
          'Could not approve leave',
          [
            () => sendEmailNotification(response),
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
            () => queryClient.invalidateQueries(['takenAndRemainingLeaveDays']),
            () =>
              queryClient.invalidateQueries([
                'quartertakenAndRemainingLeaveDays',
              ]),
            () => {
              socket.emit('dashboard-leave')
            },
            () => {
              socket.emit('CUD')
            },
            () => {
              socket.emit('approve-leave', {
                showTo: [response.data.data.data.user._id],
                remarks: 'Your leave has been approved.',
                module: 'Leave',
              })
            },
          ]
        ),
      onError: (error) => {
        Notification({message: 'Could not approve leave', type: 'error'})
      },
    }
  )

  const sendEmailNotification = (res) => {
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      user: res.data.data.data.user,
      leaveApproveReason: approveReason || '',
    })
    setLoader(false)
    handleCloseApproveModal()
  }

  const handleCloseApproveModal = () => {
    setopenApproveLeaveModal(false)
  }

  const handleOpenApproveModal = (leaveDetails) => {
    setleaveDetails(leaveDetails)
    setopenApproveLeaveModal(true)
  }

  const handleApproveLeave = (leave) => {
    approveReason = leave?.leaveApproveReason
    leaveApproveMutation.mutate({
      id: leave._id,
      type: 'approve',
      reason: approveReason,
    })
  }

  const handleStatusChange = (statusId) => {
    setPage(PAGE25)
    setLeaveStatus(statusId)
  }
  const handleUserChange = (user) => {
    setPage(PAGE25)
    setUser(user)
  }

  const handleResetFilter = () => {
    setPage(PAGE25)
    setLeaveStatus(undefined)
    setUser(undefined)
    setDate(undefined)
    setLeaveId(undefined)
    setLeaveInterval(undefined)
    setLeaveTitle('')
    setRangeDate([])
    setLeaveFilter(undefined)
  }

  const handleCloseModal = (
    setSpecificHalf,
    setHalfLeaveApproved,
    setHalfLeavePending,
    setMultipleDatesSelected,
    setCalendarClicked
  ) => {
    setOpenModal(false)
    setIsEditMode(false)
    setSpecificHalf(false)
    setHalfLeaveApproved(false)
    setHalfLeavePending(false)
    setMultipleDatesSelected(false)
    setCalendarClicked(false)
  }

  const handleOpenModal = () => {
    setOpenModal(true)
    setReadOnly(false)
  }

  const handleOpenEditModal = (data, mode) => {
    setIsEditMode(true)
    setDataToEdit(data)
    handleOpenModal()
    setReadOnly(mode)
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const handleDateChange = (value) => {
    setPage(PAGE25)
    setRangeDate(value)
  }
  const data = formattedLeaves(leavesQuery?.data?.data?.data?.data)
  const allUsers = usersQuery?.data?.data?.data?.data?.map((user) => ({
    id: user._id,
    value: user.name,
  }))

  return (
    <div>
      {openModal && (
        <LeaveModal
          leaveData={dataToEdit}
          isEditMode={isEditMode}
          open={openModal}
          onClose={handleCloseModal}
          users={usersQuery?.data?.data?.data?.data}
          readOnly={readOnly}
        />
      )}
      {openApproveLeaveModal && (
        <CancelLeaveModal
          open={openApproveLeaveModal}
          onClose={handleCloseApproveModal}
          onSubmit={handleApproveLeave}
          leaveData={leaveDetails}
          loader={loader}
          setLoader={setLoader}
          title={'Approve Leave'}
          isRequired={false}
          name={'leaveApproveReason'}
        />
      )}

      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline" form={form}>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Status"
                onChange={handleStatusChange}
                value={leaveStatus}
                options={STATUS_TYPES}
              />
            </FormItem>

            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Leave Type"
                onChange={handleLeaveTypeChange}
                value={leaveId}
                options={leaveTypeQuery?.data}
              />
            </FormItem>
            {(leaveTitle === 'Sick' || leaveTitle === 'Casual') && (
              <FormItem className="direct-form-item">
                <Select
                  placeholder="Select Half Day Type"
                  onChange={handleLeaveIntervalChange}
                  options={customLeaves}
                  value={leaveInterval}
                />
              </FormItem>
            )}

            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Co-worker"
                value={user}
                options={filterSpecificUser(
                  usersQuery?.data?.data?.data?.data,
                  ADMINISTRATOR
                )?.map((x) => ({
                  id: x._id,
                  value: x.name,
                }))}
                onChange={handleUserChange}
              />
            </FormItem>
            <FormItem>
              <RangePicker onChange={handleDateChange} value={rangeDate} />
            </FormItem>

            <FormItem
              className="direct-form-item"
              style={{marginRight: '2rem'}}
            >
              <Select
                style={{minWidth: '210px'}}
                placeholder="Select Filter By"
                onChange={handleLeaveFilter}
                value={leaveFilter}
                options={combinedFilter}
              />
            </FormItem>

            <FormItem style={{marginBottom: '3px'}}>
              <Button
                className="gx-btn-primary gx-text-white"
                onClick={handleResetFilter}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
          <div className="gx-btn-form">
            <AccessWrapper role={permissions?.addCoworkersLeaves}>
              <Button
                className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                onClick={handleOpenModal}
                disabled={getIsAdmin()}
              >
                Add Leave
              </Button>
            </AccessWrapper>
            <AccessWrapper role={permissions?.exportCoworkersLeaves}>
              <CSVLink
                filename={'Leaves'}
                data={
                  data?.length > 0
                    ? [
                        ['Co-worker', 'Dates', 'Type', 'Reason', 'Status'],

                        ...data
                          ?.filter((leave) => selectedRows.includes(leave?._id))
                          ?.map((leave) => [
                            leave?.user?.name,
                            leave?.dates,
                            leave?.type,
                            leave?.reason,
                            leave?.status,
                          ]),
                      ]
                    : []
                }
              >
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  disabled={isExportDisabled}
                >
                  Export
                </Button>
              </CSVLink>
            </AccessWrapper>
          </div>
        </div>
      </div>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVES_COLUMN({
          onCancelLeave: handleOpenCancelLeaveModal,
          onApproveClick: handleOpenApproveModal,
          onEditClick: handleOpenEditModal,
          isAdmin: true,
          role: userRole,
          viewLeave: permissions?.viewCoworkersLeaves,
          cancelLeave: permissions?.cancelCoworkersLeaves,
          approveLeave: permissions?.approveCoworkersLeaves,
          editLeave: permissions?.editCoworkersLeaves,
        })}
        dataSource={data}
        // onChange={handleTableChange}
        rowSelection={rowSelection}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['25', '50', '100'],
          showSizeChanger: true,
          total: leavesQuery?.data?.data?.data?.count || 1,
          onShowSizeChange,
          hideOnSinglePage: leavesQuery?.data?.data?.data?.count ? false : true,
          onChange: handlePageChange,
        }}
        loading={leavesQuery.isFetching || leaveApproveMutation.isLoading}
      />
    </div>
  )
}

export default Leaves
