import {useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {LEAVES_COLUMN, STATUS_TYPES} from 'constants/Leaves'
import {changeDate} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import moment, {Moment} from 'moment'
import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {getLeavesOfUser, getQuarters} from 'services/leaves'

const FormItem = Form.Item

const defaultPage = {page: 1, limit: 10}

const formattedLeaves = (leaves: any) => {
  return leaves?.map((leave: any) => ({
    ...leave,
    key: leave._id,
<<<<<<< HEAD
    dates: leave?.leaveDates.map((date: any) => changeDate(date)).join(' , '),
=======
    dates: leave?.leaveDates?.map((date: any) => changeDate(date)).join(' , '),
>>>>>>> 42e5524d65a995a6562005687ef8dfba9391ecea
    type: leave?.leaveType?.name,
    status: leave?.leaveStatus,
  }))
}

function MyHistory({
  userId,
  handleCancelLeave,
  isLoading,
}: {
  userId: string
  handleCancelLeave: (leave: any) => void
  isLoading: boolean
}) {
  const [form] = Form.useForm()
  const location: any = useLocation()
  let selectedDate = location.state?.date
  const {innerWidth} = useWindowsSize()
  const [leaveStatus, setLeaveStatus] = useState('')
  const [quarter, setQuarter] = useState<{id: number; value: any}>()
  const [date, setDate] = useState<{moment: Moment | undefined; utc: string}>({
    utc: selectedDate ? selectedDate : undefined,
    moment: selectedDate ? moment(selectedDate).startOf('day') : undefined,
  })

  const [page, setPage] = useState(defaultPage)

  const userLeavesQuery = useQuery(
    ['userLeaves', leaveStatus, date, page, quarter],
    () =>
      getLeavesOfUser(
        userId,
        leaveStatus,
        date?.utc,
        page.page,
        page.limit,
        quarter?.value.fromDate,
        quarter?.value.toDate
      )
  )
  const quarterQuery = useQuery(['quarters'], () => getQuarters(), {
    select: res => {
      const quarters = res?.data?.data?.data[0]
      return [
        {
          value: 'First Quarter',
          fromDate: quarters.firstQuarter.fromDate,
          toDate: quarters.firstQuarter.toDate,
          id: 1,
        },
        {
          value: 'Second Quarter',
          fromDate: quarters.secondQuarter.fromDate,
          toDate: quarters.secondQuarter.toDate,
          id: 2,
        },
        {
          value: 'Third Quarter',
          fromDate: quarters.thirdQuarter.fromDate,
          toDate: quarters.thirdQuarter.toDate,
          id: 3,
        },
      ]
    },
  })

  const onShowSizeChange = (_: any, pageSize: number) => {
    setPage(prev => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage(prev => ({...prev, page: pageNumber}))
  }

  const handleStatusChange = (statusId: string) => {
    if (page?.page > 1) setPage(defaultPage)

    setLeaveStatus(statusId)
  }

  const handleQuarterChange = (quarterId: number) => {
    if (page?.page > 1) setPage(defaultPage)

    setQuarter({
      id: quarterId,
      value: quarterQuery?.data?.find(quarter => quarter.id === quarterId),
    })
  }
  const handleDateChange = (value: any) => {
    if (page?.page > 1) setPage(defaultPage)
    setDate({
      moment: value,
      utc: moment.utc(value.startOf('day')).format(),
    })
  }

  const handleResetFilter = () => {
    setLeaveStatus('')
    setQuarter(undefined)
    setPage(defaultPage)
    setDate({
      utc: '',
      moment: undefined,
    })
  }

  return (
    <div>
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

          <FormItem style={{marginBottom: '0.5px'}}>
            <DatePicker
              className="gx-mb-3 "
              style={{width: innerWidth <= 748 ? '100%' : '200px'}}
              value={date?.moment}
              onChange={handleDateChange}
            />
          </FormItem>

          <FormItem className="direct-form-item">
            <Select
              placeholder="Select Quarter"
              onChange={handleQuarterChange}
              value={quarter?.id}
              options={quarterQuery?.data}
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
      </div>
      <Table
        className="gx-table-responsive"
        columns={LEAVES_COLUMN(handleCancelLeave).filter(
          (item, index) => index !== 0
        )}
        dataSource={formattedLeaves(userLeavesQuery?.data?.data?.data?.data)}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: userLeavesQuery?.data?.data?.data?.count || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
        loading={userLeavesQuery.isFetching || isLoading}
      />
    </div>
  )
}

export default MyHistory
