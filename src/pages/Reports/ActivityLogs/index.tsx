import React, {useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Card, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {notification} from 'helpers/notification'
import {emptyText} from 'constants/EmptySearchAntd'
import {getActivityLogs} from 'services/activitLogs'
import {ACTIVITY_LOGS} from 'constants/activityLogs'
import {capitalizeInput, isoDateWithoutTimeZone} from 'helpers/utils'

const formattedWeeklyReports = (logs: any) => {
  return logs?.map((log: any) => ({
    ...log,
    createdAt: isoDateWithoutTimeZone(log.createdAt),
    status: capitalizeInput(log.status),
  }))
}

function ActivityLogs() {
  // init states
  const [sort, setSort] = useState<any>({})
  const [page, setPage] = useState({page: 1, limit: 50})

  const {data, isLoading, isError, isFetching} = useQuery(
    ['activityLogs', page, sort],
    () =>
      getActivityLogs({
        ...page,
        sort:
          sort.order === undefined || sort.column === undefined
            ? ''
            : sort.order === 'ascend'
            ? sort.field
            : `-${sort.field}`,
      }),
    {keepPreviousData: true}
  )

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Activity Logs!', type: 'error'})
    }
  }, [isError, data])

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber: any) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_: any, pageSize: any) => {
    setPage((prev) => ({...prev, limit: pageSize}))
  }

  if (isLoading) {
    return <CircularProgress className="" />
  }
  return (
    <div>
      <Card title="Activity Logs">
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-justify-content-between gx-flex-row"></div>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={ACTIVITY_LOGS(sort)}
          dataSource={formattedWeeklyReports(data?.data?.data?.data)}
          onChange={handleTableChange}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['50', '80', '100'],
            showSizeChanger: true,
            total: data?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: true,
            onChange: handlePageChange,
          }}
          loading={isLoading || isFetching}
        />
      </Card>
    </div>
  )
}

export default ActivityLogs
