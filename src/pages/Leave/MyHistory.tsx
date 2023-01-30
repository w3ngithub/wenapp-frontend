import {useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {LEAVES_COLUMN, STATUS_TYPES} from 'constants/Leaves'
import {MuiFormatDate, capitalizeInput, changeDate, removeDash} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import moment, {Moment} from 'moment'
import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {getLeavesOfUser} from 'services/leaves'
import {disabledDate} from 'util/antDatePickerDisabled'
import LeaveModal from 'components/Modules/LeaveModal'
import {getLeaveTypes} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'

const FormItem = Form.Item
const {RangePicker} = DatePicker

const defaultPage = {page: 1, limit: 10}


const formattedLeaves = (leaves: any) => {
  return leaves?.map((leave: any) => ({
    ...leave,
    key: leave._id,
    dates: leave?.leaveDates
      ?.map((date: any, index: any) => changeDate(date))
      .join(
        leave?.leaveType?.name === 'Maternity' ||
          leave?.leaveType?.name === 'Paternity' ||
          leave?.leaveType?.name === 'Paid Time Off'
          ? ' - '
          : '\r\n'
      ),
    type: `${leave?.leaveType?.name} ${
      leave?.halfDay === 'first-half' || leave?.halfDay === 'second-half'
        ? '- ' + removeDash(leave?.halfDay)
        : ''
    }`,
    status: leave?.leaveStatus ? capitalizeInput(leave?.leaveStatus) : '',
  }))
}

function MyHistory({
  userId,
  handleOpenCancelLeaveModal,
  isLoading,
  permissions,
  reApplyLeave
}: {
  userId: string
  handleCancelLeave: (leave: any) => void
  handleOpenCancelLeaveModal: (param: any) => void
  isLoading: boolean
  permissions: any
  reApplyLeave:(leave:any)=>void
}) {
  const [form] = Form.useForm()
  const location: any = useLocation()
  let selectedDate = location.state?.date
  const {innerWidth} = useWindowsSize()
  const [datatoShow, setdatatoShow] = useState({})
  const [openModal, setModal] = useState<boolean>(false)
  const [leaveStatus, setLeaveStatus] = useState<string | undefined>('')
  const [leaveTypeId, setLeaveType] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<{moment: Moment | undefined; utc: string}>({
    utc: selectedDate ? selectedDate : undefined,
    moment: selectedDate ? moment(selectedDate).startOf('day') : undefined,
  })

  const [rangeDate, setRangeDate] = useState<any>([])


  const [page, setPage] = useState(defaultPage)


  const userLeavesQuery = useQuery(
    ['userLeaves', leaveStatus, rangeDate, page, leaveTypeId],
    () =>
      getLeavesOfUser(
        userId,
        leaveStatus,
        date?.utc,
        page.page,
        page.limit,
        rangeDate?.[0] ? MuiFormatDate(rangeDate[0]?._d) + 'T00:00:00Z' : '',
        rangeDate?.[1] ? MuiFormatDate(rangeDate[1]?._d) + 'T00:00:00Z' : '',
        '-leaveDates,_id',
        leaveTypeId
      )
  )



  const handleLeaveType = (value: string | undefined) => {
    setLeaveType(value)
  }


  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => {
      return [
        ...res?.data?.data?.data?.map((type: any) => ({
          id: type._id,
          value: type?.name.replace('Leave', '').trim(),
        })),
      ]
    },
  })

  const onShowSizeChange = (_: any, pageSize: number) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const handleStatusChange = (statusId: string) => {
    if (page?.page > 1) setPage(defaultPage)
    setLeaveStatus(statusId)
  }

  const handleDateChange = (value: any) => {
    if (page?.page > 1) setPage(defaultPage)

    setRangeDate(value)

  }

  const handleShow = (data: any, mode: boolean) => {
    setdatatoShow(data)
    setModal(true)
  }

  const handleResetFilter = () => {
    setLeaveStatus(undefined)
    setLeaveType(undefined)
    setPage(defaultPage)
    setRangeDate([])
    setDate({
      utc: '',
      moment: undefined,
    })
  


  }
  return (
    <div>
      {openModal && (
        <LeaveModal
          open={openModal}
          leaveData={datatoShow}
          onClose={() => setModal(false)}
          isEditMode={true}
          users={[]}
          readOnly={true}
          showWorker={false}
        />
      )}

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
              onChange={handleLeaveType}
              value={leaveTypeId}
              options={leaveTypeQuery?.data}
            />
          </FormItem>

          <FormItem style={{marginBottom: '0.5px'}}>
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
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVES_COLUMN({
          onCancelLeave: handleOpenCancelLeaveModal,
          onApproveClick: (leave) => {
            reApplyLeave(leave)
          },
          onEditClick: handleShow,
          viewLeave: permissions?.viewMyLeaveDetails,
          cancelLeave: permissions?.cancelMyLeaves,
        }).filter((item, index) => index !== 0)}
        dataSource={formattedLeaves(userLeavesQuery?.data?.data?.data?.data)}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: userLeavesQuery?.data?.data?.data?.count || 1,
          onShowSizeChange,
          hideOnSinglePage: userLeavesQuery?.data?.data?.data?.count
            ? false
            : true,
          onChange: handlePageChange,
        }}
        loading={userLeavesQuery.isFetching || isLoading}
      />
    </div>
  )
}

export default MyHistory
