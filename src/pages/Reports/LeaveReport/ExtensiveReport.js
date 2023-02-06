import {useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {customLeaves} from 'constants/LeaveDuration'
import {LEAVES_COLUMN_REPORT, STATUS_TYPES} from 'constants/Leaves'
import {ADMINISTRATOR} from 'constants/UserNames'
import {
  capitalizeInput,
  changeDate,
  filterSpecificUser,
  MuiFormatDate,
  removeDash,
} from 'helpers/utils'
import React, {useState} from 'react'
import {getLeavesOfAllUsers, getLeaveTypes, getQuarters} from 'services/leaves'
import {getAllUsers} from 'services/users/userDetails'
import {emptyText} from 'constants/EmptySearchAntd'
import moment from 'moment'
import {PAGE10} from 'constants/Common'

const FormItem = Form.Item
const {RangePicker} = DatePicker

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

function ExtensiveReport() {
  const [user, setUser] = useState(undefined)
  const [rangeDate, setRangeDate] = useState([])
  const [leaveStatus, setLeaveStatus] = useState('')
  const [leaveId, setLeaveId] = useState(undefined)
  const [leaveInterval, setLeaveInterval] = useState(undefined)
  const [leaveTitle, setLeaveTitle] = useState('')
  const [page, setPage] = useState(PAGE10)
  const [date, setDate] = useState(undefined)
  const [quarter, setQuarter] = useState(undefined)
  const [form] = Form.useForm()
  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })

  const usersQuery = useQuery(['users'], () => getAllUsers({sort: 'name'}))

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

  const tableData = formattedLeaves(leavesQuery?.data?.data?.data?.data)

  const updatedQuarters = quarterQuery.map((d) => ({
    ...d,
    id: d?._id,
    value: d.quarterName,
  }))

  const handleStatusChange = (statusId) => {
    setPage(PAGE10)
    setLeaveStatus(statusId)
  }

  const handleDateChange = (value) => {
    setPage(PAGE10)
    setRangeDate(value)
    setQuarter(undefined)
  }

  const handleUserChange = (user) => {
    setPage(PAGE10)
    setUser(user)
  }
  const handleLeaveIntervalChange = (value) => {
    setPage(PAGE10)
    setLeaveInterval(value)
  }

  const handleLeaveTypeChange = (value, option) => {
    setPage(PAGE10)
    setLeaveId(value)
    setLeaveTitle(option.children)
    if (option.children !== 'Sick' && option.children !== 'Casual') {
      setLeaveInterval(undefined)
    }
  }

  const handleQuarterChange = (value) => {
    setPage(PAGE10)
    const rangeDate = updatedQuarters.find((d) => d.id === value)
    setQuarter(value)
    setRangeDate([moment(rangeDate.fromDate), moment(rangeDate.toDate)])
  }

  const handleResetFilter = () => {
    setLeaveStatus(undefined)
    setUser(undefined)
    setLeaveId(undefined)
    setLeaveInterval(undefined)
    setLeaveTitle('')
    setQuarter(undefined)
    setRangeDate([])
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  return (
    <div>
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
        <FormItem className="direct-form-item">
          <Select
            placeholder="Select Quarter"
            onChange={handleQuarterChange}
            value={quarter}
            options={updatedQuarters}
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

      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVES_COLUMN_REPORT()}
        dataSource={tableData}
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
        loading={leavesQuery.isFetching}
      />
    </div>
  )
}

export default ExtensiveReport
