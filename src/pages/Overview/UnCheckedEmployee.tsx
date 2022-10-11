import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {WalletOutlined} from '@ant-design/icons'
import {OVERVIEW_NOTCHECKEDIN} from 'constants/Overview'

const formattedUsers = (users: any[]) => {
  return users?.map(user => ({
    key: user._id,
    name: user.name,
    checkIn: 'N/A',
    checkOut: 'N/A',
  }))
}

function UnCheckedInEmployee({notCheckInSection}: {notCheckInSection: any[]}) {
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})

  const onShowSizeChange = (_: any, pageSize: number) => {
    setPage(prev => ({...page, limit: pageSize}))
  }

  const handlePageChange = (pageNumber: number) => {
    setPage(prev => ({...prev, page: pageNumber}))
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }
  return (
    <Card
      title={
        <h3>
          <WalletOutlined />
          <span className="gx-ml-3">Co-workers who have not punched in</span>
        </h3>
      }
    >
      <Table
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
