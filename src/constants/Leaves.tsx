import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {getIsAdmin} from 'helpers/utils'
import React from 'react'
import {LEAVE_TABLE_ACTION_NO_ACESS} from './RoleAccess'

const LEAVES_COLUMN = (
  onCancelLeave?: (param: any) => void,
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
                      {!getIsAdmin() &&
                        ![STATUS_TYPES[1].id, STATUS_TYPES[3].id].includes(
                          record.leaveStatus
                        ) && (
                          <span
                            onClick={() => onApproveClick(record)}
                            className="gx-link gx-text-green"
                          >
                            Approve
                          </span>
                        )}

                      {![STATUS_TYPES[3].id].includes(record.leaveStatus) &&
                        !getIsAdmin() && (
                          <>
                            <Divider type="vertical" />
                            <span
                              className="gx-link gx-text-danger"
                              onClick={() =>
                                onCancelLeave ? onCancelLeave(record) : () => {}
                              }
                            >
                              Cancel
                            </span>
                          </>
                        )}

                      {!getIsAdmin() &&
                        ![STATUS_TYPES[1].id, STATUS_TYPES[3].id].includes(
                          record.leaveStatus
                        ) && (
                          <>
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
            return record.leaveStatus === STATUS_TYPES[2].id &&
              !getIsAdmin() ? (
              <span
                className="gx-link gx-text-danger"
                onClick={() =>
                  onCancelLeave ? onCancelLeave(record) : () => {}
                }
              >
                Cancel
              </span>
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
          width: 30,
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
                  {!getIsAdmin() &&
                    ![STATUS_TYPES[1].id, STATUS_TYPES[3].id].includes(
                      record.leaveStatus
                    ) && (
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
            return (
              <div style={{display: 'flex'}}>
                <span
                  className="gx-link gx-text-primary"
                  onClick={() =>
                    onEditClick ? onEditClick(record, true) : () => {}
                  }
                >
                  <CustomIcon name="view" />
                </span>

                {record.leaveStatus === STATUS_TYPES[2].id && !getIsAdmin() && (
                  <>
                    {' '}
                    <Divider type="vertical" />{' '}
                    <span
                      className="gx-link gx-text-danger"
                      onClick={() =>
                        onCancelLeave ? onCancelLeave(record) : () => {}
                      }
                    >
                      Cancel
                    </span>{' '}
                  </>
                )}
              </div>
            )
          },
        },
      ]

const STATUS_TYPES = [
  {id: '', value: 'All'},
  {id: 'approved', value: 'Approved'},
  {id: 'pending', value: 'Pending'},
  {id: 'cancelled', value: 'Cancelled'},
]

export {LEAVES_COLUMN, STATUS_TYPES}

export const LATE_LEAVE_TYPE_ID = '631192ec8194d8f22afe6685'
export const LATE_ARRIVAL = 'Late Arrival'
export const CASUAL_LEAVE = 'Casual Leave'

export const LEAVES_TYPES = {
  Casual: 'casual',
  Sick: 'sick',
  Maternity: 'maternity',
  Paternity: 'paternity',
  PTO: 'paid time off',
  LateArrival: 'late arrival',
}
