import React, {useState, useCallback} from 'react'
import {Button, Card, Form, Table} from 'antd'
import RangePicker from 'components/Elements/RangePicker'
import Select from 'components/Elements/Select'
import {useQuery} from '@tanstack/react-query'
import {getLogTypes, getWorkLogReport} from 'services/timeLogs'
import {getAllProjects} from 'services/projects'
import {getAllUsers} from 'services/users/userDetails'
import {WORK_LOG_REPORT_COLUMNS} from 'constants/WorkLogReport'
import moment from 'moment'
import {
  attendanceFilter,
  intialDate,
  monthlyState,
  weeklyState,
} from 'constants/Attendance'
import useWindowsSize from 'hooks/useWindowsSize'
import {debounce, filterSpecificUser} from 'helpers/utils'
import {emptyText} from 'constants/EmptySearchAntd'
import {ADMINISTRATOR} from 'constants/UserNames'
import {disabledAfterToday} from 'util/antDatePickerDisabled'

const FormItem = Form.Item
let screenWidth: number

const formattedWorkLogReport: any = (logs: any) => {
  return logs?.map((log: any, index: number) => ({
    ...log,
    key: index,
    user: log?._id?.[0]?.name,
    timeSpent: +log?.totalTimeSpent,
    details: Object.values(log?.timeLogs),
  }))
}

function WorkLogReport() {
  const workLogSession = JSON.parse(
    sessionStorage.getItem('worklog-session') || '{}'
  )

  //init state
  const [sort, setSort] = useState({
    column: undefined,
    order: 'ascend',
    field: 'user',
    columnKey: 'user',
  })
  const [form] = Form.useForm()
  const [date, setDate] = useState(
    workLogSession?.date
      ? [moment(workLogSession?.date[0]), moment(workLogSession?.date[1])]
      : intialDate
  )
  const {innerWidth} = useWindowsSize()
  const [logType, setLogType] = useState<string | undefined>(
    workLogSession?.typeId
  )
  const [project, setProject] = useState<string | undefined>(
    workLogSession?.projectDetail?._id
  )

  const [user, setUser] = useState<string | undefined>(workLogSession?.userId)
  const [projectData, setProjectData] = useState<any>(
    workLogSession?.projectDetail ? [workLogSession?.projectDetail] : []
  )
  const [dateFilter, setDateFilter] = useState(
    workLogSession?.dateWord || {id: '1', value: 'Daily'}
  )

  screenWidth = innerWidth
  //init hooks

  const {data, isFetching} = useQuery(
    ['workLogReports', user, project, logType, date],
    () =>
      getWorkLogReport({
        user,
        project,
        logType,
        fromDate: date?.[0] ? moment.utc(date[0]).format() : '',
        toDate: date?.[1] ? moment.utc(date[1]).format() : '',
      })
  )

  const {data: logTypesData} = useQuery(['logTypes'], getLogTypes)

  // const {data: projectData} = useQuery(['WorkLogProjects'], () =>
  //   getAllProjects({
  //     fields:
  //       '_id,name,-devOps,-createdBy,-designers,-developers,-projectStatus,-projectTags,-projectTypes,-qa,-updatedBy',
  //   })
  // )

  const handleSearch = async (projectName: any) => {
    if (!projectName) {
      setProjectData([])
      return
    } else {
      const projects = await getAllProjects({project: projectName})
      setProjectData(projects?.data?.data?.data)
    }
  }

  const optimizedFn = useCallback(debounce(handleSearch, 100), [])

  const {data: usersData} = useQuery(['WorkLogusers'], () =>
    getAllUsers({
      active: 'true',
      fields: '_id,name',
      sort: 'name',
    })
  )

  const handleChangeDate = (date: any[]) => {
    sessionStorage.setItem(
      'worklog-session',
      JSON.stringify({...workLogSession, date: [date[0], date[1].endOf('day')]})
    )
    setDate([date[0], date[1].endOf('day')])
  }

  const handleLogTypeChange = (typeId: string) => {
    sessionStorage.setItem(
      'worklog-session',
      JSON.stringify({...workLogSession, typeId})
    )
    setLogType(typeId)
  }

  const handleProjectChange = (ProjectId: string) => {
    const projectDetail = projectData?.find((d: any) => d?._id === ProjectId)
    sessionStorage.setItem(
      'worklog-session',
      JSON.stringify({
        ...workLogSession,
        projectDetail: {_id: ProjectId, name: projectDetail?.name},
      })
    )
    setProject(ProjectId)
  }

  const handleUserChange = (userId: string) => {
    sessionStorage.setItem(
      'worklog-session',
      JSON.stringify({...workLogSession, userId})
    )
    setUser(userId)
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }

  const handleResetFilter = () => {
    setDateFilter({id: '1', value: 'Daily'})
    setDate(intialDate)
    setLogType(undefined)
    setProject(undefined)
    setUser(undefined)
    sessionStorage.removeItem('worklog-session')
  }

  const logData: any[] =
    data?.data?.data?.report.map((x: any) => ({
      ...x,
      timeLogs: x?.timeLogs?.reduce((acc: any, item: any) => {
        const logDate = item.logDate.split('T')[0]
        acc[logDate] = (acc[logDate] || []).concat(item)
        return acc
      }, {}),
    })) || []

  const handleOptionChnageChange = (val: any) => {
    setDateFilter(val)
    switch (val) {
      case 1:
        setDate(intialDate)
        sessionStorage.setItem(
          'worklog-session',
          JSON.stringify({...workLogSession, date: intialDate, dateWord: val})
        )
        break
      case 2:
        setDate(weeklyState)
        sessionStorage.setItem(
          'worklog-session',
          JSON.stringify({...workLogSession, date: weeklyState, dateWord: val})
        )
        break
      case 3:
        setDate(monthlyState)
        sessionStorage.setItem(
          'worklog-session',
          JSON.stringify({...workLogSession, date: monthlyState, dateWord: val})
        )
        break

      default:
        break
    }
  }

  return (
    <Card title="Work Log Report">
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline" form={form}>
            <FormItem>
              <RangePicker
                handleChangeDate={handleChangeDate}
                date={date}
                disabledDate={disabledAfterToday}
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                onChange={handleOptionChnageChange}
                value={dateFilter}
                options={attendanceFilter}
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={project}
                handleSearch={optimizedFn}
                options={projectData.map((x: any) => ({
                  ...x,
                  id: x._id,
                  value: x.name,
                }))}
                inputSelect
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Co-worker"
                onChange={handleUserChange}
                value={user}
                options={filterSpecificUser(
                  usersData?.data?.data?.data,
                  ADMINISTRATOR
                )?.map((x: any) => ({
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
                options={logTypesData?.data?.data?.data?.map((x: any) => ({
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
        className={`gx-table-responsive align-longtext ${
          logData.length > 0 && 'worklog'
        }`}
        columns={WORK_LOG_REPORT_COLUMNS(sort, screenWidth)}
        dataSource={formattedWorkLogReport(logData)}
        onChange={handleTableChange}
        pagination={false}
        loading={isFetching}
      />
    </Card>
  )
}

export default WorkLogReport
