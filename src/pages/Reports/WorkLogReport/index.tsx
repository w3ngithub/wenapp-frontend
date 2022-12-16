import React, {useState, useCallback} from 'react'
import {Button, Card, Divider, Form, Table, Tag} from 'antd'
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
import {changeDate} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'
import {debounce} from 'helpers/utils'
import {emptyText} from 'constants/EmptySearchAntd'

const FormItem = Form.Item
let screenWidth: number

const formattedWorkLogReport: any = (logs: any) => {
  return logs?.map((log: any) => ({
    ...log,
    user: log?._id?.[0]?.name,
    timeSpent: +log?.totalTimeSpent,
    details: Object.values(log?.timeLogs)?.map(
      (x: any, i: number, totalTimeLogs: any) => {
        const totalTimeOfAllProjects = totalTimeLogs[0]?.map((log: any) => {
          return log?.totalHours
        })
        const iniVal = 0
        const sumHours = totalTimeOfAllProjects.reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          iniVal
        )
        return (
          <>
            {' '}
            <div key={i}>
              <div>
                <span style={{marginLeft: '-1px'}}>
                  <Tag color="">{changeDate(x?.[0]?.logDate)}</Tag>
                </span>
                <Tag color="cyan" className="gx-ml-1">
                  {' '}
                  {sumHours} Hours
                </Tag>
              </div>
              {x.map((item: any) => (
                <div
                  className=" gx-d-flex"
                  key={item.remarks + item.totalHours}
                >
                  <span className="gx-mr-5" style={{width: '100px'}}>
                    {item.project?.[0]?.name || 'Other'}
                  </span>
                  <span
                    style={{maxWidth: screenWidth < 1808 ? '54rem' : '74rem'}}
                  >
                    {item.remarks}
                    <Tag color="cyan" className="gx-ml-1">
                      {' '}
                      {+item.totalHours} Hours
                    </Tag>
                  </span>
                </div>
              ))}
            </div>
            <Divider type="horizontal" />
          </>
        )
      }
    ),
  }))
}

function WorkLogReport() {
  //init state
  const [sort, setSort] = useState({})
  const [form] = Form.useForm()
  const [date, setDate] = useState(intialDate)
  const {innerWidth} = useWindowsSize()
  const [logType, setLogType] = useState<string | undefined>(undefined)
  const [project, setProject] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<string | undefined>(undefined)
  const [projectData, setProjectData] = useState([])
  const [dateFilter, setDateFilter] = useState({id: '1', value: 'Daily'})

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
    setDate([date[0], date[1].endOf('day')])
  }

  const handleLogTypeChange = (typeId: string) => {
    setLogType(typeId)
  }

  const handleProjectChange = (ProjectId: string) => {
    setProject(ProjectId)
  }

  const handleUserChange = (userId: string) => {
    setUser(userId)
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSort(sorter)
  }

  const handleResetFilter = () => {
    setDate(intialDate)
    setLogType(undefined)
    setProject(undefined)
    setUser(undefined)
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
        break
      case 2:
        setDate(weeklyState)
        break
      case 3:
        setDate(monthlyState)
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
              <RangePicker handleChangeDate={handleChangeDate} date={date} />
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
                options={usersData?.data?.data?.data?.map((x: any) => ({
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
        className="gx-table-responsive align-longtext"
        columns={WORK_LOG_REPORT_COLUMNS(sort)}
        dataSource={formattedWorkLogReport(logData)}
        onChange={handleTableChange}
        pagination={false}
        loading={isFetching}
      />
    </Card>
  )
}

export default WorkLogReport
