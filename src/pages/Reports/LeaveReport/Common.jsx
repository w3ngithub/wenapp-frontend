import React, {useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {notification} from 'helpers/notification'
import {INTERN, LEAVE_REPORT_COLUMNS} from 'constants/LeaveReport'
import {getLeaveDaysOfAllUsers} from 'services/leaves'

const formattedLeaveReports = (reports, quarter, Intern) => {
  let currentQuarter = ''
  switch (quarter) {
    case 1:
      currentQuarter = 'firstQuarter'
      break
    case 2:
      currentQuarter = 'secondQuarter'
      break
    case 3:
      currentQuarter = 'thirdQuarter'
      break
    case 4:
      currentQuarter = 'fourthQuarter'
      break

    default:
      currentQuarter = ''
      break
  }
  return reports?.[quarter - 1]?.map((report) => ({
    key: report?._id._id?.[0],
    name: report?._id.name?.[0],
    leavesRemaining: accumulatedLeaveDaysRemaining(
      reports,
      quarter,
      report?._id._id[0],
      report?._id.allocatedLeaves[0],
      report?.leavesTaken,
      Intern,
      report?._id.position[0]
    ),

    leavesTaken: report?.leavesTaken,
    allocatedLeaves: report?._id?.allocatedLeaves?.[0]?.[currentQuarter],
  }))
}

const accumulatedLeaveDaysRemaining = (
  reports,
  quarter,
  user,
  allocatedLeaves,
  leavesTaken,
  Intern,
  position
) => {
  let firstQuarterLeavesTaken,
    secondQuarterLeavesTaken,
    thirdQuarterLeavesTaken,
    firstQuartLeave,
    secondQuarteLeave,
    thirdQuarterLeave = null

  switch (quarter) {
    case 1:
      return allocatedLeaves?.firstQuarter - leavesTaken || 0

    case 2:
      // does not accumulate other quarter remaining leaves if  position is Intern
      if (Intern._id === position)
        return allocatedLeaves?.secondQuarter - leavesTaken || 0

      firstQuartLeave = reports[0].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken
      firstQuarterLeavesTaken =
        allocatedLeaves?.firstQuarter - firstQuartLeave > 0
          ? allocatedLeaves?.firstQuarter - firstQuartLeave
          : 0
      return (
        (allocatedLeaves?.secondQuarter - leavesTaken || 0) +
        (firstQuarterLeavesTaken || 0)
      )

    case 3:
      // does not accumulate other quarter remaining leaves if  position is Intern
      if (Intern._id === position)
        return allocatedLeaves?.thirdQuarter - leavesTaken || 0

      firstQuartLeave = reports[0].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken
      secondQuarteLeave = reports[1].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken

      firstQuarterLeavesTaken =
        allocatedLeaves?.firstQuarter - firstQuartLeave > 0
          ? allocatedLeaves?.firstQuarter - firstQuartLeave
          : 0

      secondQuarterLeavesTaken =
        allocatedLeaves?.secondQuarter - secondQuarteLeave > 0
          ? allocatedLeaves?.secondQuarter - secondQuarteLeave
          : 0

      return (
        (allocatedLeaves?.thirdQuarter - leavesTaken || 0) +
        (firstQuarterLeavesTaken || 0) +
        (secondQuarterLeavesTaken || 0)
      )

    case 4:
      // does not accumulate other quarter remaining leaves if  position is Intern
      if (Intern._id === position)
        return allocatedLeaves?.fourthQuarter - leavesTaken || 0

      firstQuartLeave = reports[0].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken
      secondQuarteLeave = reports[1].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken
      thirdQuarterLeave = reports[2].find(
        (x) => x?._id._id[0] === user
      )?.leavesTaken

      firstQuarterLeavesTaken =
        allocatedLeaves?.firstQuarter - firstQuartLeave > 0
          ? allocatedLeaves?.firstQuarter - firstQuartLeave
          : 0
      secondQuarterLeavesTaken =
        allocatedLeaves?.secondQuarter - secondQuarteLeave > 0
          ? allocatedLeaves?.secondQuarter - secondQuarteLeave
          : 0
      thirdQuarterLeavesTaken =
        allocatedLeaves?.thirdQuarter - thirdQuarterLeave > 0
          ? allocatedLeaves?.thirdQuarter - thirdQuarterLeave
          : 0

      return (
        (allocatedLeaves?.fourthQuarter - leavesTaken || 0) +
        (firstQuarterLeavesTaken || 0) +
        (secondQuarterLeavesTaken || 0) +
        (thirdQuarterLeavesTaken || 0)
      )

    default:
      return 0
  }
}

function CommonQuarter({fromDate, toDate, quarter, positions}) {
  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})

  const {data, isLoading, isError, isFetching} = useQuery(
    ['leaveReport' + quarter],
    () => getLeaveDaysOfAllUsers(fromDate, toDate, quarter),
    {keepPreviousData: true}
  )

  const Intern = positions?.find((pos) => pos?.name === INTERN)

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Leave Report!', type: 'error'})
    }
  }, [isError, data])

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  if (isLoading) {
    return <CircularProgress className="" />
  }

  return (
    <>
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row"></div>
      </div>
      <Table
        className="gx-table-responsive"
        columns={LEAVE_REPORT_COLUMNS(sort)}
        dataSource={formattedLeaveReports(
          data?.data?.data?.data,
          quarter,
          Intern
        )}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: data?.data?.data?.data?.[quarter - 1]?.length || 1,
          onShowSizeChange,
          hideOnSinglePage: data?.data?.data?.data?.[quarter - 1]?.length
            ? false
            : true,
          onChange: handlePageChange,
        }}
        loading={isLoading || isFetching}
      />
    </>
  )
}

export default CommonQuarter
