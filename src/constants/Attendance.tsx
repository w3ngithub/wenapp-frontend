import React, {ReactElement} from 'react'
import moment from 'moment'
import CustomIcon from 'components/Elements/Icons'
import {Popconfirm} from 'antd'
import {NINE_HOURS} from './Common'
import {ATTENDANCE_LATE_ATTENDANCE_CUT_LEAVE_NO_ACCESS} from './RoleAccess'
import {daySorter, getIsAdmin} from 'helpers/utils'

interface notice {
  title: string
  dataIndex?: string
  key: any
  width?: number
  sorter?: (a: any, b: any) => any
  sortOrder?: any
  render?: (text: any, record: any) => ReactElement | null
}

type days =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

const ATTENDANCE_COLUMNS = (
  sortedInfo: any,
  openModal: Function,
  admin: boolean
): notice[] =>
  admin
    ? [
        {
          title: 'Co-worker',
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => {
            return a.user.toString().localeCompare(b.user.toString())
          },
          sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        },
        {
          title: 'Date',
          dataIndex: 'attendanceDate',
          key: 'attendanceDate',
          sorter: (a, b) =>
            +new Date(a.attendanceDate) - +new Date(b.attendanceDate) ||
            a.user.toString().localeCompare(b.user.toString()),
          sortOrder:
            sortedInfo.columnKey === 'attendanceDate' && sortedInfo.order,
        },
        {
          title: 'Day',
          dataIndex: 'attendanceDay',
          key: 'attendanceDay',
          sorter: (a, b) => {
            let first: days = a?.attendanceDay
            let second: days = b?.attendanceDay
            return daySorter[first] - daySorter[second]
          },
          sortOrder:
            sortedInfo.columnKey === 'attendanceDay' && sortedInfo.order,
        },
        {
          title: 'Punch-in Time',
          dataIndex: 'punchInTime',
          key: 'punchInTime',
          sorter: (a, b) =>
            a.punchInTime?.toString().localeCompare(b.punchInTime?.toString()),
          sortOrder: sortedInfo.columnKey === 'punchInTime' && sortedInfo.order,
        },
        {
          title: 'Punch-out Time',
          dataIndex: 'punchOutTime',
          key: 'punchOutTime',
          sorter: (a, b) =>
            a.punchOutTime
              ?.toString()
              .localeCompare(b.punchOutTime?.toString()),
          sortOrder:
            sortedInfo.columnKey === 'punchOutTime' && sortedInfo.order,
        },
        {
          title: 'Office hour',
          dataIndex: 'officeHour',
          key: 'officeHour',
          sorter: (a, b) => a?.intHour - b?.intHour,
          sortOrder: sortedInfo.columnKey === 'officeHour' && sortedInfo.order,
          render: (text: string, record) => {
            return (
              <span
                className={
                  record.data
                    ?.map((x: any) =>
                      x?.punchOutTime
                        ? new Date(x?.punchOutTime).getTime() -
                          new Date(x?.punchInTime).getTime()
                        : ''
                    )
                    .filter(Boolean)
                    ?.reduce((accumulator: number, value: number) => {
                      return accumulator + value
                    }, 0) < NINE_HOURS
                    ? 'gx-text-danger'
                    : ''
                }
              >
                {text}
              </span>
            )
          },
        },
      ]
    : [
        {
          title: 'Date',
          dataIndex: 'attendanceDate',
          key: 'attendanceDate',
          sorter: (a, b) =>
            +new Date(a.attendanceDate) - +new Date(b.attendanceDate),
          sortOrder:
            sortedInfo.columnKey === 'attendanceDate' && sortedInfo.order,
        },
        {
          title: 'Day',
          dataIndex: 'attendanceDay',
          key: 'attendanceDay',
          sorter: (a, b) => {
            let first: days = a?.attendanceDay
            let second: days = b?.attendanceDay
            return daySorter[first] - daySorter[second]
          },
          sortOrder:
            sortedInfo.columnKey === 'attendanceDay' && sortedInfo.order,
        },
        {
          title: 'Punch-in Time',
          dataIndex: 'punchInTime',
          key: 'punchInTime',
          sorter: (a, b) =>
            a.punchInTime?.toString().localeCompare(b.punchInTime?.toString()),
          sortOrder: sortedInfo.columnKey === 'punchInTime' && sortedInfo.order,
        },
        {
          title: 'Punch-out Time',
          dataIndex: 'punchOutTime',
          key: 'punchOutTime',
          sorter: (a, b) =>
            a.punchOutTime
              ?.toString()
              .localeCompare(b.punchOutTime?.toString()),
          sortOrder:
            sortedInfo.columnKey === 'punchOutTime' && sortedInfo.order,
        },
        {
          title: 'Office hour',
          dataIndex: 'officeHour',
          key: 'officeHour',
          sorter: (a, b) => a?.intHour - b?.intHour,
          sortOrder: sortedInfo.columnKey === 'officeHour' && sortedInfo.order,
          render: (text: string, record) => {
            return (
              <span
                className={
                  record.data
                    ?.map((x: any) =>
                      x?.punchOutTime
                        ? new Date(x?.punchOutTime).getTime() -
                          new Date(x?.punchInTime).getTime()
                        : ''
                    )
                    .filter(Boolean)
                    ?.reduce((accumulator: number, value: number) => {
                      return accumulator + value
                    }, 0) < NINE_HOURS
                    ? 'gx-text-danger'
                    : ''
                }
              >
                {text}
              </span>
            )
          },
        },
      ]

