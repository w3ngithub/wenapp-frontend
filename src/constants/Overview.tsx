import moment from 'moment'
import React, {ReactElement} from 'react'

interface tableCol {
  title: string
  dataIndex?: string
  key: any
  width?: number
  sorter?: (a: any, b: any) => any
  sortOrder?: any
  render?: (text: any, record: any) => ReactElement | null
}

const OVERVIEW_LEAVES = (sortedInfo: any): tableCol[] => [
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
    title: 'Absent From',
    dataIndex: 'absentFrom',
    key: 'absentFrom',
    width: 150,
    sorter: (a, b) =>
      +moment(a.absentFrom, 'DD-MM-YYYY') - +moment(b.absentFrom, 'DD-MM-YYYY'),
    sortOrder: sortedInfo.columnKey === 'absentFrom' && sortedInfo.order,
  },
  {
    title: 'Till',
    dataIndex: 'till',
    key: 'till',
    width: 150,
    sorter: (a, b) =>
      +moment(a.till, 'DD-MM-YYYY') - +moment(b.till, 'DD-MM-YYYY'),
    sortOrder: sortedInfo.columnKey === 'till' && sortedInfo.order,
  },
  {
    title: 'Full/Half',
    dataIndex: 'fullHalf',
    width: 150,
    key: 'fullHalf',
    sorter: (a, b) =>
      a.fullHalf.toString().localeCompare(b.fullHalf.toString()),

    sortOrder: sortedInfo.columnKey === 'fullHalf' && sortedInfo.order,
  },
  {
    title: 'Period',
    dataIndex: 'period',
    width: 150,
    key: 'period',
    sorter: (a, b) => a.period.toString().localeCompare(b.period.toString()),

    sortOrder: sortedInfo.columnKey === 'period' && sortedInfo.order,
  },
]

const OVERVIEW_CHECKEDIN = (
  sortedInfo: any,
  handleShowMap: any
): tableCol[] => [
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
    title: 'Punched In At',
    dataIndex: 'checkIn',
    key: 'checkIn',
    width: 150,
    sorter: (a, b) => a.checkIn.toString().localeCompare(b.checkIn.toString()),
    sortOrder: sortedInfo.columnKey === 'checkIn' && sortedInfo.order,
  },
  {
    title: 'Punch In Location',
    dataIndex: 'checkInLocation',
    key: 'checkInLocation',
    width: 150,
    sorter: (a, b) =>
      a.checkInLocation.toString().localeCompare(b.checkInLocation.toString()),
    sortOrder: sortedInfo.columnKey === 'checkInLocation' && sortedInfo.order,
    render: (text, record) => (
      <span
        className="gx-link"
        onClick={() => {
          handleShowMap(record)
        }}
      >
        {text}
      </span>
    ),
  },
  {
    title: 'Punched Out At',
    dataIndex: 'checkOut',
    width: 150,
    key: 'checkOut',
    sorter: (a, b) =>
      a.checkOut.toString().localeCompare(b.checkOut.toString()),

    sortOrder: sortedInfo.columnKey === 'checkOut' && sortedInfo.order,
  },
  {
    title: 'Punch Out Location',
    dataIndex: 'checkOutLocation',
    width: 150,
    key: 'checkOutLocation',
    sorter: (a, b) =>
      a.checkOutLocation
        .toString()
        .localeCompare(b.checkOutLocation.toString()),

    sortOrder: sortedInfo.columnKey === 'checkOutLocation' && sortedInfo.order,
    render: (text, record) => (
      <span
        className="gx-link"
        onClick={() => {
          handleShowMap(record, 'out')
        }}
      >
        {text}
      </span>
    ),
  },
]

const OVERVIEW_NOTCHECKEDIN = (sortedInfo: any): tableCol[] => [
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
    title: 'Punched In At',
    dataIndex: 'checkIn',
    key: 'checkIn',
    width: 150,
    sorter: (a, b) => a.checkIn.toString().localeCompare(b.checkIn.toString()),
    sortOrder: sortedInfo.columnKey === 'checkIn' && sortedInfo.order,
  },

  {
    title: 'Punched Out At',
    dataIndex: 'checkOut',
    width: 150,
    key: 'checkOut',
    sorter: (a, b) =>
      a.checkOut.toString().localeCompare(b.checkOut.toString()),

    sortOrder: sortedInfo.columnKey === 'checkOut' && sortedInfo.order,
  },
]

const DEADLINE_PROJECTS = (
  sortedInfo: any,
  navigateToProjectLogs: (a: string) => void
): tableCol[] => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 250,
    sorter: (a, b) => {
      return a.name.toString().localeCompare(b.name.toString())
    },
    sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
  },
  {
    title: 'Action',
    key: 'action',
    width: 250,
    render: (text, record) => {
      return (
        <span
          className="gx-link"
          onClick={() => navigateToProjectLogs(`${record._id}-${record.slug}`)}
        >
          Log Time
        </span>
      )
    },
  },
]

export {
  OVERVIEW_LEAVES,
  OVERVIEW_CHECKEDIN,
  OVERVIEW_NOTCHECKEDIN,
  DEADLINE_PROJECTS,
}
