import {useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Select} from 'antd'
import {STATUS_TYPES} from 'constants/Leaves'
import {ADMINISTRATOR} from 'constants/UserNames'
import {filterSpecificUser} from 'helpers/utils'
import React, {useState} from 'react'
import {getLeaveTypes} from 'services/leaves'
import {getAllUsers} from 'services/users/userDetails'

const FormItem = Form.Item
const {RangePicker} = DatePicker

function ExtensiveReport() {
  const [user, setUser] = useState(undefined)
  const [rangeDate, setRangeDate] = useState([])
  const [leaveStatus, setLeaveStatus] = useState({id: '', value: 'All'})
  const [leaveId, setLeaveId] = useState(undefined)
  const [leaveInterval, setLeaveInterval] = useState(undefined)
  const [leaveTitle, setLeaveTitle] = useState('')
  const [page, setPage] = useState({page: 1, limit: 10})

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

  const handleStatusChange = (statusId) => {
    setPage({page: 1, limit: 10})
    setLeaveStatus(statusId)
  }

  const handleDateChange = (value) => {
    setRangeDate(value)
  }

  const handleUserChange = (user) => {
    setUser(user)
  }

  const handleLeaveTypeChange = (value, option) => {
    setLeaveId(value)
    setLeaveTitle(option.children)
    if (option.children !== 'Sick' && option.children !== 'Casual') {
      setLeaveInterval(undefined)
    }
  }

  const handleResetFilter = () => {
    setLeaveStatus(undefined)
    setUser(undefined)
    setLeaveId(undefined)
    setLeaveInterval(undefined)
    setLeaveTitle('')
    setRangeDate([])
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
        {/* {(leaveTitle === 'Sick' || leaveTitle === 'Casual') && (
          <FormItem className="direct-form-item">
            <Select
              placeholder="Select Half Day Type"
              onChange={handleLeaveIntervalChange}
              options={customLeaves}
              value={leaveInterval}
            />
          </FormItem>
        )} */}

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

        <FormItem style={{marginBottom: '3px'}}>
          <Button
            className="gx-btn-primary gx-text-white"
            onClick={handleResetFilter}
          >
            Reset
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default ExtensiveReport
