import React, {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Table, Form} from 'antd'
import moment from 'moment'
import {
  attendanceFilter,
  intialDate,
  LATE_ATTENDANCE_COLUMNS,
  leaveCutStatus,
  monthlyState,
  weeklyState,
} from 'constants/Attendance'
import {
  searchLateAttendacentOfUser,
  updateLateAttendance,
} from 'services/attendances'
import {
  changeDate,
  dateDifference,
  handleResponse,
  sortFromDate,
} from 'helpers/utils'
import Select from 'components/Elements/Select'
import {getAllUsers} from 'services/users/userDetails'
import {createLeaveOfUser, getLeaveTypes} from 'services/leaves'
import {notification} from 'helpers/notification'
import {LATE_ARRIVAL, LATE_LEAVE_TYPE_ID} from 'constants/Leaves'
import RangePicker from 'components/Elements/RangePicker'

const FormItem = Form.Item

const formattedAttendances = (attendances: any) => {
  return attendances?.map((att: any) => ({
    ...att,
    key: att._id.userId,
    user: att._id.user,
    count: att.data?.length,
    status: att.data?.every(
      (item: any) => item.lateArrivalLeaveCut === true
    ) ? (
      <span className="gx-text-danger">Leave Cut</span>
    ) : (
      <span className="gx-text-green">Leave Not Cut</span>
    ),
  }))
}

