import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {getIsAdmin, roundedToFixed} from 'helpers/utils'
import moment from 'moment'

export const OVERTIME_COLUMNS = (
  sortedInfo,
  onOpenEditModal,
  confirmDelete,
  hideAdminFeature,
  user,
  role,
  navigateToProjectLogs
) => [
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    // width: 120,
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'project' && sortedInfo.order,
    //   render: (text, record) => {
    //     return (
    //       <p
    //         onClick={() => {
    //           if (!record?.projectId) return
    //           navigateToProjectLogs(
    //             `../projects/${record?.projectId}-${record?.slug}`
    //           )
    //         }}
    //         className={record?.projectId && 'project-name'}
    //       >
    //         {text}
    //       </p>
    //     )
    //   },
  },
  {
    title: 'Date',
    dataIndex: 'logDate',
    key: 'logDate',
    // width: 120,
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'logDate' && sortedInfo.order,
  },
  {
    title: 'Hours',
    dataIndex: 'totalHours',
    key: 'totalHours',
    // width: 70,
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'totalHours' && sortedInfo.order,
    // render: (value) => roundedToFixed(value || 0, 2),
  },

  {
    title: 'Type',
    dataIndex: 'logType',
    // width: 100,
    key: 'logType',
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'logType' && sortedInfo.order,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    // width: 400,
    key: 'remarks',
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'remarks' && sortedInfo.order,
    // render: (text, record) => {
    //   return <p style={{whiteSpace: 'pre-wrap'}}>{text}</p>
    // },
  },
  {
    title: 'Action',
    key: 'action',
    // width: 360,
    render: (text, record) => {
      // let logDateTime = record?.logDate?.split('/')
      // let sendDate = `${logDateTime[1]}/${logDateTime[0]}/${logDateTime[2]}`
      return (
        !getIsAdmin() && (
          <div style={{display: 'flex'}}>
            {/* <AccessWrapper role={viewLeave}> */}
            <>
              <span
                className="gx-link gx-text-primary"
                // onClick={() => onEditClick(record, true)}
              >
                <CustomIcon name="view" />
              </span>
            </>
            {/* </AccessWrapper> */}

            <>
              {/* <AccessWrapper
                role={
                  !getIsAdmin() &&
                  ![STATUS_TYPES[1].id, STATUS_TYPES[3].id].includes(
                    record.leaveStatus
                  ) &&
                  approveLeave
                }
              > */}
              <>
                {/* {viewLeave && <Divider type="vertical" />} */}

                <span
                  // onClick={() => onApproveClick(record)}
                  className="gx-link gx-text-green"
                >
                  Approve
                </span>
              </>
              {/* </AccessWrapper> */}
            </>
          </div>
        )
      )
    },
  },
]
