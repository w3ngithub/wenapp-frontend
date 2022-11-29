import React, {useState} from 'react'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {LEAVES_COLUMN, STATUS_TYPES} from 'constants/Leaves'
import {CSVLink} from 'react-csv'
import LeaveModal from 'components/Modules/LeaveModal'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {changeLeaveStatus, getLeavesOfAllUsers} from 'services/leaves'
import {
  capitalizeInput,
  changeDate,
  getIsAdmin,
  handleResponse,
  removeDash,
} from 'helpers/utils'
import Notification from 'components/Elements/Notification'
import {getAllUsers} from 'services/users/userDetails'
import moment from 'moment'
import useWindowsSize from 'hooks/useWindowsSize'
import AccessWrapper from 'components/Modules/AccessWrapper'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'
import {getLeaveTypes} from 'services/leaves'
import {
  LEAVES_TAB_ACTIONS_NO_ACCESS,
  LEAVE_TAB_ADD_LEAVE_NO_ACCESS,
} from 'constants/RoleAccess'
import {disabledDate} from 'util/antDatePickerDisabled'
import {sendEmailforLeave} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'

const FormItem = Form.Item

const formattedLeaves = (leaves) => {
  return leaves?.map((leave) => ({
    ...leave,
    key: leave._id,
    coWorker: leave?.user?.name,
    dates: leave?.leaveDates
      ?.map((date) => changeDate(date))
      .join(
        leave?.leaveType?.name === 'Maternity' ||
          leave?.leaveType?.name === 'Paternity' ||
          leave?.leaveType?.name === 'Paid Time Off'
          ? ' - '
          : ' '
      ),
    type: `${leave?.leaveType?.name} ${
      leave?.halfDay === 'first-half' || leave?.halfDay === 'second-half'
        ? '- ' + removeDash(leave?.halfDay)
        : ''
    }`,
    status: leave?.leaveStatus ? capitalizeInput(leave?.leaveStatus) : '',
  }))
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
  const {innerWidth} = useWindowsSize()
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
  const [page, setPage] = useState({page: 1, limit: 10})
  const [leaveDetails, setleaveDetails] = useState({})
  const [user, setUser] = useState(selectedUser ?? undefined)

  const leavesQuery = useQuery(
    ['leaves', leaveStatus, user, date, page, leaveId],
    () =>
      getLeavesOfAllUsers(
        leaveStatus,
        user,
        date?.utc ? date?.utc : '',
        page.page,
        page.limit,
        '-leaveDates',
        leaveId
      ),
    {
      onError: (err) => console.log(err),
    }
  )

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })

  const handleLeaveTypeChange = (value) => {
    setLeaveId(value)
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
    setLeaveStatus(statusId)
  }
  const handleUserChange = (user) => {
    setUser(user)
  }

  const handleResetFilter = () => {
    setLeaveStatus(undefined)
    setUser(undefined)
    setDate(undefined)
    setLeaveId(undefined)
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
    const m = moment(value._d)
    m.set({h: 5, m: 45, s: 0})
    setDate({moment: value, utc: moment.utc(m._d).format()})
  }
  const data = formattedLeaves(leavesQuery?.data?.data?.data?.data)
  const allUsers = usersQuery?.data?.data?.data?.data?.map((user) => ({
    id: user._id,
    value: user.name,
  }))
  return (
    <div>
      <LeaveModal
        leaveData={dataToEdit}
        isEditMode={isEditMode}
        open={openModal}
        onClose={handleCloseModal}
        users={usersQuery?.data?.data?.data?.data}
        readOnly={readOnly}
      />

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

            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Co-worker"
                value={user}
                options={allUsers}
                onChange={handleUserChange}
              />
            </FormItem>
            <FormItem style={{marginBottom: '0.5px'}}>
              <DatePicker
                className="gx-mb-3 "
                style={{width: innerWidth <= 748 ? '100%' : '200px'}}
                value={date?.moment}
                onChange={handleDateChange}
                disabledDate={disabledDate}
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
          <AccessWrapper noAccessRoles={LEAVES_TAB_ACTIONS_NO_ACCESS}>
            <div className="gx-btn-form">
              <AccessWrapper noAccessRoles={LEAVE_TAB_ADD_LEAVE_NO_ACCESS}>
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  onClick={handleOpenModal}
                  disabled={getIsAdmin()}
                >
                  Add Leave
                </Button>
              </AccessWrapper>
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
            </div>
          </AccessWrapper>
        </div>
      </div>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVES_COLUMN(
          handleOpenCancelLeaveModal,
          handleOpenApproveModal,
          handleOpenEditModal,
          true,
          userRole
        )}
        dataSource={data}
        // onChange={handleTableChange}
        rowSelection={rowSelection}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
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
