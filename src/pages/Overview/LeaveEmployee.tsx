import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {OVERVIEW_LEAVES} from 'constants/Overview'
import {changeDate} from 'helpers/utils'
import {LATE_ARRIVAL, LEAVES_TYPES} from 'constants/Leaves'
import {emptyText} from 'constants/EmptySearchAntd'

const formattedLeaves = (leaves: any[]) => {
  return leaves?.map((leave) => {
    const sortedLeaveDates = leave?.leaveDates?.sort(
      (d1: string, d2: string) =>
        new Date(d1)?.getTime() - new Date(d2)?.getTime()
    )
    return {
      ...leave,
      key: leave?._id,
      name: leave?.user[0]?.name,
      absentFrom: changeDate(sortedLeaveDates?.[0]),
      till: changeDate(sortedLeaveDates.at(-1)),
      fullHalf: leave.halfDay ? 'Half' : 'Full',
      period:
        leave?.leaveType[0]?.name.split(' ')[0].toLowerCase() !==
          LEAVES_TYPES.Casual &&
        leave?.leaveType[0]?.name.split(' ')[0].toLowerCase() !==
          LEAVES_TYPES.Sick &&
        leave?.leaveType[0]?.name !== LATE_ARRIVAL
          ? `${(
              (new Date(sortedLeaveDates?.[1]).getTime() -
                new Date(sortedLeaveDates?.[0]).getTime()) /
                (1000 * 3600 * 24) +
              1
            ).toFixed()} days`
          : sortedLeaveDates.length > 1
          ? sortedLeaveDates.length + ' Days'
          : leave.halfDay
          ? leave.halfDay === 'first-half'
            ? 'First Half'
            : 'Second Half'
          : '1 Day',
    }
  })
}

function LeaveEmployee({leaves}: {leaves: any[]}) {
  const [sort, setSort] = useState({
    column: undefined,
    order: 'ascend',
    field: 'name',
    columnKey: 'name',
  })

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }
  return (
    <Card title={''}>
      <Table
        locale={{emptyText}}
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
