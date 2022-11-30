import React, {useState} from 'react'
import {Card, Table} from 'antd'
import {DEADLINE_PROJECTS} from 'constants/Overview'
import {useNavigate} from 'react-router-dom'

const DeadlineProjects = ({projects}: {projects: {}[]}) => {
  const navigate = useNavigate()
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})
  const onShowSizeChange = (_: number, pageSize: number) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const navigateToProjectLogs = (projectSlug: string) => {
    navigate(`/projects/${projectSlug}`)
  }

  const handlePageChange = (pageNumber: number) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const handleTableChange = (pagination: {}, filters: {}, sorter: {}) => {
    setSort(sorter)
  }
  return (
    <Card title={''}>
      <Table
        className="gx-table-responsive"
        columns={DEADLINE_PROJECTS(sort, navigateToProjectLogs)}
        dataSource={projects}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: projects?.length || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
      />
    </Card>
  )
}

export default DeadlineProjects