const LATE_ATTENDANCE_COLUMNS = (
  sortedInfo: any,
  hanldeLeaveCutModal: Function,
  role: string
): notice[] =>
  ATTENDANCE_LATE_ATTENDANCE_CUT_LEAVE_NO_ACCESS.includes(role)
    ? [
        {
          title: 'Co-worker',
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => {
            return a.user.toString().localeCompare(b.user.toString())
          },
          sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        },

        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          sorter: (a, b) =>
            a.count?.toString().localeCompare(b.count?.toString()),
          sortOrder: sortedInfo.columnKey === 'count' && sortedInfo.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          sorter: (a, b) =>
            a.status?.toString().localeCompare(b.status?.toString()),
          sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        },
      ]
    : [
        {
          title: 'Co-worker',
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => {
            return a.user.toString().localeCompare(b.user.toString())
          },
          sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        },

        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          sorter: (a, b) =>
            a.count?.toString().localeCompare(b.count?.toString()),
          sortOrder: sortedInfo.columnKey === 'count' && sortedInfo.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          sorter: (a, b) =>
            a.status?.toString().localeCompare(b.status?.toString()),
          sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          render: (text, record) => {
            return (
              <div
                style={{
                  display: record?.data?.every(
                    (item: any) => item.lateArrivalLeaveCut === true
                  )
                    ? 'none'
                    : 'flex',
                }}
              >
                <span
                  className="gx-link"
                  onClick={() => hanldeLeaveCutModal(record)}
                >
                  {!getIsAdmin() && <CustomIcon name="leaveCut" />}
                </span>
              </div>
            )
          },
        },
      ]

const attendanceFilter = [
  {id: 1, value: 'Daily'},
  {id: 2, value: 'Weekly'},
  {id: 3, value: 'Monthly'},
]

export const intialDate = [moment().startOf('day'), moment().endOf('day')]
export const weeklyState = [moment().startOf('week'), moment().endOf('day')]
export const monthlyState = [moment().startOf('month'), moment().endOf('month')]

export {ATTENDANCE_COLUMNS, attendanceFilter, LATE_ATTENDANCE_COLUMNS}

export const leaveCutStatus = [
  {id: '1', value: 'Leave Not Cut '},
  {id: '2', value: 'Leave Cut '},
]
