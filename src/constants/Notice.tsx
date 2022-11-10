import React, {ReactElement} from 'react'
import {Divider, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import {NOTICEBOARD_ACTION_NO_ACCESS} from './RoleAccess'

interface notice {
  title: string
  dataIndex?: string
  key: any
  width?: number
  sorter?: boolean
  sortOrder?: any
  render?: (text: any, record: any) => ReactElement | null
}

const NOTICE_COLUMNS = (
  sortedInfo: any,
  openModal: Function,
  confirmDelete: Function,
  role: string
): notice[] => [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
  },
  {
    title: 'Category',
    dataIndex: 'noticeType',
    key: 'noticeType',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'noticeType' && sortedInfo.order,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order,
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order,
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => {
      return (
        <div style={{display: 'flex'}}>
          <span className="gx-link" onClick={() => openModal(record, true)}>
            <CustomIcon name="view" />
          </span>
          {!NOTICEBOARD_ACTION_NO_ACCESS.includes(role) && (
            <>
              <Divider type="vertical" />
              <span
                className="gx-link"
                onClick={() => openModal(record, false)}
              >
                <CustomIcon name="edit" />
              </span>
              <Divider type="vertical" />
              <Popconfirm
                title="Are you sure to delete this notice?"
                onConfirm={() => confirmDelete(record)}
                okText="Yes"
                cancelText="No"
              >
                <span className="gx-link gx-text-danger">
                  {' '}
                  <CustomIcon name="delete" />
                </span>
              </Popconfirm>
            </>
          )}
        </div>
      )
    },
  },
]

export {NOTICE_COLUMNS}
