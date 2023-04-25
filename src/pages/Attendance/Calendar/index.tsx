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
import {FIRST_HALF} from 'constants/Leaves'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {getAllHolidays} from 'services/resources'
import {useCleanCalendar} from 'hooks/useCleanCalendar'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'

const localizer = momentLocalizer(moment)

function AttendanceCalendar() {
  const navigate = useNavigate()

  const user = useSelector(selectAuthUser)
  const {allocatedOfficeHours} = useSelector(
    (state: any) => state.configurations
  )
  const {innerWidth} = useWindowsSize()
  const [date, setDate] = useState(monthlyState)
  const {themeType} = useSelector((state: any) => state.settings)
  const darkMode = themeType === THEME_TYPE_DARK
  const {currentMonth, thisMonthsEndDate, monthChangeHandler} =
    useCleanCalendar()

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
  const {data: Holidays} = useQuery(['DashBoardHolidays'], () =>
    getAllHolidays({sort: '-createdAt', limit: '1'})
  )
  const holidaysCalendar = Holidays?.data?.data?.data?.[0]?.holidays?.map(
    (x: any) => ({
      title: x.title,
      start: new Date(x.date),
      end: new Date(x.date),
      type: 'holiday',
    })
  )

  let holidaysDates: any[] = holidaysCalendar?.map((holiday: any) =>
    MuiFormatDate(holiday?.start)
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
      if (moment(calendarDate.start).date() !== 1) {
        const startDate = moment(calendarDate.start)
          .endOf('month')
          .add(1, 'day')
        const endDate = moment(startDate).endOf('month')
        setDate([startDate, endDate])
      } else {
        setDate([calendarDate.start, moment(calendarDate.start).endOf('month')])
      }
    }
  }

  const handleEventStyle = (event: any) => {
    const isEventInPreviousMonth =
      moment(event?.end) < moment(currentMonth).startOf('month')
    const isEventInNextMonth =
      moment(event?.end) > moment(currentMonth).endOf('month')
    const isOffRange = isEventInPreviousMonth || isEventInNextMonth

    let style: any = {
      fontSize: '14px',
      width: innerWidth <= 729 ? '2.5rem' : 'fit-content',
      margin: '0px auto',
      fontWeight: '500',
      height: '27px',
      padding: '5px 10px',
      color: darkMode ? 'white' : '#100c0ca6',
      backgroundColor: 'transparent',
    }

    if (isOffRange) {
      style = {...style, display: 'none'}
    }
    if (event?.hide) {
      style = {...style, display: 'none'}
    }
    if (event.type === 'leave') {
      style = {
        ...style,
        padding: '4rem 1rem 0 0rem',
      }
    }

    if (event.isLessHourWorked)
      style = {
        ...style,
        backgroundColor: '#E14B4B',
      }
    if (!event.isLessHourWorked && event.type !== 'leave')
      style = {
        ...style,
        backgroundColor: '#038fde',
      }
    if (event.type === 'holiday')
      style = {
        ...style,
        backgroundColor: 'transparent',
        padding:
          innerWidth < 1556 && event?.title?.length > 19
            ? '3rem 3px 0 1.1rem'
            : '4rem 0.3rem 0 0',
      }

    return {
      style,
    }
  }

  let leaves: any[] = []

  userLeaves?.forEach((leave: any) => {
    const eventStartsInNextMonth =
      thisMonthsEndDate < moment(leave?.leaveDates?.[0])

    let extraInfo = ''

    if (leave?.halfDay) {
      extraInfo = leave?.halfDay === FIRST_HALF ? '1st' : `2nd`
    }

    leave?.leaveDates?.forEach((date: string) => {
      leaves.push({
        id: leave?._id,
        title: `${leave?.leaveType?.name}${
          extraInfo ? '(' + extraInfo + ')' : ''
        }`,
        start: new Date(date),
        end: new Date(date),
        type: 'leave',
        allDay: true,
        hide: eventStartsInNextMonth,
      })
    })
  })
  let leaveDates: any[] = leaves?.map((leave) => MuiFormatDate(leave?.start))

  const DayPropGetter = (date: any) => {
    // if the day lies in the prev month or next month don't decorate
    if (
      moment(date) < moment(currentMonth).startOf('month') ||
      moment(date) > moment(currentMonth).endOf('month')
    ) {
      return
    }

    return {
      ...(leaveDates?.includes(MuiFormatDate(date)) && {
        style: {
          backgroundColor: '#efbad280',
        },
      }),
      ...(holidaysDates?.includes(MuiFormatDate(date)) && {
        style: {
          backgroundColor: '#d3828259',
        },
      }),
    }
  }

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
          isLessHourWorked: totalTime < allocatedOfficeHours,
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
            events={[
              ...(attendances || []),
              ...(leaves || []),
              ...(holidaysCalendar || []),
            ]}
            startAccessor="start"
            endAccessor="end"
            onRangeChange={handleCalendarRangeChange}
            popup
            views={['month', 'week', 'day']}
            eventPropGetter={handleEventStyle}
            onSelectEvent={handleSelectEvent}
            onNavigate={monthChangeHandler}
            dayPropGetter={DayPropGetter}
          />
        </div>
      </Spin>
    </Card>
  )
}

export default AttendanceCalendar