function LateAttendance({userRole}: {userRole: string}) {
  const [sort, setSort] = useState({})
  const [form] = Form.useForm()
  const [date, setDate] = useState(intialDate)
  const [user, setUser] = useState<undefined | string>(undefined)
  const [attFilter, setAttFilter] = useState({id: '1', value: 'Daily'})
  const [leaveCut, setLeaveCut] = useState(leaveCutStatus[0].id)

  //init hooks
  const queryClient = useQueryClient()

  let recordRef: any = {}

  const {data: users} = useQuery(['userForAttendances'], () =>
    getAllUsers({fields: 'name'})
  )

  const {data: leaveTypes} = useQuery(['leaveTypes'], getLeaveTypes)

  const {data, isFetching} = useQuery(
    ['lateAttendaceAttendance', user, date, user, leaveCut],
    () =>
      searchLateAttendacentOfUser({
        userId: user || '',
        lateArrivalLeaveCut: leaveCut,
        fromDate: date?.[0] ? moment.utc(date[0]).format() : '',
        toDate: date?.[1] ? moment.utc(date[1]).format() : '',
      })
  )

  const handleChangeDate = (date: any) => {
    setDate(date ? date : intialDate)
    if (date === null) {
      setAttFilter({id: '1', value: 'Daily'})
    }
  }

  const leaveMutation = useMutation((leave: any) => createLeaveOfUser(leave), {
    onSuccess: (response) => {
      if (response.status) {
        handleCutLeaveInAttendance()
      } else {
        notification({
          message: `Leave creation failed !`,
          type: 'success',
        })
      }
    },
    onError: (error) => {
      notification({message: 'Leave creation failed!', type: 'error'})
    },
  })

  const attendanceGroupMutation = useMutation(
    (lateAttendace: any) => updateLateAttendance(lateAttendace),
    {
      onSuccess: (response) => {
        if (response.status) {
          recordRef = {}
        }
        handleResponse(
          response,
          'Leave Cut Successfull',
          'Leave creation failed',
          [() => queryClient.invalidateQueries(['lateAttendaceAttendance'])]
        )
      },
      onError: (error) => {
        notification({message: 'Leave creation failed!', type: 'error'})
      },
    }
  )

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }

  const handleAttChnageChange = (val: any) => {
    setAttFilter(val)
    switch (val) {
      case 1:
        setDate(intialDate)
        break
      case 2:
        setDate(weeklyState)
        break
      case 3:
        setDate(monthlyState)
        break

      default:
        break
    }
  }

  const handleUserChange = (id: string) => {
    setUser(id)
  }

  const handleLeaveCutStatusChange = (val: any) => {
    setLeaveCut(val)
  }

  const handleReset = () => {
    setUser(undefined)
    setAttFilter({id: '1', value: 'Daily'})
    setDate(intialDate)
    setLeaveCut(leaveCutStatus[0].id)
  }

  const handleCutLeave = (record: any) => {
    recordRef = record
    leaveMutation.mutate({
      id: record._id.userId,
      data: {
        leaveDates: [
          moment(record.data.at(-1).attendanceDate).startOf('day').format(),
        ],
        reason: 'Leave cut due to late attendance',
        leaveType:
          leaveTypes?.data?.data?.data?.find(
            (type: any) => type?.name === LATE_ARRIVAL
          )?._id || LATE_ARRIVAL,
        leaveStatus: 'approved',
      },
    })
  }

  const handleCutLeaveInAttendance = () => {
    const payload = recordRef.data.map((x: any) => x._id) || []

    attendanceGroupMutation.mutate({
      attendance: payload,
      userId: recordRef.data[0].userId,
      leaveCutdate: moment(recordRef.data.at(-1).attendanceDate)
        .startOf('day')
        .format(),
    })
  }

  const expandedRowRender = (parentRow: any) => {
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Punch-in Time',
        dataIndex: 'punchInTime',
        key: 'punchInTime',
      },
      {
        title: 'Punch-out Time',
        dataIndex: 'punchOutTime',
        key: 'punchOutTime',
      },
      {
        title: 'Office hour',
        dataIndex: 'officeHour',
        key: 'officeHour',
      },
    ]
    const data = parentRow?.data?.map((att: any) => ({
      ...att,
      key: att._id,
      date: changeDate(att.attendanceDate),
      punchInTime: moment(att?.punchInTime).format('LTS'),
      punchOutTime: att?.punchOutTime
        ? moment(att?.punchOutTime).format('LTS')
        : '',
      officeHour: att?.punchOutTime
        ? dateDifference(att?.punchOutTime, att?.punchInTime)
        : '',
    }))

    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  const sortedData = (datas: any[]) => {
    // group by attendance date in object
    const groupByAttendance = datas?.reduce((acc, item: any) => {
      acc[item.attendanceDate] = [...(acc[item.attendanceDate] || [])].concat(
        item
      )
      return acc
    }, {})

    // sort  by earliest punchInTime
    Object.keys(groupByAttendance)?.forEach((x) => {
      groupByAttendance[x] = sortFromDate(groupByAttendance[x], 'punchInTime')
    })

    // get first punchInTime Attendance  a day
    return Object.values(groupByAttendance)?.reduce((acc: any, x: any) => {
      acc.push(x[0])
      return acc
    }, [])
  }

  const formattedAttendaces = data?.data?.data?.attendances?.map(
    (att: any) => ({
      ...att,
      data: att.data && sortedData(att.data),
    })
  )

  return (
    <div>
      <div className="gx-mt-2"></div>
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline" form={form}>
            <FormItem>
              <RangePicker handleChangeDate={handleChangeDate} date={date} />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                onChange={handleAttChnageChange}
                value={attFilter}
                options={attendanceFilter}
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Co-worker"
                onChange={handleUserChange}
                value={user}
                options={users?.data?.data?.data?.map((x: any) => ({
                  id: x._id,
                  value: x.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Leave Cut  Status"
                onChange={handleLeaveCutStatusChange}
                value={leaveCut}
                options={leaveCutStatus}
              />
            </FormItem>

            <FormItem>
              <Button
                className="gx-btn gx-btn-primary gx-text-white "
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <Table
        className="gx-table-responsive"
        columns={LATE_ATTENDANCE_COLUMNS(sort, handleCutLeave, userRole)}
        dataSource={formattedAttendances(formattedAttendaces)}
        expandable={{expandedRowRender}}
        onChange={handleTableChange}
        loading={isFetching}
      />
    </div>
  )
}

export default LateAttendance
