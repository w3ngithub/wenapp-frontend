import React from 'react'
import {Divider, Popconfirm} from 'antd'
import {roundedToFixed} from 'helpers/utils'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import RoleAccess, {
  LOG_TIME_ADD_NO_ACCESS,
  LOG_TIME_DELETE_NO_ACCESS,
} from './RoleAccess'

const LOGTIMES_COLUMNS = (
  sortedInfo,
  onOpenEditModal,
  confirmDelete,
  hideAdminFeature,
  user,
  role
) =>
  hideAdminFeature
    ? [
        {
          title: 'Project',
          dataIndex: 'project',
          key: 'project',
          // width: 120,
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'project' && sortedInfo.order,
        },
        {
          title: 'Date',
          dataIndex: 'logDate',
          key: 'logDate',
          // width: 120,
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'logDate' && sortedInfo.order,
        },
        {
          title: 'Hours',
          dataIndex: 'totalHours',
          key: 'totalHours',
          // width: 70,
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'totalHours' && sortedInfo.order,
          render: (value) => roundedToFixed(value || 0, 2),
        },

        {
          title: 'Type',
          dataIndex: 'logType',
          // width: 100,
          key: 'logType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'logType' && sortedInfo.order,
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          // width: 400,
          key: 'remarks',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'remarks' && sortedInfo.order,
        },
        {
          title: 'Added By',
          dataIndex: 'user',
          // width: 150,
          key: 'user',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        },

        {
          title: 'Action',
          key: 'action',
          // width: 360,
          render: (text, record) => {
            return (
              <span>
                {!(role === RoleAccess.TeamLead) && (
                  <span
                    className="gx-link"
                    onClick={() => onOpenEditModal(record)}
                  >
                    <CustomIcon name="edit" />
                  </span>
                )}
                <AccessWrapper noAccessRoles={LOG_TIME_DELETE_NO_ACCESS}>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="Are you sure to delete this Log?"
                    onConfirm={() => confirmDelete(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className="gx-link gx-text-danger">
                      <CustomIcon name="delete" />
                    </span>
                  </Popconfirm>
                </AccessWrapper>
              </span>
            )
          },
        },
      ]
    : [
        {
          title: 'Date',
          dataIndex: 'logDate',
          key: 'logDate',
          // width: 120,
          sorter: (a, b) => {
            return a.logDate.toString().localeCompare(b.logDate.toString())
          },
          sortOrder: sortedInfo.columnKey === 'logDate' && sortedInfo.order,
        },
        {
          title: 'Hours',
          dataIndex: 'totalHours',
          key: 'totalHours',
          // width: 70,
          sorter: (a, b) =>
            a.totalHours?.toString().localeCompare(b.totalHours?.toString()),
          sortOrder: sortedInfo.columnKey === 'totalHours' && sortedInfo.order,
          render: (value) => roundedToFixed(value || 0, 2),
        },

        {
          title: 'Type',
          dataIndex: 'logType',
          // width: 100,
          key: 'logType',
          sorter: (a, b) =>
            a.logType?.toString().localeCompare(b.logType?.toString()),
          sortOrder: sortedInfo.columnKey === 'logType' && sortedInfo.order,
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          // width: 400,
          key: 'remarks',
          sorter: (a, b) =>
            a.remarks?.toString().localeCompare(b.remarks?.toString()),
          sortOrder: sortedInfo.columnKey === 'remarks' && sortedInfo.order,
        },
        {
          title: 'Added By',
          dataIndex: 'user',
          // width: 150,
          key: 'user',
          sorter: (a, b) =>
            a.user?.toString().localeCompare(b.user?.toString()),
          sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        },

        {
          title: 'Action',
          key: 'action',
          // width: 360,
          render: (text, record) => {
            return (
              <span style={{display: 'flex'}}>
                <AccessWrapper noAccessRoles={LOG_TIME_ADD_NO_ACCESS}>
                  {record.user === user ||
                  [RoleAccess.Admin, RoleAccess.ProjectManager].includes(
                    role
                  ) ? (
                    <span
                      className="gx-link"
                      onClick={() => onOpenEditModal(record)}
                    >
                      <CustomIcon name="edit" />
                    </span>
                  ) : (
                    ''
                  )}
                </AccessWrapper>
                <AccessWrapper noAccessRoles={LOG_TIME_DELETE_NO_ACCESS}>
                  {(role === RoleAccess.Admin ||
                    role === RoleAccess.ProjectManager) && (
                    <Divider type="vertical" />
                  )}
                  <Popconfirm
                    title="Are you sure to delete this Log?"
                    onConfirm={() => confirmDelete(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className="gx-link gx-text-danger">
                      <CustomIcon name="delete" />
                    </span>
                  </Popconfirm>
                </AccessWrapper>
              </span>
            )
          },
        },
      ]

export {LOGTIMES_COLUMNS}
