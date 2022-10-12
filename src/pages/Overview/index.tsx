import React, {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getTodayLeaves} from 'services/leaves'
import moment from 'moment'
import {sortFromDate} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeaveEmployee from './LeaveEmployee'
import CheckedInEmployee from './CheckInEmployee'
import {intialDate} from 'constants/Attendance'
import {searchAttendacentOfUser} from 'services/attendances'
import CircularProgress from 'components/Elements/CircularProgress'
import {getAllUsers} from 'services/users/userDetails'
import UnCheckedInEmployee from './UnCheckedEmployee'

const Overview = () => {
  const {data} = useQuery(
    ['users'],
    () => getAllUsers({active: 'true', fields: 'name,-role,-position,_id'}),
    {
      keepPreviousData: true,
    }
  )
  const [page, setPage] = useState({page: 1, limit: 10})

  const onShowSizeChange = (_: any, pageSize: number) => {
    setPage(prev => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage(prev => ({...prev, page: pageNumber}))
  }

  const {data: leaves, isLoading: leaveLoading} = useQuery(
    ['leavesOverview'],
    () => getTodayLeaves(),
    {
      onError: error => {
        notification({message: 'Could not approve leave', type: 'error'})
      },
    }
  )

  const {data: CheckedIn, isLoading: checkInLoading} = useQuery(
    ['checkInOverview', page],
    () =>
      searchAttendacentOfUser({
        ...page,
        fromDate: moment.utc(intialDate[0]).format(),
        toDate: moment.utc(intialDate[1]).format(),
      })
  )
  const leavesSection = leaves?.data?.data?.users || []
  const checkInSecition =
    CheckedIn?.data?.data?.attendances?.[0]?.data?.map((d: any) => ({
      ...d,
      data: sortFromDate(d?.data, 'punchInTime'),
    })) || []

  const checkInUsers = checkInSecition?.map((x: any) => x._id.user)

  const notCheckInSection = data?.data?.data?.data?.filter(
    (user: any) => !checkInUsers.includes(user.name)
  )

  if (leaveLoading) {
    return <CircularProgress className="" />
  }
  return (
    <div>
      <LeaveEmployee leaves={leavesSection} />
      <CheckedInEmployee
        checkIn={checkInSecition}
        page={page}
        onPageChange={handlePageChange}
        onShowSizeChange={onShowSizeChange}
        count={CheckedIn?.data?.data?.attendances?.[0]?.metadata?.[0]?.total}
        isLoading={checkInLoading}
      />
      <UnCheckedInEmployee notCheckInSection={notCheckInSection} />
    </div>
  )
}

export default Overview
