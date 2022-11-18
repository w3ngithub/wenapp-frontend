import React, {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getTodayLeaves} from 'services/leaves'
import moment from 'moment'
import {MuiFormatDate, sortFromDate} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeaveEmployee from './LeaveEmployee'
import CheckedInEmployee from './CheckInEmployee'
import {intialDate} from 'constants/Attendance'
import {searchAttendacentOfUser} from 'services/attendances'
import CircularProgress from 'components/Elements/CircularProgress'
import {getAllUsers} from 'services/users/userDetails'
import UnCheckedInEmployee from './UnCheckedEmployee'
import DeadlineProjects from './DeadlineProjects'
import {getAllProjects} from 'services/projects'
import {Collapse} from 'antd'
import {WalletOutlined} from '@ant-design/icons'
import {useLocation} from 'react-router-dom'

const {Panel} = Collapse

const endDate = `${MuiFormatDate(new Date())}`

const Overview = () => {
  const {data} = useQuery(
    ['users'],
    () =>
      getAllUsers({
        active: 'true',
        fields: 'name,-role,-position,_id',
        sort: 'name',
      }),
    {
      keepPreviousData: true,
    }
  )
  const [page, setPage] = useState({page: 1, limit: 10})
  const location = useLocation()

  const {data: projects} = useQuery(
    ['projects', endDate],
    () =>
      getAllProjects({
        endDate,
      }),
    {keepPreviousData: true}
  )

  const onShowSizeChange = (_: any, pageSize: number) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const {data: leaves, isLoading: leaveLoading} = useQuery(
    ['leavesOverview'],
    () => getTodayLeaves(),
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

  const deadlineProject = projects?.data?.data?.data || []

  if (leaveLoading) {
    return <CircularProgress className="" />
  }
  return (
    <div>
      <Collapse defaultActiveKey={location?.state ? ['2'] : ['1']}>
        <Panel
          header={
            <h3>
              <WalletOutlined />
              <span className="gx-ml-3">Co-workers on leave</span>
            </h3>
          }
          key="1"
        >
          <LeaveEmployee leaves={leavesSection} />
        </Panel>
        <Panel
          header={
            <h3>
              <WalletOutlined />
              <span className="gx-ml-3">Co-workers who already punched in</span>
            </h3>
          }
          key="2"
        >
          <CheckedInEmployee
            checkIn={checkInSecition}
            isLoading={checkInLoading}
          />
        </Panel>
        <Panel
          header={
            <h3>
              <WalletOutlined />
              <span className="gx-ml-3">
                Co-workers who have not punched in
              </span>
            </h3>
          }
          key="3"
        >
          <UnCheckedInEmployee notCheckInSection={notCheckInSection} />
        </Panel>
        {deadlineProject.length && (
          <Panel
            header={
              <h3>
                <WalletOutlined />
                <span className="gx-ml-3">Projects With Deadline Today</span>
              </h3>
            }
            key="4"
          >
            <DeadlineProjects projects={deadlineProject} />
          </Panel>
        )}
      </Collapse>
    </div>
  )
}

export default Overview
