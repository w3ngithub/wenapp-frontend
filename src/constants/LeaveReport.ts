interface LeaveReport {
  title: string
  dataIndex: string
  key: any
  sorter: (a: any, b: any) => any
  sortOrder: string
  render?: any
}

const LEAVE_REPORT_COLUMNS = (sortedInfo: any): LeaveReport[] => [
  {
    title: 'Co-workers',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => {
      return a.name.toString().localeCompare(b.name.toString())
    },
    sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
  },
  {
    title: 'Allocated Leaves',
    dataIndex: 'allocatedLeaves',
    key: 'allocatedLeaves',
    sorter: (a: any, b: any) => a.allocatedLeaves - b.allocatedLeaves,
    sortOrder: sortedInfo.columnKey === 'allocatedLeaves' && sortedInfo.order,
  },
  {
    title: 'Carried Over Leaves',
    dataIndex: 'carriedLeaves',
    key: 'carriedLeaves',
    sorter: (a, b) => a.carriedLeaves - b.carriedLeaves,
    sortOrder: sortedInfo.columnKey === 'carriedLeaves' && sortedInfo.order,
    render: (_: any, record: any) => {
      const carriedLeaves = record.leavesRemaining + record.leavesTaken
      return carriedLeaves - record.allocatedLeaves > 0
        ? carriedLeaves - record.allocatedLeaves
        : 0
    },
  },

  {
    title: 'Approved Leaves',
    dataIndex: 'leavesTaken',
    key: 'leavesTaken',
    sorter: (a, b) => a.leavesTaken - b.leavesTaken,
    sortOrder: sortedInfo.columnKey === 'leavesTaken' && sortedInfo.order,
  },

  {
    title: 'Days Remaining',
    dataIndex: 'leavesRemaining',
    key: 'leavesRemaining',
    sorter: (a, b) => a.leavesRemaining - b.leavesRemaining,

    sortOrder: sortedInfo.columnKey === 'leavesRemaining' && sortedInfo.order,
  },
]

export {LEAVE_REPORT_COLUMNS}

export const INTERN = 'Intern'
