import {Button, Card, Form, Spin} from 'antd'
import React, {useState} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {useQuery} from '@tanstack/react-query'
import {MuiFormatDate, sortFromDate} from 'helpers/utils'
import {searchAttendacentOfUser} from 'services/attendances'
import {monthlyState} from 'constants/Attendance'
import {getLeavesOfAllUsers} from 'services/leaves'
import Select from 'components/Elements/Select'
import {getAllUsers} from 'services/users/userDetails'
import {useNavigate} from 'react-router-dom'
import {ATTENDANCE} from 'helpers/routePath'

const localizer = momentLocalizer(moment)
const FormItem = Form.Item

function AdminAttendanceCalendar() {
  const navigate = useNavigate()

  const [date, setDate] = useState(monthlyState)
  const [user, setUser] = useState<undefined | string>(undefined)

  const {data: users, isLoading} = useQuery(['userForAttendances'], () =>
    getAllUsers({fields: 'name'})
  )
  const {data, isFetching: attendanceLoading} = useQuery(
    ['userAttendance', user, date],
    () =>
      searchAttendacentOfUser({
        userId: user,
        fromDate: date?.[0] ? MuiFormatDate(date[0]) + 'T00:00:00Z' : '',
        toDate: date?.[1] ? MuiFormatDate(date[1]) + 'T00:00:00Z' : '',
      })
  )
  const {data: userLeaves} = useQuery(
    ['userLeaves', user],
    () => getLeavesOfAllUsers('approved', user),
    {
      select: res => {
        return res?.data?.data?.data
      },
    }
  )

  const handleCalendarRangeChange = (calendarDate: any) => {
    const mom = moment(moment(calendarDate[0]).add(1, 'days'))
      .utc()
      .format()
    const filterByWeek = calendarDate.length === 7
    const filterByDay = calendarDate.length === 1
    if (filterByWeek) {
      setDate([calendarDate[0], calendarDate[6]])
    } else if (filterByDay) {
      setDate([calendarDate[0], mom])
    } else {
      setDate([calendarDate.start, calendarDate.end])
    }
  }

  const handleUserChange = (id: string) => {
    setUser(id)
  }

  const handleReset = () => {
    setUser(undefined)
  }

  const handleEventStyle = (event: any) => {
    let style: any = {
      fontSize: '14px',
      width: 'fit-content',
      margin: '0px auto',
      fontWeight: '500',
      height: '27px',
      padding: '5px 10px',
    }

    if (event.type === 'leave')
      style = {
        ...style,
        backgroundColor: '#FC6BAB',
      }

    if (event.isLessHourWorked)
      style = {
        ...style,
        backgroundColor: '#E14B4B',
      }

    return {
      style,
    }
  }

  let attendances: any[] = [],
    leaves: any[] = []

  userLeaves?.forEach((leave: any) => {
    leaves.push({
      id: leave?._id,
      title: leave?.leaveType?.name,
      start: new Date(leave?.leaveDates?.[0]),
      end: new Date(leave?.leaveDates?.[0]),
      type: 'leave',
      allDay: true,
    })
  })

  data?.data?.data?.attendances[0]?.data?.forEach((attendance: any) => {
    const sortedAttendance = sortFromDate(
      attendance?.data,
      'punchInTime'
    ).filter((attendance: any) => attendance.punchOutTime)

    const totalHoursWorked: number = sortedAttendance.reduce(
      (acc: number, attendance: any) =>
        new Date(attendance.punchOutTime).getHours() -
        new Date(attendance.punchInTime).getHours() +
        acc,
      0
    )

    attendances.push({
      id: attendance?._id,
      title: 'Hours: ' + totalHoursWorked,
      start: new Date(attendance._id?.attendanceDate),
      end: new Date(attendance._id?.attendanceDate),
      isLessHourWorked: totalHoursWorked < 9,
      allDay: true,
    })
  })

  const handleSelectEvent = (data: any) => {
    if (data.type === 'leave')
      navigate(`/leave`, {
        state: {
          tabKey: '3',
          date: new Date(data?.start).toJSON(),
          user,
          leaveStatus: 'approved',
        },
      })
    else
      navigate(`/${ATTENDANCE}`, {
        state: {tab: '3', date: data?.id?.attendanceDate, user},
      })
  }

  return (
    <Card className="gx-card" title="Calendar">
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline">
            <FormItem className="direct-form-item">
              <Select
                placeholder="Search Co-worker"
                onChange={handleUserChange}
                value={user}
                options={users?.data?.data?.data?.map((x: any) => ({
                  id: x._id,
                  value: x.name,
                }))}
              />
            </FormItem>

            <FormItem>
              <Button
                className="gx-btn gx-btn-primary gx-text-white "
                onClick={handleReset}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <Spin spinning={isLoading || attendanceLoading}>
        <div className="gx-rbc-calendar">
          <Calendar
            localizer={localizer}
            events={user ? [...attendances, ...leaves] : []}
            startAccessor="start"
            endAccessor="end"
            onRangeChange={handleCalendarRangeChange}
            popup
            eventPropGetter={handleEventStyle}
            views={['month', 'week', 'day']}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </Spin>
    </Card>
  )
}

export default AdminAttendanceCalendar
