import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {WalletOutlined} from '@ant-design/icons'
import {OVERVIEW_LEAVES} from 'constants/Overview'
import {changeDate} from 'helpers/utils'
import {LEAVES_TYPES} from 'constants/Leaves'

const formattedLeaves = (leaves: any[]) => {
  // console.log(leaves)
  return leaves?.map((leave) => ({
    ...leave,
    key: leave?._id,
    name: leave?.user[0]?.name,
    absentFrom: changeDate(leave?.leaveDates[0]),
    till: changeDate(leave.leaveDates.at(-1)),
    fullHalf: leave.halfDay ? 'Half' : 'Full',
    period:
      leave?.leaveType[0]?.name.split(' ')[0].toLowerCase() !==
        LEAVES_TYPES.Casual &&
      leave?.leaveType[0]?.name.split(' ')[0].toLowerCase() !==
        LEAVES_TYPES.Sick
        ? `${(
            (new Date(leave?.leaveDates[1]).getTime() -
              new Date(leave?.leaveDates[0]).getTime()) /
              (1000 * 3600 * 24) +
            1
          ).toFixed()} days`
        : leave.leaveDates.length > 1
        ? leave.leaveDates.length + ' Days'
        : leave.halfDay
        ? leave.halfDay === 'first-half'
          ? 'First Half'
          : 'Second Half'
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
        dataSource={formattedLeaves(leaves)}
        onChange={handleTableChange}
        pagination={false}
      />
    </Card>
  )
}

export default LeaveEmployee
