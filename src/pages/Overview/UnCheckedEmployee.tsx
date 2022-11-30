import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {OVERVIEW_NOTCHECKEDIN} from 'constants/Overview'
import {emptyText} from 'constants/EmptySearchAntd'

const formattedUsers = (users: {}[]) => {
  return users?.map((user: any) => ({
    key: user._id,
    name: user.name,
    checkIn: 'N/A',
    checkOut: 'N/A',
  }))
}

function UnCheckedInEmployee({notCheckInSection}: {notCheckInSection: {}[]}) {
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})

  const onShowSizeChange = (_: number, pageSize: number) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const handleTableChange = (pagination: {}, filters: {}, sorter: {}) => {
    setSort(sorter)
  }
  return (
    <Card title={''}>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={OVERVIEW_NOTCHECKEDIN(sort)}
        dataSource={formattedUsers(notCheckInSection)}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: notCheckInSection?.length || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
      />
    </Card>
  )
}

export default UnCheckedInEmployee
