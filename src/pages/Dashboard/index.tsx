import React, {useEffect, useState} from 'react'
import {ReactComponent as LeaveIcon} from 'assets/images/Leave.svg'
import {Button, Card, Col, Form, Row, Spin} from 'antd'
import Auxiliary from 'util/Auxiliary'
import Widget from 'components/Elements/Widget/index'
import TotalCountCard from 'components/Elements/TotalCountCard'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import EventsAndAnnouncements from 'components/Modules/EventsAndAnnouncements'
import {
  LoginOutlined,
  LogoutOutlined,
  ExceptionOutlined,
} from '@ant-design/icons'
import TinyBarChart from 'routes/extensions/charts/recharts/bar/Components/TinyBarChart'
import Select from 'components/Elements/Select'
import {useQuery} from '@tanstack/react-query'
import {getAllProjects} from 'services/projects'
import {getLogTypes, getTimeLogChart} from 'services/timeLogs'
import CustomActiveShapePieChart from 'routes/extensions/charts/recharts/pie/Components/CustomActiveShapePieChart'
import {
  getPendingLeavesCount,
  getTodaysUserLeaveCount,
  getWeekRangeLeaves,
} from 'services/leaves'
import {
  getLocalStorageData,
  MuiFormatDate,
  oneWeekFilterCheck,
} from 'helpers/utils'
import {getWeeklyNotices} from 'services/noticeboard'
import {getAllHolidays} from 'services/resources'
import {
  getActiveUsersCount,
  getBirthMonthUsers,
  getSalaryReviewUsers,
} from 'services/users/userDetails'
import {getTodaysUserAttendanceCount} from 'services/attendances'
import {useNavigate} from 'react-router-dom'
import useWindowsSize from 'hooks/useWindowsSize'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import {useSelector} from 'react-redux'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {
  DASHBOARD_ICON_ACCESS,
  DASHBOARD_PROJECT_LOG_NO_ACCESS,
} from 'constants/RoleAccess'
import {LEAVES_TYPES} from 'constants/Leaves'

const FormItem = Form.Item

const localizer = momentLocalizer(moment)

