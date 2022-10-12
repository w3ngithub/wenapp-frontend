import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import React from 'react'
import {LEAVE_TABLE_ACTION_NO_ACESS} from './RoleAccess'

const LEAVES_COLUMN = (
  onCancelClick: (param: any) => void,
  onApproveClick?: (param: any) => void,
  onEditClick?: (param: any, param2: any) => void,
  isAdmin: boolean = false,
  role?: any
) =>
  role
    ? [
        {
          title: 'Co-worker',
          dataIndex: 'coWorker',
          key: 'Co-worker',
          width: 150,
        },
        {
          title: 'Dates',
          dataIndex: 'dates',
          key: 'dates',
          width: 10,
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          width: 10,
        },
        {
          title: 'Reason',
          dataIndex: 'reason',
          width: 300,
          key: 'reason',
          render: (text: any, record: any) => {
            return (
              <div className="max-two-lines">
                <span>{record.reason}</span>
              </div>
            )
          },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 10,
          key: 'status',
        },
        {
          title: 'Action',
          key: 'action',
          width: 10,
          render: (text: any, record: any) => {
            if (isAdmin && onEditClick && onApproveClick)
              return (
                <div style={{display: 'flex'}}>
                  <span
                    className="gx-link gx-text-primary"
                    onClick={() => onEditClick(record, true)}
                  >
                    <CustomIcon name="view" />
                  </span>
                  <AccessWrapper noAccessRoles={LEAVE_TABLE_ACTION_NO_ACESS}>
                    <>
                      <Divider type="vertical" />
                      {!['approved', 'cancelled'].includes(record.status) && (
                        <>
                          <Popconfirm
                            title="Are you sure you want to approve?"
                            onConfirm={() => onApproveClick(record)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <span className="gx-link gx-text-green">
                              Approve
                            </span>
                          </Popconfirm>
                          <Divider type="vertical" />
                          <Popconfirm
                            title="Are you sure you want to cancel?"
                            onConfirm={() => onCancelClick(record)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <span className="gx-link gx-text-danger">
                              Cancel
                            </span>
                          </Popconfirm>
                          <Divider type="vertical" />

                          <i
                            className="icon icon-edit gx-link"
                            onClick={() => onEditClick(record, false)}
                          />
                        </>
                      )}
                    </>
                  </AccessWrapper>
                </div>
              )
            return record.status === 'pending' ? (
              <Popconfirm
                title="Are you sure you want to cancel?"
                onConfirm={() => onCancelClick(record)}
                okText="Yes"
                cancelText="No"
              >
                <span className="gx-link gx-text-danger">Cancel</span>
              </Popconfirm>
            ) : null
          },
        },
      ]
    : [
        {
          title: 'Co-worker',
          dataIndex: 'coWorker',
          key: 'Co-worker',
          width: 150,
        },
        {
          title: 'Dates',
          dataIndex: 'dates',
          key: 'dates',
          width: 10,
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          width: 10,
        },
        {
          title: 'Reason',
          dataIndex: 'reason',
          width: 300,
          key: 'reason',
          render: (text: any, record: any) => {
            return (
              <div className="max-two-lines">
                <span>{record.reason}</span>
              </div>
            )
          },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 10,
          key: 'status',
        },

        {
          title: 'Action',
          key: 'action',
          width: 10,
          render: (text: any, record: any) => {
            if (isAdmin && onEditClick && onApproveClick)
              return (
                <div style={{display: 'flex'}}>
                  <span
                    className="gx-link gx-text-primary"
                    onClick={() => onEditClick(record, true)}
                  >
                    <CustomIcon name="view" />
                  </span>
                  <Divider type="vertical" />
                  {!['approved', 'cancelled'].includes(record.status) && (
                    <>
                      <Popconfirm
                        title="Are you sure you want to approve?"
                        onConfirm={() => onApproveClick(record)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <span className="gx-link gx-text-green">Approve</span>
                      </Popconfirm>
                      <Divider type="vertical" />

                      <i
                        className="icon icon-edit gx-link"
                        onClick={() => onEditClick(record, false)}
                      />
                    </>
                  )}
                </div>
              )
            return record.status === 'pending' ? (
              <Popconfirm
                title="Are you sure you want to cancel?"
                onConfirm={() => onCancelClick(record)}
                okText="Yes"
                cancelText="No"
              >
                <span className="gx-link gx-text-danger">Cancel</span>
              </Popconfirm>
            ) : null
          },
        },
      ]

const STATUS_TYPES = [
  {id: 'approved', value: 'Approved'},
  {id: 'pending', value: 'Pending'},
  {id: 'cancelled', value: 'Cancelled'},
]

export {LEAVES_COLUMN, STATUS_TYPES}

export const LATE_LEAVE_TYPE_ID = '631192ec8194d8f22afe6685'

export const LEAVES_TYPES = {
  Maternity: 'maternity',
  Paternity: 'paternity',
  PTO: 'paid time off',
  LateArrival: 'late arrival',
}
