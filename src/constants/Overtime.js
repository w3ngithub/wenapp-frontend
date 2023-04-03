import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {getIsAdmin, roundedToFixed} from 'helpers/utils'
import moment from 'moment'

export const OVERTIME_COLUMNS = ({
  sort,
  handleApprove,
  handleOpenViewModal,
  handleOpenRejectModal,
}) => [
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    // width: 400,
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
    render: (text, record) => {
      return <p style={{whiteSpace: 'pre-wrap'}}>{text}</p>
    },
  },
  {
    title: 'Added By',
    dataIndex: 'user',
    // width: 150,
    key: 'user',
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    // width: 150,
    key: 'status',
    sorter: true,
    // sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
  },
  {
    title: 'Action',
    key: 'action',
    // width: 360,
    render: (text, record) => {
      return (
        !getIsAdmin() && (
          <div style={{display: 'flex'}}>
            {/* {record?.oTStatus === 'approve' ? ( */}
            {record?.otStatus === 'R' ? (
              <span
                className="gx-link gx-text-primary"
                onClick={() => handleOpenViewModal(record, true)}
              >
                <CustomIcon name="view" />
              </span>
            ) : record?.otStatus === 'P' ? (
              <AccessWrapper role={!getIsAdmin()}>
                <>
                  {/* <Divider type="vertical" /> */}
                  <Popconfirm
                    title="Are you sure to approve this overtime?"
                    onConfirm={() => handleApprove(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span
                      // onClick={() => handleApprove(record)}
                      className="gx-link gx-text-green"
                    >
                      Approve
                    </span>
                  </Popconfirm>

                  {/* <span
                    onClick={() => handleApprove(record)}
                    className="gx-link gx-text-green"
                  >
                    Approve
                  </span> */}
                  <Divider type="vertical" />
                  <span
                    onClick={() => handleOpenRejectModal(record)}
                    className="gx-link gx-text-red"
                  >
                    Reject
                  </span>
                </>
              </AccessWrapper>
            ) : null}
          </div>
        )
      )
    },
  },
]

export const OT_STATUS = [
  {id: 'A', value: 'Approved'},
  {id: 'P', value: 'Pending'},
  {id: 'R', value: 'Rejected'},
  {id: '', value: 'All'},
]
