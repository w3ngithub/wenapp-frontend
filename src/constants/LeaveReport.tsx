import {Input} from 'antd'

interface LeaveReport {
  title: string
  dataIndex: string
  editable: boolean
  key: any
  sorter: (a: any, b: any) => any
  sortOrder: string
  render?: any
  children?: any
}

const LEAVE_REPORT_COLUMNS = (sortedInfo: any): LeaveReport[] => [
  {
    title: 'Co-workers',
    dataIndex: 'name',
    key: 'name',
    editable: false,
    sorter: (a, b) => {
      return a.name.toString().localeCompare(b.name.toString())
    },
    sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
  },
  {
    title: 'Allocated Leaves',
    dataIndex: 'allocatedLeaves',
    key: 'allocatedLeaves',
    editable: true,
    sorter: (a: any, b: any) => a.allocatedLeaves - b.allocatedLeaves,
    sortOrder: sortedInfo.columnKey === 'allocatedLeaves' && sortedInfo.order,
    render: (text: any, record: any) => {
      let curVal = text
      const changeAllocatedLeave = (e: any) => {
        curVal = e.target.value
      }
      return <Input value={curVal} onChange={changeAllocatedLeave} />
    },
  },
  {
    title: 'Leave Deduction Balance',
    dataIndex: 'leaveDeductionBalance',
    key: 'leaveDeductionBalance',
    editable: true,
    sorter: (a: any, b: any) =>
      a.leaveDeductionBalance - b.leaveDeductionBalance,
    sortOrder:
      sortedInfo.columnKey === 'leaveDeductionBalance' && sortedInfo.order,
    render: (text: any, record: any) => {
      let curVal = text
      const changeBalance = (e: any) => {
        curVal = e.target.value
      }
      return <Input value={curVal} onChange={changeBalance} />
    },
  },
  {
    title: 'Remaining Leaves',
    dataIndex: 'remainingLeaves',
    key: 'remainingLeaves',
    editable: false,
    sorter: (a: any, b: any) => a.remainingLeaves - b.remainingLeaves,
    sortOrder: sortedInfo.columnKey === 'remainingLeaves' && sortedInfo.order,
  },
  {
    title: 'Approved Leaves',
    editable: false,
    dataIndex: 'approvedLeaves',
    key: 'approvedLeaves',
    sorter: () => {},
    sortOrder: sortedInfo.columnKey === 'approvedLeaves' && sortedInfo.order,
    children: [
      {
        title: 'Sick Leaves',
        dataIndex: 'sickLeaves',
        key: 'sickLeaves',
        editable: false,
        sorter: (a: any, b: any) => a.sickLeaves - b.sickLeaves,
        sortOrder: sortedInfo.columnKey === 'sickLeaves' && sortedInfo.order,
      },
      {
        title: 'Casual Leaves',
        dataIndex: 'casualLeaves',
        key: 'casualLeaves',
        editable: false,
        sorter: (a: any, b: any) => a.casualLeaves - b.casualLeaves,
        sortOrder: sortedInfo.columnKey === 'casualLeaves' && sortedInfo.order,
      },
    ],
  },

  {
    title: 'Carried Over Leaves',
    dataIndex: 'carriedLeaves',
    key: 'carriedLeaves',
    editable: false,
    sorter: (a, b) => a.carriedLeaves - b.carriedLeaves,
    sortOrder: sortedInfo.columnKey === 'carriedLeaves' && sortedInfo.order,
    render: (_: any, record: any) => {
      const carriedLeaves = record.leavesRemaining + record.leavesTaken
      return carriedLeaves - record.allocatedLeaves > 0
        ? carriedLeaves - record.allocatedLeaves
        : 0
    },
  },
]

export {LEAVE_REPORT_COLUMNS}

export const INTERN = 'Intern'
