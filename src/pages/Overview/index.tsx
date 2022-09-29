import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {getLeavesOfAllUsers} from 'services/leaves'
import moment from 'moment'
import {formatToUtc, sortFromDate} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeaveEmployee from './LeaveEmployee'
import CheckedInEmployee from './CheckInEmployee'
import {intialDate} from 'constants/Attendance'
import {searchAttendacentOfUser} from 'services/attendances'
import CircularProgress from 'components/Elements/CircularProgress'
import {getAllUsers} from 'services/users/userDetails'
import UnCheckedInEmployee from './UnCheckedEmployee'

const Overview = () => {
  const {data, isLoading} = useQuery(
    ['users'],
    () => getAllUsers({active: 'true', fields: 'name,-role,-position,_id'}),
    {
      keepPreviousData: true,
    }
  )

  const {data: leaves, isLoading: leaveLoading} = useQuery(
    ['leavesOverview'],
    () =>
      getLeavesOfAllUsers(
        'approved',
        '',
        moment.utc(formatToUtc(moment().startOf('day'))).format()
      ),
    {
      onError: (error) => {
        notification({message: 'Could not approve leave', type: 'error'})
      },
    }
  )

  const {data: CheckedIn, isLoading: checkInLoading} = useQuery(
    ['checkInOverview'],
    () =>
      searchAttendacentOfUser({
        fromDate: moment.utc(intialDate[0]).format(),
        toDate: moment.utc(intialDate[1]).format(),
      })
  )

  const leavesSection = leaves?.data?.data?.data || []
  const checkInSecition =
    CheckedIn?.data?.data?.attendances?.[0]?.data?.map((d: any) => ({
      ...d,
      data: sortFromDate(d?.data, 'punchInTime'),
    })) || []

  const checkInUsers = checkInSecition?.map((x: any) => x._id.user)

  const notCheckInSection = data?.data?.data?.data?.filter(
    (user: any) => !checkInUsers.includes(user.name)
  )

  if (leaveLoading || checkInLoading) {
    return <CircularProgress className="" />
  }

  return (
    <div>
      <LeaveEmployee leaves={leavesSection} />
      <CheckedInEmployee checkIn={checkInSecition} />
      <UnCheckedInEmployee notCheckInSection={notCheckInSection} />
    </div>
  )
}

export default Overview
