import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {WalletOutlined} from '@ant-design/icons'
import {OVERVIEW_LEAVES} from 'constants/Overview'
import {changeDate} from 'helpers/utils'

const formattedUsers = (users: any[]) => {
  return users?.map((user) => ({
    ...user,
    key: user._id,
    name: user.user.name,
    absentFrom: changeDate(user.leaveDates[0]),
    till: changeDate(user.leaveDates.at(-1)),
    fullHalf: user.halfDay ? 'Half' : 'Full',
    period:
      user.leaveDates.length > 1
        ? user.leaveDates.length + ' Days'
        : user.halfDay
        ? 'Half Day'
        : '1 Day',
  }))
}

function LeaveEmployee({leaves}: {leaves: any[]}) {
  const [sort, setSort] = useState({})

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }
  return (
    <Card
      title={
        <h3>
          <WalletOutlined />
          <span className="gx-ml-3">Co-workers on leave</span>
        </h3>
      }
    >
      <Table
        className="gx-table-responsive"
        columns={OVERVIEW_LEAVES(sort)}
        dataSource={formattedUsers(leaves)}
        onChange={handleTableChange}
        pagination={false}
      />
    </Card>
  )
}

export default LeaveEmployee
