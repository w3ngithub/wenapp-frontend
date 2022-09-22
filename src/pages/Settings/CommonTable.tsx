import {Button, Table} from 'antd'
import React from 'react'

function CommonTable({
  data,
  columns,
  isLoading,
  onAddClick,
  hideAddButton = false,
  pagination = true,
  footer = undefined,
}: {
  data: any
  columns: any
  isLoading?: boolean
  onAddClick?: React.MouseEventHandler<HTMLElement>
  hideAddButton?: boolean
  pagination?: any
  footer?: any
}) {
  return (
    <>
      <Table
        className="gx-table-responsive"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={isLoading}
        footer={footer}
      />
    </>
  )
}

export default CommonTable
