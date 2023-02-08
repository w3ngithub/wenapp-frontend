import {Input, Tooltip} from 'antd'
import CustomIcon from 'components/Elements/Icons'

interface LeaveReport {
  title: string
  dataIndex: string
  editable: boolean
  key: any
  sorter?: (a: any, b: any) => any
  sortOrder?: string
  render?: any
  children?: any
  width?: number
}

const LEAVE_REPORT_COLUMNS = (
  sortedInfo: any,
  handleOpenModal: any
): LeaveReport[] => [
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
  },
  {
    title: 'Remaining Leaves',
    dataIndex: 'remainingLeaves',
    key: 'remainingLeaves',
    editable: false,
    sorter: (a: any, b: any) => a.remainingLeaves - b.remainingLeaves,
    sortOrder: sortedInfo.columnKey === 'remainingLeaves' && sortedInfo.order,
    width: 300,
    render: (text: any, record: any) => {
      return (
        <>
          <p
            style={{
              paddingTop: !!record?.user?.leaveadjustmentBalance
                ? ''
                : '1.1rem',
            }}
          >
            {text}
          </p>
          {record?.user?.leaveadjustmentBalance > 0 && (
            <Tooltip
              title={`Leave Adjustment Balance is leave balance to deduct. Leave Adjustment Balance : ${record?.user?.leaveadjustmentBalance}`}
            >
              <span style={{opacity: 0.6, fontSize: '12px'}}>
                (Leave Adjustment Balance :{' '}
                {record?.user?.leaveadjustmentBalance})
              </span>
            </Tooltip>
          )}
        </>
      )
    },
  },
  {
    title: 'Approved Leaves',
    editable: false,
    dataIndex: 'approvedLeaves',
    key: 'approvedLeaves',
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
    dataIndex: 'carriedOverLeaves',
    key: 'carriedOverLeaves',
    editable: false,
    sorter: (a, b) => a.carriedOverLeaves - b.carriedOverLeaves,
    sortOrder: sortedInfo.columnKey === 'carriedOverLeaves' && sortedInfo.order,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    editable: false,
    key: 'action',
    render: (text: string, record: any) => {
      return (
        <span className="gx-link" onClick={() => handleOpenModal(record)}>
          <CustomIcon name="edit" />
        </span>
      )
    },
  },
]

export {LEAVE_REPORT_COLUMNS}

export const INTERN = 'Intern'
