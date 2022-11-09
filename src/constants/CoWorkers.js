import React from 'react'
import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import {CO_WORKERS_TABLE_ACTION_NO_ACCESS} from './RoleAccess'
import moment from 'moment'

const CO_WORKERCOLUMNS = (
  sortedInfo,
  openEditPopup,
  updatMutation,
  disableMutation,
  role
) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    sorter: (a, b) => {
      return a.name.toString().localeCompare(b.name.toString())
    },
    sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250,
    sorter: (a, b) => a.email.toString().localeCompare(b.email.toString()),
    sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
  },
  {
    title: 'Primary Phone',
    dataIndex: 'primaryPhone',
    width: 150,
    key: 'primaryPhone',
  },
  {
    title: 'DOB',
    dataIndex: 'dob',
    width: 150,
    key: 'dob',
    sorter: (a, b) => moment(a.dob, 'DD-MM-YYYY') - moment(b.dob, 'DD-MM-YYYY'),
    sortOrder: sortedInfo.columnKey === 'dob' && sortedInfo.order,
  },
  {
    title: 'Join Date',
    dataIndex: 'joinDate',
    width: 150,
    key: 'joinDate',
    sorter: (a, b) =>
      moment(a.joinDate, 'DD-MM-YYYY') - moment(b.joinDate, 'DD-MM-YYYY'),
    sortOrder: sortedInfo.columnKey === 'joinDate' && sortedInfo.order,
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    render: (text, record) => {
      return (
        <div style={{display: 'flex'}}>
          <span className="gx-link" onClick={() => openEditPopup(record, true)}>
            <CustomIcon name="view" />
          </span>

          {!CO_WORKERS_TABLE_ACTION_NO_ACCESS.includes(role) && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={`Are you sure to make Co-worker ${
                  record.active ? 'inactive' : 'active'
                } ?`}
                onConfirm={() => {
                  if (record.active) {
                    disableMutation.mutate(record._id)
                  } else {
                    updatMutation.mutate({
                      userId: record._id,
                      updatedData: {active: true},
                    })
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <span className="gx-link">
                  {record.active ? (
                    <CustomIcon name="deactiveUser" />
                  ) : (
                    <CustomIcon name="activeUser" />
                  )}
                </span>
              </Popconfirm>
              <Divider type="vertical" />
              <span
                className="gx-link"
                onClick={() => openEditPopup(record, false)}
              >
                <CustomIcon name="edit" />
              </span>
            </>
          )}
        </div>
      )
    },
  },
]

export {CO_WORKERCOLUMNS}
