import {Card} from 'antd'
import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {Spin} from 'antd'
import {getFiscalYearLeaves} from 'services/leaves'
import {LEAVES_TYPES} from 'constants/Leaves'

const localizer = momentLocalizer(moment)

const LeavesCalendar = () => {
  const leavesQuery = useQuery(
    ['leavesCalendar'],
    () => getFiscalYearLeaves(),
    {
      onError: (err) => console.log(err),
      select: (res) => {
        let allLeaves: any[] = []
        res?.data?.data?.data.forEach((leave: any) => {
          const {_id: leaveData} = leave
          const isLeavePaternity =
            leaveData?.leaveType[0].toLowerCase() === LEAVES_TYPES.Paternity
          const isLeaveMaternity =
            leaveData?.leaveType[0].toLowerCase() === LEAVES_TYPES.Maternity
          const isLeavePTO =
            leaveData?.leaveType[0].toLowerCase() === LEAVES_TYPES.PTO
          const isLeaveBereavement =
            leaveData?.leaveType[0].toLowerCase() === LEAVES_TYPES.Bereavement

          if (
            isLeavePaternity ||
            isLeaveMaternity ||
            isLeavePTO ||
            isLeaveBereavement
          )
            allLeaves.push({...leave?._id, leaveDates: [...leave?.leaveDates]})
          else
            leave.leaveDates.forEach((date: string) => {
              allLeaves.push({...leave?._id, leaveDates: date})
            })
        })
        return allLeaves
      },
    }
  )

  const leaveUsers = leavesQuery?.data?.map(
    ({user, leaveDates, leaveType, halfDay}: any) => {
      const nameSplitted = user[0].split(' ')
      let extraInfo = ''
      let lastName
      if (nameSplitted.length === 1) {
        lastName = ''
      } else {
        lastName = `${nameSplitted.pop().substring(0, 1)}.`
      }

      if (halfDay === 'first-half') {
        extraInfo = '1st'
      }
      if (halfDay === 'second-half') {
        extraInfo = '2nd'
      }
      if (leaveType.includes('Late Arrival')) {
        extraInfo = 'Late'
      }

      const shortName = `${nameSplitted.join(' ')} ${lastName ? lastName : ''}`

      if (
        [
          LEAVES_TYPES.Paternity,
          LEAVES_TYPES.Maternity,
          LEAVES_TYPES.PTO,
          LEAVES_TYPES.Bereavement,
        ].includes(leaveType[0]?.toLowerCase())
      )
        return {
          title: shortName,
          start: new Date(leaveDates[0]),
          end: new Date(leaveDates[1]),
          fullWidth: true,
        }
      else
        return {
          title: `${shortName}${extraInfo ? '(' + extraInfo + ')' : ''}`,
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
