import React, {useEffect, useMemo, useState, useCallback} from 'react'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {Card, Table, Form, Button, DatePicker} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {
  getAllProjects,
  getProjectClients,
  getProjectStatus,
} from 'services/projects'
import {useNavigate} from 'react-router-dom'
import {notification} from 'helpers/notification'
import {getLogTypes, getWeeklyReport} from 'services/timeLogs'
import Select from 'components/Elements/Select'
import {WEEKLY_REPORT_COLUMNS} from 'constants/weeklyReport'
import {debounce, roundedToFixed, persistSession} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import {emptyText} from 'constants/EmptySearchAntd'
import {PAGE50} from 'constants/Common'
import {disabledAfterToday} from 'util/antDatePickerDisabled'

const {RangePicker} = DatePicker
const FormItem = Form.Item

const intialDate = [
  moment().startOf('isoWeek'),

  moment().day() === 0 || moment().day() === 6
    ? moment().startOf('isoWeek').add(4, 'days')
    : moment(),
]

const formattedWeeklyReports = (reports, clients) => {
  return reports?.map((report) => ({
    key: report?.project?.[0]?._id || 'Other',
    name: report?.project?.[0]?.name || 'Other',
    client: clients[report?.project?.[0]?.client] || '',
    timeSpent: roundedToFixed(report?.timeSpent || 0, 2),
  }))
}

function WeeklyReport() {
  const weeklySession = JSON.parse(sessionStorage.getItem('weekly-session'))

  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 50})
  const [projectStatus, setProjectStatus] = useState(weeklySession?.statusId)
  const [projectArray, setProjectArray] = useState(
    weeklySession?.projectDetails ? [weeklySession?.projectDetails] : []
  )
  const [project, setProject] = useState(weeklySession?.projectDetails?._id)
  const [logType, setLogType] = useState(weeklySession?.typeId)
  const [projectClient, setprojectClient] = useState(weeklySession?.clientId)
  const [date, setDate] = useState(
    weeklySession?.date
      ? [moment(weeklySession?.date[0]), moment(weeklySession?.date[1])]
      : intialDate
  )
  const [form] = Form.useForm()
  const {innerWidth} = useWindowsSize()

  const navigate = useNavigate()

  const {data: logTypesData} = useQuery(['logTypes'], getLogTypes)
  const {data: projectStatusData} = useQuery(
    ['projectStatus'],
    getProjectStatus
  )
  const {data: projectClientsData} = useQuery(
    ['projectClients'],
    getProjectClients
  )
  const {data, isLoading, isError, isFetching} = useQuery(
    ['projects', logType, projectStatus, projectClient, date, project],
    () =>
      getWeeklyReport({
        ...page,
        logType,
        projectStatus,
        client: projectClient,
        fromDate: moment.utc(date[0]).format(),
        toDate: moment.utc(date[1]).format(),
        project: project,
      }),
    {keepPreviousData: true}
  )

  const handleSearch = async (projectName) => {
    if (!projectName) {
      setProjectArray([])
      return
    } else {
      const projects = await getAllProjects({project: projectName})
      setProjectArray(projects?.data?.data?.data)
    }
    //else fetch projects from api
  }

  const optimizedFn = useCallback(debounce(handleSearch, 100), [])

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Weekly Report!', type: 'error'})
    }
  }, [isError, data])

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...prev, limit: pageSize}))
  }

  const handleLogTypeChange = (typeId) => {
    persistSession('weekly-session', weeklySession, 'typeId', typeId)
    setLogType(typeId)
  }
  const handleProjectNameChange = (projectId) => {
    const projectName = projectArray?.find(
      (project) => project?._id === projectId
    )?.name
    persistSession('weekly-session', weeklySession, 'projectDetails', {
      _id: projectId,
      name: projectName,
    })
    setProject(projectId)
  }

  const handleProjectStatusChange = (statusId) => {
    persistSession('weekly-session', weeklySession, 'statusId', statusId)
    setProjectStatus(statusId)
  }

  const handleClientChange = (clientId) => {
    persistSession('weekly-session', weeklySession, 'clientId', clientId)
    setprojectClient(clientId)
  }

  const handleResetFilter = () => {
    setDate(intialDate)
    setLogType(undefined)
    setProjectStatus(undefined)
    setprojectClient(undefined)
    setProject(undefined)
    sessionStorage.removeItem('weekly-session')
  }

  const navigateToProjectLogs = (projectSlug, newPage = false) => {
    if (!newPage) {
      navigate(`${projectSlug}`)
    } else {
      window.open(projectSlug, '_blank')
    }
  }

  const handleChangeDate = (date) => {
    persistSession('weekly-session', weeklySession, 'date', [
      date[0],
      date[1].endOf('day'),
    ])

    setDate([date[0], date[1].endOf('day')])
  }

  const clients = useMemo(() => {
    return projectClientsData?.data?.data?.data?.reduce((obj, client) => {
      obj[client._id] = client?.name
      return obj
    }, {})
  }, [projectClientsData])

  if (isLoading) {
    return <CircularProgress />
  }
  return (
    <div>
      <Card title="Weekly Report">
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-justify-content-between gx-flex-row">
            <Form layout="inline" form={form}>
              <FormItem style={{width: innerWidth <= 748 ? '100%' : 250}}>
                <RangePicker
                  onChange={handleChangeDate}
                  value={date}
                  disabledDate={disabledAfterToday}
                />
              </FormItem>
              <FormItem className="direct-form-item">
                <Select
                  showSearchIcon={true}
                  value={project}
                  onChange={handleProjectNameChange}
                  handleSearch={optimizedFn}
                  placeholder="Search Project"
                  options={(projectArray || [])?.map((project) => ({
                    id: project._id,
                    value: project.name,
                  }))}
                  inputSelect
                />
              </FormItem>
              <FormItem className="direct-form-item">
                <Select
                  placeholder="Select Project Status"
                  onChange={handleProjectStatusChange}
                  value={projectStatus}
                  options={projectStatusData?.data?.data?.data?.map((x) => ({
                    ...x,
                    id: x._id,
                    value: x.name,
                  }))}
                />
              </FormItem>
              <FormItem className="direct-form-item">
                <Select
                  placeholder="Select Log Type"
                  onChange={handleLogTypeChange}
                  value={logType}
                  options={logTypesData?.data?.data?.data?.map((x) => ({
                    ...x,
                    id: x._id,
                    value: x.name,
                  }))}
                />
              </FormItem>
              <FormItem className="direct-form-item">
                <Select
                  placeholder="Select Client"
                  onChange={handleClientChange}
                  value={projectClient}
                  options={projectClientsData?.data?.data?.data?.map((x) => ({
                    ...x,
                    id: x._id,
                    value: x.name,
                  }))}
                />
              </FormItem>
              <FormItem>
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  onClick={handleResetFilter}
                >
                  Reset
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={WEEKLY_REPORT_COLUMNS(sort, navigateToProjectLogs)}
          dataSource={formattedWeeklyReports(data?.data?.data?.report, clients)}
          onChange={handleTableChange}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['25', '50', '100'],
            showSizeChanger: true,
            total: data?.data?.data?.report?.length || 1,
            onShowSizeChange,
            hideOnSinglePage: true,
            onChange: handlePageChange,
          }}
          loading={isLoading || isFetching}
        />
      </Card>
    </div>
  )
}

export default WeeklyReport
