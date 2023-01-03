import {Button, Card, Form, Spin} from 'antd'
import React, {useState} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {useQuery} from '@tanstack/react-query'
import {milliSecondIntoHours, MuiFormatDate, sortFromDate} from 'helpers/utils'
import {searchAttendacentOfUser} from 'services/attendances'
import {ATTENDANCE_COLUMNS, monthlyState} from 'constants/Attendance'
import {getLeavesOfAllUsers} from 'services/leaves'
import Select from 'components/Elements/Select'
import {getAllUsers} from 'services/users/userDetails'
import {useNavigate} from 'react-router-dom'
import {ATTENDANCE} from 'helpers/routePath'
import {LEAVES_TYPES} from 'constants/Leaves'

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
      select: (res) => {
        return res?.data?.data?.data
      },
    }
  )

  const handleCalendarRangeChange = (calendarDate: any) => {
    const mom = moment(moment(calendarDate[0]).add(1, 'days')).utc().format()
    const filterByWeek = calendarDate.length === 7
    const filterByDay = calendarDate.length === 1
    if (filterByWeek) {
      setDate([calendarDate[0], calendarDate[6]])
    } else if (filterByDay) {
      setDate([calendarDate[0], mom])
    } else{
      if(moment(calendarDate.start).date()!==1){
        const startDate = moment(calendarDate.start).endOf('month').add(1,'day')
        const endDate = moment(startDate).endOf('month')
        setDate([startDate,endDate])
      } 
      else{
      setDate([calendarDate.start, moment(calendarDate.start).endOf('month')])
      }
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
      color: 'white',
    }

    if (event.type === 'leave')
      style = {
        ...style,
        backgroundColor: '#FC6BAB',
      }

    if (event.type === 'longLeaves')
      style = {
        ...style,
        width: 'auto',
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

  let leaves: any[] = []

  userLeaves?.forEach((leave: any) => {
    leaves.push({
      id: leave?._id,
      title: leave?.leaveType?.name,
      start: new Date(leave?.leaveDates?.[0]),
      end: new Date(
        leave?.leaveType?.name.split(' ')[0].toLowerCase() ===
          LEAVES_TYPES.Casual ||
        leave?.leaveType?.name.split(' ')[0].toLowerCase() === LEAVES_TYPES.Sick
          ? leave?.leaveDates?.[0]
          : leave?.leaveDates?.[1]
      ),
      type:
        leave?.leaveType?.name.split(' ')[0].toLowerCase() ===
          LEAVES_TYPES.Casual ||
        leave?.leaveType?.name.split(' ')[0].toLowerCase() === LEAVES_TYPES.Sick
          ? 'leave'
          : 'longLeaves',
      allDay: true,
    })
  })

  const attendances = data?.data?.data?.attendances?.[0]?.data?.map(
    (attendance: any) => {
      let sortedAttendance = sortFromDate(
        attendance?.data,
        'punchInTime'
      ).filter((attendance: any) => attendance.punchOutTime)

      const totalHoursWorked = milliSecondIntoHours(
        sortedAttendance
          ?.map((x) => {
            return x?.punchOutTime
              ? new Date(x?.punchOutTime).getTime() -
                  new Date(x?.punchInTime).getTime()
              : ''
          })
          .filter(Boolean)
          ?.reduce((accumulator, value) => {
            return +accumulator + +value
          }, 0)
      )
      const hrsMin = totalHoursWorked
        ?.trim()
        ?.split(' ')
        ?.filter((item) => !isNaN(+item))
      const time = totalHoursWorked?.trim()?.split(' ')

      let totalTime = 0
      if (hrsMin?.length === 2) {
        totalTime = +hrsMin[0] + +hrsMin[1] / 60
      }
      if (hrsMin?.length === 1) {
        if (time?.[1] === 'hrs') {
          totalTime = +hrsMin[0]
        } else {
          totalTime = +hrsMin[0] / 60
        }
      }
      if (totalHoursWorked?.trim() !== '') {
        return {
          id: attendance?._id,
          title: totalHoursWorked,
          start: new Date(attendance._id?.attendanceDate),
          end: new Date(attendance._id?.attendanceDate),
          isLessHourWorked: totalTime < 9,
          allDay: true,
        }
      } else return null
    }
  )

  const handleSelectEvent = (data: any) => {
    if (data.type === 'leave' || data.type === 'longLeaves')
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
            events={user ? [...(attendances || []), ...(leaves || [])] : []}
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
