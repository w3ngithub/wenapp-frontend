const ACTIVITY_LOGS = (sortedInfo) => [
  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'module' && sortedInfo.order,
  },
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'activity' && sortedInfo.order,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: true,

    sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
  },
  {
    title: 'Activity Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
  },
]

export {ACTIVITY_LOGS}
