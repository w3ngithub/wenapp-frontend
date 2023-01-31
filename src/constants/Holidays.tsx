import React, {ReactElement} from 'react'
import {Checkbox, DatePicker, Divider, Form, Input, Popconfirm} from 'antd'
import CustomIcon from 'components/Elements/Icons'
import {HOLIDAY_ACTION_NO_ACCESS} from 'constants/RoleAccess'
import {dateToDateFormat, getIsAdmin} from 'helpers/utils'

interface holiday {
  title: string
  dataIndex?: string
  key: any
  width?: number
  sorter?: (a: any, b: any) => any
  sortOrder?: any
  render?: (text: any, record: any) => ReactElement | null
}

const HOLIDAY_COLUMNS = (
  sortedInfo: any,
  confirmDelete: Function,
  openModal: Function,
  resources: any,
  mutable: boolean
): holiday[] =>
  !mutable || getIsAdmin()
    ? [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          sorter: (a, b) => {
            return a.title.toString().localeCompare(b.title.toString())
          },
          sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          sorter: (a, b) =>
            +new Date(dateToDateFormat(a.date)) -
            +new Date(dateToDateFormat(b.date)),
          sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          key: 'remarks',
          sorter: (a, b) =>
            a.remarks?.toString().localeCompare(b.remarks?.toString()),
          sortOrder: sortedInfo.columnKey === 'remarks' && sortedInfo.order,
          width: 500,
        },
      ]
    : [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          sorter: (a, b) => {
            return a.title.toString().localeCompare(b.title.toString())
          },
          sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          sorter: (a, b) =>
            +new Date(dateToDateFormat(a.date)) -
            +new Date(dateToDateFormat(b.date)),
          sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          key: 'remarks',
          sorter: (a, b) =>
            a.remarks?.toString().localeCompare(b.remarks?.toString()),
          sortOrder: sortedInfo.columnKey === 'remarks' && sortedInfo.order,
          width: 500,
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => {
            return (
              <div style={{display: 'flex'}}>
                {resources?.editHoliday && (
                  <>
                    <span
                      className="gx-link"
                      onClick={() => openModal(record, false)}
                    >
                      <CustomIcon name="edit" />
                    </span>
                    <Divider type="vertical" />
                  </>
                )}
                {resources?.deleteHoliday && (
                  <>
                    <Popconfirm
                      title="Are you sure to delete this holiday?"
                      onConfirm={() => confirmDelete(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <span className="gx-link gx-text-danger">
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

const EDIT_HOLIDAY_COLUMNS = () =>
  getIsAdmin()
    ? [
        {
          title: 'Date',
          // dataIndex: 'date',
          key: 'date',
          render: (text: any, record: any) => {
            return <DatePicker className=" gx-w-100" />
          },
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          key: 'remarks',
        },
      ]
    : [
        {
          title: 'Date Admin',
          key: 'date',
          render: (text: any, record: any) => {
            console.log({text, record})
            return (
              <Form.Item
                name={`${record?._id}date`}
                required={true}
                // rules={[
                //   {
                //     required: indexes[index],
                //     message: 'Date is required.',
                //   },
                // ]}
              >
                <DatePicker />
              </Form.Item>
            )
          },
        },
        {
          title: 'Title',
          key: 'title',
          render: (text: any, record: any) => {
            return (
              <Form.Item
                name={`${record?._id}title`}
                required={true}
                // rules={[
                //   {
                //     required: indexes[index],
                //     message: 'Date is required.',
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            )
          },
        },
        {
          title: 'Remarks',
          key: 'remarks',
          render: (text: any, record: any) => {
            return (
              <Form.Item
                name={`${record?._id}remarks`}
                required={false}
                // rules={[
                //   {
                //     required: indexes[index],
                //     message: 'Date is required.',
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            )
          },
        },
        {
          title: 'Allow Leave Application',
          key: 'action',
          render: (text: any, record: any) => {
            return (
              <Form.Item
                name={`${record?._id}allowLeaveApply`}
                required={false}
              >
                <Checkbox />
              </Form.Item>
            )
          },
        },
      ]

export {HOLIDAY_COLUMNS, EDIT_HOLIDAY_COLUMNS}