const Dashboard = () => {
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  const [chart, setChart] = useState('1')
  const [project, setProject] = useState('')
  const [logType, setlogType] = useState('')
  const navigate = useNavigate()
  const loggedInUser = getLocalStorageData(LOCALSTORAGE_USER)
  const {innerWidth} = useWindowsSize()
  const [form] = Form.useForm()
  const {themeType} = useSelector((state: any) => state.settings)
  const darkTheme = themeType === THEME_TYPE_DARK

  const darkThemeTextColor = '#e0e0e0'

  const {data: salaryReview} = useQuery(
    ['usersSalaryReview'],
    getSalaryReviewUsers
  )

  const {data: AttendanceCount} = useQuery(
    ['todaysAttendance'],
    getTodaysUserAttendanceCount
  )

  const {data: PendingLeaves} = useQuery(
    ['pendingLeave'],
    getPendingLeavesCount
  )

  const {data: ActiveUsers} = useQuery(
    ['DashBoardActiveUsers'],
    getActiveUsersCount
  )

  const {data: TodaysLeave} = useQuery(
    ['DashBoardTodaysLeave'],
    getTodaysUserLeaveCount
  )

  const {data: BirthMonthUsers} = useQuery(
    ['bithMonthUsers'],
    getBirthMonthUsers
  )

  const {data: notices} = useQuery(['DashBoardnotices'], getWeeklyNotices)

  const {data: Holidays} = useQuery(['DashBoardHolidays'], () =>
    getAllHolidays({sort: '-createdAt', limit: '1'})
  )

  const chartQuery = useQuery(
    ['projectChart', project, logType],
    () => getTimeLogChart({project, logType}),
    {enabled: false, refetchOnWindowFocus: false}
  )

  const leavesQuery = useQuery(
    ['DashBoardleaves'],
    () => getWeekRangeLeaves(),
    {
      onError: (err) => console.log(err),
      select: (res) => {
        let updateLeaves: any[] = []

        res?.data?.data?.users?.forEach((leave: any) => {
          const isLeavePaternity =
            leave?.leaveType[0].toLowerCase() === LEAVES_TYPES.Paternity
          const isLeaveMaternity =
            leave?.leaveType[0].toLowerCase() === LEAVES_TYPES.Maternity
          const isLeavePTO =
            leave?.leaveType[0].toLowerCase() === LEAVES_TYPES.PTO

          if (isLeavePaternity || isLeaveMaternity || isLeavePTO) {
            const weeksLastDate = new Date(
              MuiFormatDate(new Date().setDate(new Date().getDate() + 7))
            )
            const startLeaveDate = new Date(leave?.leaveDates[0])
            const endLeaveDate = new Date(leave?.leaveDates[1])
            const todayDate = new Date(MuiFormatDate(new Date()))
            for (let i = 0; i < 8; i++) {
              const isHoliday =
                startLeaveDate.getDay() === 0 || startLeaveDate.getDay() === 6

              if (
                startLeaveDate >= todayDate &&
                startLeaveDate <= weeksLastDate &&
                startLeaveDate <= endLeaveDate &&
                !isHoliday
              ) {
                updateLeaves = [
                  ...updateLeaves,
                  {
                    ...leave,
                    date: leave?.leaveDates[0],

                    leaveDates: new Date(
                      startLeaveDate.setDate(startLeaveDate.getDate())
                    ).toJSON(),
                  },
                ]
              }

              if (startLeaveDate < todayDate) {
                startLeaveDate.setMonth(todayDate.getMonth())
                startLeaveDate.setFullYear(todayDate.getFullYear())
                updateLeaves = [
                  ...updateLeaves,
                  {
                    ...leave,
                    date: leave?.leaveDates[0],
                    leaveDates: new Date(
                      startLeaveDate.setDate(todayDate.getDate())
                    ).toJSON(),
                  },
                ]
              }
              startLeaveDate.setDate(startLeaveDate.getDate() + 1)
            }
          } else {
            updateLeaves = [
              ...updateLeaves,
              {...leave, date: leave?.leaveDates[0]},
            ]
          }
        })
        return updateLeaves
      },
    }
  )
  const {data, refetch: projectRefetch} = useQuery(
    ['DashBoardprojects'],
    () =>
      getAllProjects({
        fields:
          '_id,name,-devOps,-createdBy,-designers,-developers,-projectStatus,-projectTags,-projectTypes,-qa,-updatedBy',
      }),
    {enabled: false}
  )

  const {data: logTypes, refetch: logTypeRefetch} = useQuery(
    ['DashBoardlogTypes'],
    () => getLogTypes(),
    {enabled: false}
  )

  useEffect(() => {
    if (!DASHBOARD_PROJECT_LOG_NO_ACCESS.includes(key)) {
      Promise.all([logTypeRefetch(), projectRefetch()])
    }
  }, [key, logTypeRefetch, projectRefetch])

  const generateChart = (values: any) => {
    if (project === '' || project === undefined) return
    chartQuery.refetch()
  }
  const handleEventStyle = (event: any) => {
    let style: any = {
      fontSize: innerWidth <= 1500 ? '7px' : '9px',
      width: innerWidth <= 729 ? '2.5rem' : 'fit-content',
      margin: '0px auto',
      fontWeight: '600',
      height: 'fit-content',

      background: 'transparent',
    }
    if (event.type === 'birthday')
      style = {
        ...style,

        color: darkTheme ? darkThemeTextColor : '#FC6BAB',
      }
    if (event.type === 'holiday')
      style = {
        ...style,
        color: 'rgb(235 68 68)',
      }
    if (event.type === 'leave')
      style = {
        ...style,
        fontWeight: '400',
        marginTop: '-4px',
        marginBottom: '3px',
        marginLeft: '11px',
        color: darkTheme ? darkThemeTextColor : '#038fde',
      }
    if (event.type === 'notice')
      style = {
        ...style,
        width: '100%',
        fontWeight: '500',
        background: '#a7acaf',
        color: darkTheme ? darkThemeTextColor : 'black',
        marginBottom: '6px',
      }

    return {
      style,
    }
  }

  const CustomEvent = (props: any) => {
    const nameSplitted = props?.event?.title.split(' ')
    let lastName
    if (nameSplitted.length === 1) lastName = ''
    else lastName = `${nameSplitted.pop().substring(0, 1)}.`
    const shortName = `${nameSplitted.join(' ')} ${lastName ? lastName : ''}`

    const style = {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      margin: '0 !important',
    }

    if (props.event.type === 'birthday')
      return (
        <p style={{...style, margin: 0, flexWrap: 'wrap'}}>
          <i className="icon icon-birthday-new gx-fs-lg" />
          {shortName}
        </p>
      )
    if (props.event.type === 'holiday')
      return (
        <p style={{...style, margin: 0, flexWrap: 'wrap'}}>
          <i className="icon icon-calendar gx-fs-xxl" />
          <p style={{...style}}>{props?.event?.title}</p>
        </p>
      )

    if (props.event.type === 'leave')
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
          onClick={
            isAdmin
              ? () =>
                  navigate('/leave', {
                    state: {
                      tabKey: '3',
                      leaveStatus: 'approved',
                      date: props.event.startDate,
                      user: props.event.id,
                    },
                  })
              : () => {}
          }
        >
          <p style={{...style, margin: 0, flexWrap: 'wrap', fontWeight: '500'}}>
            <LeaveIcon
              width="18px"
              fill={darkTheme ? darkThemeTextColor : '#038fde'}
            />
            {shortName}
          </p>
        </div>
      )

    if (props.event.type === 'notice') {
      return (
        <p
          onClick={
            isAdmin
              ? () =>
                  navigate('/noticeboard', {state: {name: props?.event?.name}})
              : () => {}
          }
          style={{
            margin: '0',
            textAlign: 'center',
            padding: '4px',
            whiteSpace: 'normal',
          }}
        >
          {props?.event?.name}
        </p>
      )
    }

    return <p>{props?.event?.name}</p>
  }

  let components = {
    event: CustomEvent, // used by each view (Month, Day, Week)
  }

  const leaveUsers = leavesQuery?.data?.map((x: any, index: number) => ({
    title: x?.user[0],
    start: new Date(new Date(x.leaveDates).toLocaleDateString().split('T')[0]),
    end: new Date(new Date(x.leaveDates).toLocaleDateString().split('T')[0]),
    type: 'leave',
    date: x?.leaveDates,
    startDate: x?.date,
    halfDay: x?.halfDay,
    leaveType: x?.leaveType[0].split(' ').slice(0, 2).join(' '),
    id: x?._id[0],
  }))

  const noticesCalendar = notices?.data?.data?.notices?.map((x: any) => ({
    title: x?.noticeType?.name,
    end: x.endDate ? new Date(x.endDate) : new Date(x.startDate),
    start: new Date(x.startDate),
    type: 'notice',
    name: x?.title,
  }))

  const holidaysCalendar = Holidays?.data?.data?.data?.[0]?.holidays
    ?.filter(oneWeekFilterCheck)
    ?.map((x: any) => ({
      title: x.title,
      start: new Date(x.date),
      end: new Date(x.date),
      type: 'holiday',
    }))

  const BirthDayCalendar = BirthMonthUsers?.data?.data?.users?.map(
    (x: any) => ({
      title: x.name,
      start: new Date(
        `${new Date().getFullYear()}/${
          new Date(x.dob).getMonth() + 1
        }/${new Date(x.dob).getDate()}`
      ),
      end: new Date(
        `${new Date().getFullYear()}/${
          new Date(x.dob).getMonth() + 1
        }/${new Date(x.dob).getDate()}`
      ),
      type: 'birthday',
    })
  )
  const calendarEvents = [
    ...(holidaysCalendar || []),
    ...(noticesCalendar || []),
    ...(BirthDayCalendar || []),
    ...(leaveUsers || []),
  ]

  const chartData = chartQuery?.data?.data?.data?.chart
  const isAdmin = DASHBOARD_ICON_ACCESS.includes(key)
  const width = isAdmin ? 6 : 12

  return (
    <Auxiliary>
      <Row>
        <Col xl={width} lg={12} md={12} sm={12} xs={24}>
          <TotalCountCard
            isLink={loggedInUser?.role?.value === 'Admin' ? true : false}
            className="gx-bg-cyan-green-gradient"
            totalCount={ActiveUsers?.data?.data?.user || 0}
            label="Total Co-workers"
            onClick={
              loggedInUser?.role?.value !== 'Admin'
                ? null
                : () => navigate('/coworkers')
            }
          />
        </Col>

        {DASHBOARD_ICON_ACCESS.includes(key) && (
          <Col xl={width} lg={12} md={12} sm={12} xs={24}>
            <TotalCountCard
              isLink={loggedInUser?.role?.value === 'Admin' ? true : false}
              icon={LoginOutlined}
              className="gx-bg-pink-purple-corner-gradient"
              totalCount={AttendanceCount?.data?.attendance?.[0]?.count || 0}
              label="Co-workers Punched In Today"
              onClick={
                loggedInUser?.role?.value !== 'Admin'
                  ? null
                  : () => navigate('/todays-overview')
              }
            />
          </Col>
        )}
        {DASHBOARD_ICON_ACCESS.includes(key) && (
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <TotalCountCard
              isLink={loggedInUser?.role?.value === 'Admin' ? true : false}
              icon={ExceptionOutlined}
              className="gx-bg-pink-orange-corner-gradient"
              totalCount={PendingLeaves?.data?.data?.leaves || 0}
              label="Pending Leave Request"
              onClick={() =>
                navigate('/leave', {
                  state: {tabKey: '3', leaveStatus: 'pending'},
                })
              }
            />
          </Col>
        )}
        <Col xl={width} lg={12} md={12} sm={12} xs={24}>
          <TotalCountCard
            isLink={loggedInUser?.role?.value === 'Admin' ? true : false}
            totalCount={TodaysLeave?.data?.leaves?.[0]?.count || 0}
            label="Co-workers On Leave"
            icon={LogoutOutlined}
            onClick={
              loggedInUser?.role?.value !== 'Admin'
                ? null
                : () => navigate('/todays-overview')
            }
          />
        </Col>

        <Col xl={8} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-2">
          <Widget>
            <EventsAndAnnouncements
              announcements={notices?.data?.data?.notices}
              holidays={Holidays?.data?.data?.data?.[0]?.holidays}
              birthdays={BirthMonthUsers?.data?.data?.users}
              salaryReview={salaryReview?.data?.data?.users}
            />
          </Widget>
        </Col>

        <Col xl={16} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
          <Card className="gx-card dashboard-calendar" title="Calendar">
            {leavesQuery?.isLoading ? (
              <div className="gx-d-flex gx-justify-content-around">
                <Spin />
              </div>
            ) : (
              <div className="gx-rbc-calendar">
                <Calendar
                  components={components}
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  popup
                  eventPropGetter={handleEventStyle}
                  views={['month', 'week', 'day']}
                />
              </div>
            )}
          </Card>
          <AccessWrapper noAccessRoles={DASHBOARD_PROJECT_LOG_NO_ACCESS}>
            <Card className="gx-card" title="Project Time Log Report">
              <div className="gx-d-flex gx-justify-content-between gx-flex-row gx-mb-3">
                <Form layout="inline" onFinish={generateChart} form={form}>
                  <FormItem name="chart">
                    <Select
                      style={{width: innerWidth <= 504 ? '100%' : 115}}
                      value={chart}
                      onChange={(c: any) => setChart(c)}
                      placeholder="Select Chart"
                      options={[
                        {_id: '1', name: 'Bar Chart'},
                        {_id: '2', name: 'Pie Chart'},
                      ]?.map((x: {_id: string; name: string}) => ({
                        id: x._id,
                        value: x.name,
                      }))}
                    />
                  </FormItem>
                  <FormItem name="project" className="direct-form-item">
                    <Select
                      value={project}
                      onChange={(c: any) => setProject(c)}
                      placeholder="Select Project"
                      options={data?.data?.data?.data?.map(
                        (x: {_id: string; name: string}) => ({
                          id: x._id,
                          value: x.name,
                        })
                      )}
                      inputSelect
                    />
                  </FormItem>
                  <FormItem name="logType" className="direct-form-item">
                    <Select
                      value={logType}
                      onChange={(c: any) => setlogType(c)}
                      placeholder="Select Log Types"
                      mode="tags"
                      options={logTypes?.data?.data?.data?.map(
                        (x: {_id: string; name: string}) => ({
                          id: x._id,
                          value: x.name,
                        })
                      )}
                    />
                  </FormItem>
                  <FormItem>
                    <Button type="primary" key="submit" htmlType="submit">
                      Generate Chart
                    </Button>
                  </FormItem>
                </Form>
              </div>
              {project && (
                <div>
                  {chartData && chartData.length ? (
                    <div>
                      {chart === '2' ? (
                        <CustomActiveShapePieChart
                          data={chartData?.map((x: any) => ({
                            name: x.logType[0].name,
                            value: +x.timeSpent,
                          }))}
                        />
                      ) : (
                        <TinyBarChart
                          data={chartData?.map((x: any) => ({
                            name: x.logType[0].name,
                            time: x.timeSpent,
                          }))}
                        />
                      )}
                    </div>
                  ) : (
                    'No Data'
                  )}
                </div>
              )}
            </Card>
          </AccessWrapper>
        </Col>
      </Row>
    </Auxiliary>
  )
}

export default Dashboard
