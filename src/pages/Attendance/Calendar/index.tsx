import React, {useState} from 'react'
import {Card, Spin} from 'antd'
import {useNavigate} from 'react-router-dom'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {useQuery} from '@tanstack/react-query'
import {milliSecondIntoHours, MuiFormatDate, sortFromDate} from 'helpers/utils'
import {searchAttendacentOfUser} from 'services/attendances'
import {monthlyState} from 'constants/Attendance'
import {getLeavesOfAllUsers} from 'services/leaves'
import useWindowsSize from 'hooks/useWindowsSize'
import {ATTENDANCE} from 'helpers/routePath'
import {LEAVES_TYPES} from 'constants/Leaves'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

const localizer = momentLocalizer(moment)

function AttendanceCalendar() {
  const navigate = useNavigate()

  const user = useSelector(selectAuthUser)
  const {innerWidth} = useWindowsSize()
  const [date, setDate] = useState(monthlyState)
  const {data, isLoading} = useQuery(['userAttendance', user, date], () =>
    searchAttendacentOfUser({
      userId: user._id,
      fromDate: date?.[0] ? MuiFormatDate(date[0]) + 'T00:00:00Z' : '',
      toDate: date?.[1] ? MuiFormatDate(date[1]) + 'T00:00:00Z' : '',
    })
  )
  const {data: userLeaves} = useQuery(
    ['userLeaves'],
    () => getLeavesOfAllUsers('approved', user._id),
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
    } else {
      setDate([calendarDate.start, calendarDate.end])
    }
  }

  const handleEventStyle = (event: any) => {
    let style: any = {
      fontSize: '13px',
      width: innerWidth <= 729 ? '2.5rem' : 'fit-content',
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
    if (
      !event.isLessHourWorked &&
      event.type !== 'leave' &&
      event.type !== 'longLeaves'
    )
      style = {
        ...style,
        backgroundColor: '#038fde',
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
  const attendances = data?.data?.data?.attendances[0]?.data?.map(
    (attendance: any) => {
      const sortedAttendance = sortFromDate(
        attendance?.data,
        'punchInTime'
      ).filter((attendance: any) => attendance.punchOutTime)

      const totalHoursWorked = milliSecondIntoHours(
        sortedAttendance
          ?.map((x) =>
            x?.punchOutTime
              ? new Date(x?.punchOutTime).getTime() -
                new Date(x?.punchInTime).getTime()
              : ''
          )
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

      if (totalHoursWorked.trim() !== '') {
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
        state: {tabKey: '2', date: new Date(data?.start).toJSON()},
      })
    else
      navigate(`/${ATTENDANCE}`, {
        state: {tab: '1', date: data?.id?.attendanceDate},
      })
  }

  return (
    <Card className="gx-card" title="Calendar">
      <Spin spinning={isLoading}>
        <div className="gx-rbc-calendar">
          <Calendar
            localizer={localizer}
            events={[...(attendances || []), ...(leaves || [])]}
            startAccessor="start"
            endAccessor="end"
            onRangeChange={handleCalendarRangeChange}
            popup
            views={['month', 'week', 'day']}
            eventPropGetter={handleEventStyle}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </Spin>
    </Card>
  )
}

export default AttendanceCalendar
