import {Card} from 'antd'
import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {Spin} from 'antd'
import {getFiscalYearLeaves} from 'services/leaves'

const localizer = momentLocalizer(moment)

const LeavesCalendar = () => {
  const leavesQuery = useQuery(
    ['leavesCalendar'],
    () => getFiscalYearLeaves(),
    {
      onError: err => console.log(err),
      select: res => {
        let allLeaves: any[] = []
        res?.data?.data?.data.forEach((leave: any) => {
          if (
            leave?._id?.leaveType[0] !== 'Paternity' &&
            leave?._id?.leaveType[0] !== 'Maternity'
          )
            leave.leaveDates.forEach((date: string) => {
              allLeaves.push({...leave?._id, leaveDates: date})
            })
          else
            allLeaves.push({...leave?._id, leaveDates: [...leave?.leaveDates]})
        })
        return allLeaves
      },
    }
  )
  const leaveUsers = leavesQuery?.data?.map(
    ({user, leaveDates, leaveType,halfDay}: any) => {
      const nameSplitted = user[0].split(' ')
      let specificHalf = ''
      let lastName
      if (nameSplitted.length === 1) {
        lastName = ''
      } else {
        lastName = `${nameSplitted.pop().substring(0, 1)}.`
      }

      if (halfDay === 'first-half') {
        specificHalf = '1st'
      }
      if (halfDay === 'second-half') {
        specificHalf = '2nd'
      }

      const shortName = `${nameSplitted.join(' ')} ${lastName ? lastName : ''}`

      if (leaveType[0] === 'Paternity' || leaveType[0] === 'Maternity')
        return {
          title: shortName,
          start: new Date(leaveDates[0]),
          end: new Date(leaveDates[1]),
          fullWidth: true,
        }
      else
        return {
          title: `${shortName}${specificHalf ? '(' + specificHalf + ')' : ''}`,
          start: new Date(leaveDates),
          end: new Date(leaveDates),
        }
    }
  )

  const handleEventStyle = (event: any) => {
    let style: any = {
      color: 'white',
      padding: '1px 10px',
      width: event.fullWidth ? '100%' : 'fit-content',
      margin: 'auto',
      marginBottom: '0.2rem',
      height: 'auto',
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
          />
        </div>
      )}
    </Card>
  )
}

export default LeavesCalendar
