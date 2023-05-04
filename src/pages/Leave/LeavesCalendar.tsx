import {Card} from 'antd'
import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {Spin} from 'antd'
import {getFiscalYearLeaves} from 'services/leaves'
import {
  FIRST_HALF,
  LATE_ARRIVAL,
  LEAVES_TYPES,
  SECOND_HALF,
} from 'constants/Leaves'
import {useCleanCalendar} from 'hooks/useCleanCalendar'
import {useSelector} from 'react-redux'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'

const localizer = momentLocalizer(moment)

const LeavesCalendar = () => {
  const {themeType} = useSelector((state: any) => state.settings)

  const darkMode = themeType === THEME_TYPE_DARK
  const {monthChangeHandler} = useCleanCalendar()

  const leavesQuery = useQuery(
    ['leavesCalendar'],
    () => getFiscalYearLeaves(),
    {
      onError: (err) => console.log(err),
      select: (res) => {
        let allLeaves: any[] = []

        res?.data?.data?.data.forEach((leave: any) => {
          const isLeavePaternity =
            leave?._id?.leaveType[0]?.toLowerCase() === LEAVES_TYPES.Paternity
          const isLeaveMaternity =
            leave?._id?.leaveType[0]?.toLowerCase() === LEAVES_TYPES.Maternity
          const isLeavePTO =
            leave?._id?.leaveType[0]?.toLowerCase() === LEAVES_TYPES.PTO
          const isLeaveBereavement =
            leave?._id?.leaveType[0]?.toLowerCase() === LEAVES_TYPES.Bereavement

          if (
            isLeavePaternity ||
            isLeaveMaternity ||
            isLeavePTO ||
            isLeaveBereavement
          ) {
            allLeaves.push({
              ...leave?._id,
              leaveDates: [...leave?.leaveDates],
            })
          } else {
            leave.leaveDates.forEach((date: string) => {
              allLeaves.push({...leave?._id, leaveDates: date})
            })
          }
        })
        return allLeaves
      },
    }
  )

  let leaveUsers: any[] = []

  leavesQuery?.data?.forEach(({user, leaveDates, leaveType, halfDay}: any) => {
    const nameSplitted = user[0].split(' ')
    let extraInfo = leaveType?.[0]?.split(' ')?.[0]
    let lastName
    if (nameSplitted.length === 1) {
      lastName = ''
    } else {
      lastName = `${nameSplitted.pop().substring(0, 1)}.`
    }

    if (halfDay === FIRST_HALF) {
      extraInfo += ' 1st'
    }
    if (halfDay === SECOND_HALF) {
      extraInfo += ' 2nd'
    }
    if (leaveType.includes(LATE_ARRIVAL)) {
      extraInfo = 'Late'
    }

    const shortName = `${nameSplitted.join(' ')} ${lastName ? lastName : ''}`

    let leaveDatesCopy = leaveDates

    if (typeof leaveDates === 'string') {
      leaveDatesCopy = [leaveDatesCopy]
    }
    leaveDatesCopy?.forEach((date: string) => {
      leaveUsers.push({
        title: `${shortName}${extraInfo ? ' (' + extraInfo + ')' : ''}`,
        start: new Date(date),
        end: new Date(date),
      })
    })
  })

  const handleEventStyle = (event: any) => {
    let style: any = {
      color: darkMode ? 'rgb(77 241 241 / 73%)' : 'rgb(0 128 128 / 73%)',
      fontSize: '12.5px',
      padding: '1px 10px',
      width: event.fullWidth ? '100%' : '100%',
      margin: 'auto',
      marginLeft: '11px',
      marginBottom: '0.1rem',
      height: 'auto',
      backgroundColor: 'transparent',
    }

    return {
      style,
    }
  }

  return (
    <Card className="gx-card" title="Calendar">
      {leavesQuery?.isLoading ? (
        <div className="gx-d-flex gx-justify-content-around">
          <Spin />
        </div>
      ) : (
        <div className="gx-rbc-calendar">
          <Calendar
            eventPropGetter={handleEventStyle}
            localizer={localizer}
            events={leaveUsers}
            startAccessor="start"
            endAccessor="end"
            popup
            onNavigate={monthChangeHandler}
          />
        </div>
      )}
    </Card>
  )
}

export default LeavesCalendar
