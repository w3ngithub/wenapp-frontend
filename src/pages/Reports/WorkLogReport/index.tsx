import React, {useState} from 'react'
import {Button, Card, Divider , Form, Table, Tag} from 'antd'
import RangePicker from 'components/Elements/RangePicker'
import {intialDate} from 'constants/Attendance'
import Select from 'components/Elements/Select'
import {useQuery} from '@tanstack/react-query'
import {getLogTypes, getWorkLogReport} from 'services/timeLogs'
import {getAllProjects} from 'services/projects'
import {getAllUsers} from 'services/users/userDetails'
import {WORK_LOG_REPORT_COLUMNS} from 'constants/WorkLogReport'
import moment from 'moment'
import {changeDate, toRoundoff} from 'helpers/utils'
import useWindowsSize from 'hooks/useWindowsSize'

const FormItem = Form.Item
let screenWidth:number;

const formattedWorkLogReport: any = (logs: any) => {
  return logs?.map((log: any) => ({
    ...log,
    user: log?._id?.[0]?.name,
    timeSpent: toRoundoff(log?.totalTimeSpent),
    details: Object.values(log?.timeLogs)?.map(
      (x: any, i: number, totalTimeLogs: any) => (
        <>
          {' '}
          <div key={i}>
            <span style={{marginLeft: '-1px'}}>
              <Tag color="">{changeDate(x?.[0]?.logDate)}</Tag>
            </span>
            {x.map((item: any) => (
              <div className=" gx-d-flex" key={item.remarks + item.totalHours}>
                <span className="gx-mr-5" style={{width:'100px'}}>
                  {item.project?.[0]?.name || 'Other'}
                </span>
                <span style={{maxWidth: screenWidth < 1808 ? '54rem':'74rem'}}>
                  -{item.remarks}
                  <Tag color="cyan" className="gx-ml-1">
                    {' '}
                    {toRoundoff(item.totalHours)}hrs
                  </Tag>
                </span>
              </div>
            ))}
          </div>
          <Divider type='horizontal' />

        </>
      )
    ),
  }))
}

function WorkLogReport() {
  //init state
  const [sort, setSort] = useState({})
  const [form] = Form.useForm()
  const [date, setDate] = useState(intialDate)
  const{innerWidth} = useWindowsSize();
  const [logType, setLogType] = useState<string | undefined>(undefined)
  const [project, setProject] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<string | undefined>(undefined)

  screenWidth = innerWidth;
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

  const {data: projectData} = useQuery(['WorkLogProjects'], () =>
    getAllProjects({
      fields:
        '_id,name,-devOps,-createdBy,-designers,-developers,-projectStatus,-projectTags,-projectTypes,-qa,-updatedBy',
    })
  )

  const {data: usersData} = useQuery(['WorkLogusers'], () =>
    getAllUsers({
      active: 'true',
      fields: '_id,name',
    })
  )

  const handleChangeDate = (date: any[]) => {
    setDate(date)
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
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={project}
                options={projectData?.data?.data?.data?.map((x: any) => ({
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
        className="gx-table-responsive"
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
