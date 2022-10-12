import {useQuery} from '@tanstack/react-query'
import {Button,  DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {LEAVES_COLUMN, STATUS_TYPES} from 'constants/Leaves'
import {changeDate} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import moment, {Moment} from 'moment'
import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {getLeavesOfUser} from 'services/leaves'
import { disabledDate } from 'util/antDatePickerDisabled'

const FormItem = Form.Item

const defaultPage = {page: 1, limit: 10}

const formattedLeaves = (leaves: any) => {
  return leaves?.map((leave: any) => ({
    ...leave,
    key: leave._id,
    dates: leave?.leaveDates
      .map((date: any) => changeDate(date))
      .join(
        leave?.leaveType?.name === 'Maternity' ||
          leave?.leaveType?.name === 'Paternity' ||
          leave?.leaveType?.name === 'Paid Time Off'
          ? ' - '
          : ' , '
      ),
    type: leave?.leaveType?.name,
    status: leave?.leaveStatus,
  }))
}

function MyHistory({
  userId,
  handleOpenCancelLeaveModal,
  isLoading,
}: {
  userId: string
  handleCancelLeave: (leave: any) => void
  handleOpenCancelLeaveModal: (param : any) => void
  isLoading: boolean
}) {
  const [form] = Form.useForm()
  const location: any = useLocation()
  let selectedDate = location.state?.date
  const {innerWidth} = useWindowsSize()
  const [leaveStatus, setLeaveStatus] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<{moment: Moment | undefined; utc: string}>({
    utc: selectedDate ? selectedDate : undefined,
    moment: selectedDate ? moment(selectedDate).startOf('day') : undefined,
  })

  const [page, setPage] = useState(defaultPage)

  const userLeavesQuery = useQuery(
    ['userLeaves', leaveStatus, date, page],
    () => getLeavesOfUser(userId, leaveStatus, date?.utc, page.page, page.limit)
  )

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

  const handleDateChange = (value: any) => {
    if (page?.page > 1) setPage(defaultPage)

    setDate({
      moment: value,
      utc: moment
        .utc(value._d)
        .startOf('day')
        .format(),
    })
  }

  const handleResetFilter = () => {
    setLeaveStatus('')
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
      </div>
      <Table
        className="gx-table-responsive"
        columns={LEAVES_COLUMN(handleOpenCancelLeaveModal).filter(
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
          hideOnSinglePage: userLeavesQuery?.data?.data?.data?.count ? false : true,
          onChange: handlePageChange,
        }}
        loading={userLeavesQuery.isFetching || isLoading}
      />
    </div>
  )
}

export default MyHistory
