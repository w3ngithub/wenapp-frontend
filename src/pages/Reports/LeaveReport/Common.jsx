import React, {useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {notification} from 'helpers/notification'
import {LEAVE_REPORT_COLUMNS} from 'constants/LeaveReport'
import {getLeaveDaysOfAllUsers} from 'services/leaves'

const formattedLeaveReports = reports => {
  return reports?.map(report => ({
    key: report?._id,
    name: report?._id,
    leavesRemaining: report?.leavesRemaining,
    leavesTaken: report?.leavesTaken,
  }))
}

function CommonQuarter({fromDate, toDate}) {
  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})

  const {data, isLoading, isError, isFetching} = useQuery(
    ['leaveReport' + fromDate],
    () => getLeaveDaysOfAllUsers(fromDate, toDate),
    {keepPreviousData: true}
  )

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Leave Report!', type: 'error'})
    }
  }, [isError, data])

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = pageNumber => {
    setPage(prev => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage(prev => ({...page, limit: pageSize}))
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
        dataSource={formattedLeaveReports(data?.data?.data?.data)}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: data?.data?.data?.count || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
        loading={isLoading || isFetching}
      />
    </>
  )
}

export default CommonQuarter
