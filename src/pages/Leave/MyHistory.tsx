import {useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Table} from 'antd'
import Select from 'components/Elements/Select'
import {LEAVES_COLUMN, STATUS_TYPES} from 'constants/Leaves'
import {capitalizeInput, changeDate, removeDash} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import moment, {Moment} from 'moment'
import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {getLeavesOfUser} from 'services/leaves'
import {disabledDate} from 'util/antDatePickerDisabled'
import LeaveModal from 'components/Modules/LeaveModal'
import {getLeaveTypes} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

const FormItem = Form.Item

const defaultPage = {page: 1, limit: 10}

const formattedLeaves = (leaves: any) => {
  return leaves?.map((leave: any) => ({
    ...leave,
    key: leave._id,
    dates: leave?.leaveDates.map((date: any, index: any) => {
      if (
        (leave?.leaveType?.name === 'Maternity' ||
          leave?.leaveType?.name === 'Paternity' ||
          leave?.leaveType?.name === 'Paid Time Off') &&
        index < leave?.leaveDates?.length - 1
      ) {
        return <p>{`${changeDate(date)} - `}</p>
      } else {
        return <p>{changeDate(date)}</p>
      }
    }),
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
}: {
  userId: string
  handleCancelLeave: (leave: any) => void
  handleOpenCancelLeaveModal: (param: any) => void
  isLoading: boolean
  permissions: any
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

  const [page, setPage] = useState(defaultPage)

  const {gender} = useSelector(selectAuthUser)

  const userLeavesQuery = useQuery(
    ['userLeaves', leaveStatus, date, page, leaveTypeId],
    () =>
      getLeavesOfUser(
        userId,
        leaveStatus,
        date?.utc,
        page.page,
        page.limit,
        '',
        '',
        '-leaveDates,_id',
        leaveTypeId
      )
  )

  const handleLeaveType = (value: string | undefined) => {
    setLeaveType(value)
  }

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => {
      if (gender === 'Male') {
        return [
          ...res?.data?.data?.data
            ?.filter((types: any) => types.name !== 'Substitute Leave')
            .map((type: any) => ({
              id: type._id,
              value: type?.name.replace('Leave', '').trim(),
            })),
        ]
      } else {
        return [
          ...res?.data?.data?.data?.map((type: any) => ({
            id: type._id,
            value: type?.name.replace('Leave', '').trim(),
          })),
        ]
      }
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

    setDate({
      moment: value,
      utc: moment.utc(value._d).startOf('day').format(),
    })
  }

  const handleShow = (data: any, mode: boolean) => {
    setdatatoShow(data)
    setModal(true)
  }

  const handleResetFilter = () => {
    setLeaveStatus(undefined)
    setLeaveType(undefined)
    setPage(defaultPage)
    setDate({
      utc: '',
      moment: undefined,
    })
  }
  return (
    <div>
      <LeaveModal
        open={openModal}
        leaveData={datatoShow}
        onClose={() => setModal(false)}
        isEditMode={true}
        users={[]}
        readOnly={true}
        showWorker={false}
      />

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
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVES_COLUMN({
          onCancelLeave: handleOpenCancelLeaveModal,
          onApproveClick: () => {},
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
