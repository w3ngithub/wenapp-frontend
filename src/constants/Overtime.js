import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {getIsAdmin, roundedToFixed} from 'helpers/utils'
import moment from 'moment'

export const OVERTIME_COLUMNS = (
  sort,
  handleOpenApproveModal,
  handleViewOnly
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
    title: 'Action',
    key: 'action',
    // width: 360,
    render: (text, record) => {
      return (
        !getIsAdmin() && (
          <div style={{display: 'flex'}}>
            {record?.oTStatus === 'approved' ? (
              <span
                className="gx-link gx-text-primary"
                onClick={() => handleViewOnly(record, true)}
              >
                <CustomIcon name="view" />
              </span>
            ) : (
              <AccessWrapper role={!getIsAdmin()}>
                <>
                  {/* <Divider type="vertical" /> */}

                  <span
                    onClick={() => handleOpenApproveModal(record)}
                    className="gx-link gx-text-green"
                  >
                    Approve
                  </span>
                </>
              </AccessWrapper>
            )}
          </div>
        )
      )
    },
  },
]
