import React, {useEffect, useState, useCallback} from 'react'
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
import {MuiFormatDate, oneWeekFilterCheck} from 'helpers/utils'
import {getWeeklyNotices} from 'services/noticeboard'
import {getAllHolidays} from 'services/resources'
import {
  getActiveUsersCount,
  getBirthMonthUsers,
} from 'services/users/userDetails'
import {getTodaysUserAttendanceCount} from 'services/attendances'
import {useNavigate} from 'react-router-dom'
import useWindowsSize from 'hooks/useWindowsSize'
import {useSelector} from 'react-redux'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {DASHBOARD_ICON_ACCESS} from 'constants/RoleAccess'
import {FIRST_HALF, LEAVES_TYPES, SECOND_HALF} from 'constants/Leaves'
import {debounce} from 'helpers/utils'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {notification} from 'helpers/notification'
import {socket} from 'pages/Main'
import {useCleanCalendar} from 'hooks/useCleanCalendar'
import {F10PX, F11PX} from 'constants/FontSizes'
const FormItem = Form.Item

const localizer = momentLocalizer(moment)

const Dashboard = () => {
  const {
    role: {
      key = '',
      permission: {Dashboard: NavigationDashboard = {}} = {},
    } = {},
  } = useSelector(selectAuthUser)

  const [chart, setChart] = useState('1')
  const [project, setProject] = useState('')
  const [logType, setlogType] = useState('')
  const [socketPendingLeaveCount, setSocketPendingLeaveCount] = useState(0)
  const [socketApprovedLeaveCount, setSocketApprovedLeaveCount] = useState(0)

  const [projectArray, setProjectArray] = useState([])
  const [chartData, setChartData] = useState([])
  const navigate = useNavigate()
  const {innerWidth} = useWindowsSize()
  const [form] = Form.useForm()
  const {monthChangeHandler} = useCleanCalendar()

  useEffect(() => {
    socket.on('pending-leave-count', (response: number) => {
      setSocketPendingLeaveCount(response)
    })
    socket.on(
      'today-leave-count',
      (approvedCount: number, pendingCount: number) => {
        setSocketApprovedLeaveCount(approvedCount)
        setSocketPendingLeaveCount(pendingCount)
      }
    )
  }, [])

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

  const fetchChartQuery = useCallback(async (project: any, logType: any) => {
    try {
      const response = await getTimeLogChart({project, logType})

      if (response?.status) {
        setChartData(response?.data?.data?.chart || [])
      } else {
        notification({type: 'error', message: 'Failed to generate chart !'})
      }
    } catch (error) {
      notification({type: 'error', message: 'Failed to generate chart !'})
    }
  }, [])

  const handleSearch = async (projectName: any) => {
    if (!projectName) {
      setProjectArray([])
      return
    } else {
      const projects = await getAllProjects({
        project: projectName,
        sort: 'name',
      })
      setProjectArray(projects?.data?.data?.data)
    }
    //else fetch projects from api
  }

  const optimizedFn = useCallback(debounce(handleSearch, 100), [])

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
          const isLeaveBereavement =
            leave?.leaveType[0].toLowerCase() === LEAVES_TYPES.Bereavement
          const weeksLastDate = new Date(
            MuiFormatDate(new Date().setDate(new Date().getDate() + 7))
          )
          const todayDate = new Date(MuiFormatDate(new Date()))

          if (
            isLeavePaternity ||
            isLeaveMaternity ||
            isLeavePTO ||
            isLeaveBereavement
          ) {
            const startLeaveDate = new Date(leave?.leaveDates[0])
            const endLeaveDate = new Date(leave?.leaveDates[1])
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
            leave?.leaveDates.forEach((date: string) => {
              const leaveDate = new Date(date)
              if (leaveDate >= todayDate && leaveDate <= weeksLastDate)
                updateLeaves = [
                  ...updateLeaves,
                  {...leave, date: date, leaveDates: date},
                ]
            })
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
    if (NavigationDashboard?.viewProjectTimeLogReport) {
      Promise.all([logTypeRefetch(), projectRefetch()])
    }
  }, [
    NavigationDashboard?.viewProjectTimeLogReport,
    logTypeRefetch,
    projectRefetch,
  ])

  const calCulateWidth = (roles: any) => {
    const roleArray = [
      roles?.viewCoworkersOnLeave,
      roles?.viewCoworkersPunhedInToday,
      roles?.viewTotalCoworkers,
      roles?.viewPendingLeaveRequest,
    ]
    let count = roleArray?.filter((d) => d === true)?.length
    return 24 / count
  }

  const generateChart = (values: any) => {
    if (project === '' || project === undefined) return
    fetchChartQuery(project, logType)
  }
  const handleEventStyle = (event: any) => {
    let eventCopy = {...event}

    let style: any = {
      fontSize: innerWidth <= 1500 ? F10PX : F11PX,
      width:
        event.type === 'notice'
          ? '100%'
          : innerWidth <= 729
          ? '2.5rem'
          : 'fit-content',
      margin: '0px auto',
      fontWeight: '600',
      height: 'fit-content',
      background: event.type === 'notice' ? '#EAEBEF' : 'transparent',
    }
    if (eventCopy.type === 'birthday')
      style = {
        ...style,
        fontWeight: '400',
        marginTop: '-4px',
        marginBottom: '3px',
        marginLeft: '11px',
        color: 'rgb(239 138 222)',
      }
    if (eventCopy.type === 'holiday')
      style = {
        ...style,
        fontWeight: '400',
        marginTop: '-4px',
        marginBottom: '3px',
        marginLeft: '11px',
        color: 'rgb(193 98 98)',
      }
    if (eventCopy.type === 'leave') {
      style = {
        ...style,
        fontWeight: '400',
        marginTop: '-4px',
        marginBottom: '3px',
        marginLeft: '11px',
        color: eventCopy?.leaveType === 'Late Arrival' ? '#eb9293' : '#3DBF4D',
      }
    }
    if (eventCopy.type === 'notice') {
      style = {
        ...style,
        width: 'calc(100% - 30px)',
        fontWeight: '500',
        background: '#EAEBEF',
        color: '#545454',
        borderRadius: '10px',
        marginBottom: '6px',
      }
    }

    return {
      style,
    }
  }

  const CustomEvent = (props: any) => {
    const nameSplitted = props?.event?.title.split(' ')
    let lastName
    if (nameSplitted.length === 1) lastName = ''
    else lastName = `${nameSplitted.pop().substring(0, 1)}. `
    const shortName = `${nameSplitted.join(' ')} ${lastName ? lastName : ''}`

    const style = {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      margin: '0 !important',
      fontSize: F11PX,
    }

    if (props.event.type === 'birthday') {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'left',
          }}
        >
          <p
            style={{
              ...style,
              margin: 0,
              flexWrap: 'wrap',
              fontWeight: '500',
              gap: '6px',
            }}
          >
            <i
              className="icon icon-birthday-new gx-fs-sm "
              style={{width: '12px', lineHeight: 2}}
            />
            <span className="gx-mt--3p">{shortName}</span>
          </p>
        </div>
      )
    }
    if (props.event.type === 'holiday')
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'left',
          }}
        >
          <p
            style={{
              ...style,
              margin: 0,
              flexWrap: 'wrap',
              fontWeight: '500',
              gap: '6px',
            }}
          >
            <i
              className="icon icon-calendar gx-fs-sm"
              style={{width: '12px', lineHeight: 2, marginLeft: '2px'}}
            />
            <span>{props?.event?.title}</span>
          </p>
        </div>
      )

    if (props.event.type === 'leave') {
      let extraInfo = ''
      if (props.event.leaveType === 'Late Arrival') {
        extraInfo = 'Late'
      } else if (
        props?.event?.leaveType === 'Maternity' ||
        props?.event?.leaveType === 'Paternity' ||
        props?.event?.leaveType === 'Paid Time' ||
        props?.event?.halfDay === ''
      ) {
        extraInfo = ''
      } else {
        if (props?.event?.halfDay === FIRST_HALF) {
          extraInfo = '1st'
        }
        if (props?.event?.halfDay === SECOND_HALF) {
          extraInfo = '2nd'
        }
      }
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            // height: '10px',
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
          <p
            style={{
              ...style,
              margin: 0,
              fontWeight: '500',
              fontSize: F11PX,
            }}
          >
            <LeaveIcon
              width="15px"
              fill={extraInfo === 'Late' ? '#eb9293' : '#3DBF4D'}
            />
            <span className="gx-mt-1p" style={{width: '80px'}}>{`${shortName}${
              extraInfo ? '(' + extraInfo + ')' : ''
            }`}</span>
          </p>
        </div>
      )
    }

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

  let noticesCalendar = notices?.data?.data?.notices?.map((notice: any) => {
    return {
      title: notice?.noticeType?.name,
      end: notice.endDate
        ? new Date(notice?.endDate)
        : new Date(notice?.startDate),
      start: new Date(notice.startDate),
      type: 'notice',
      name: notice?.title,
    }
  })

  const holidaysCalendar = Holidays?.data?.data?.data?.[0]?.holidays
    ?.filter(oneWeekFilterCheck)
    ?.map((x: any) => ({
      title: x.title,
      start: new Date(x.date),
      end: new Date(x.date),
      type: 'holiday',
    }))

  const BirthDayCalendar = BirthMonthUsers?.data?.data?.users
    ?.sort(function (a: any, b: any) {
      return a?.name < b?.name ? -1 : 1
    })
    ?.map((x: any) => ({
      title: x.name,
      start: new Date(
        `${new Date(x?.dob).getFullYear()}/${
          new Date(x.dob).getMonth() + 1
        }/${new Date(x.dob).getDate()}`
      ),
      end: new Date(
        `${new Date(x?.dob).getFullYear()}/${
          new Date(x.dob).getMonth() + 1
        }/${new Date(x.dob).getDate()}`
      ),
      type: 'birthday',
    }))
  const calendarEvents = [
    ...(holidaysCalendar || []),
    ...(noticesCalendar || []),
    ...(BirthDayCalendar || []),
    ...(leaveUsers || []),
  ]

  const isAdmin = DASHBOARD_ICON_ACCESS.includes(key)

  return (
    <Auxiliary>
      <Row>
        {NavigationDashboard?.viewTotalCoworkers && (
          <Col
            xl={calCulateWidth(NavigationDashboard)}
            lg={12}
            md={12}
            sm={12}
            xs={24}
          >
            <TotalCountCard
              isLink={NavigationDashboard?.makeclicakbleTotalCoworkers}
              className="gx-bg-cyan-green-gradient"
              totalCount={ActiveUsers?.data?.data?.user || 0}
              label="Total Co-workers"
              onClick={
                !NavigationDashboard?.makeclicakbleTotalCoworkers
                  ? null
                  : () => navigate('/coworkers')
              }
            />
          </Col>
        )}

        {NavigationDashboard?.viewCoworkersPunhedInToday && (
          <Col
            xl={calCulateWidth(NavigationDashboard)}
            lg={12}
            md={12}
            sm={12}
            xs={24}
          >
            <TotalCountCard
              isLink={NavigationDashboard?.makeclickableCoworkersPunchIn}
              icon={LoginOutlined}
              className="gx-bg-pink-purple-corner-gradient"
              totalCount={AttendanceCount?.data?.attendance?.[0]?.count || 0}
              label="Co-workers Punched In Today"
              onClick={
                !NavigationDashboard?.makeclickableCoworkersPunchIn
                  ? null
                  : () => navigate('/todays-overview', {state: true})
              }
            />
          </Col>
        )}
        {NavigationDashboard?.viewPendingLeaveRequest && (
          <Col
            xl={calCulateWidth(NavigationDashboard)}
            lg={12}
            md={12}
            sm={12}
            xs={24}
          >
            <TotalCountCard
              isLink={NavigationDashboard?.makeclickableLeavePendingRequest}
              icon={ExceptionOutlined}
              className="gx-bg-pink-orange-corner-gradient"
              totalCount={
                socketPendingLeaveCount === 0 || !socketPendingLeaveCount
                  ? PendingLeaves?.data?.data?.leaves || 0
                  : socketPendingLeaveCount
              }
              label="Pending Leave Request"
              onClick={() =>
                !NavigationDashboard?.makeclickableLeavePendingRequest
                  ? null
                  : navigate('/leave', {
                      state: {tabKey: '3', leaveStatus: 'pending'},
                    })
              }
            />
          </Col>
        )}
        {NavigationDashboard?.viewCoworkersOnLeave && (
          <Col
            xl={calCulateWidth(NavigationDashboard)}
            lg={12}
            md={12}
            sm={12}
            xs={24}
          >
            <TotalCountCard
              isLink={NavigationDashboard?.makeclickableCoworkersOnLeave}
              totalCount={
                socketApprovedLeaveCount === 0 || !socketApprovedLeaveCount
                  ? TodaysLeave?.data?.leaves?.[0]?.count || 0
                  : socketApprovedLeaveCount
              }
              label="Co-workers On Leave"
              icon={LogoutOutlined}
              onClick={
                !NavigationDashboard?.makeclickableCoworkersOnLeave
                  ? null
                  : () => navigate('/todays-overview')
              }
            />
          </Col>
        )}

        {(NavigationDashboard?.viewSalaryReview ||
          NavigationDashboard?.viewAnnouncement ||
          NavigationDashboard?.viewHolidays ||
          NavigationDashboard?.viewBirthdays) && (
          <Col
            xl={6}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            className={`gx-order-lg-2 ${
              innerWidth > 1204 && 'announcement-card'
            }`}
          >
            <Widget>
              <EventsAndAnnouncements
                announcements={notices?.data?.data?.notices}
                holidays={Holidays?.data?.data?.data?.[0]?.holidays}
                birthdays={BirthMonthUsers?.data?.data?.users}
              />
            </Widget>
          </Col>
        )}

        <Col xl={18} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
          {NavigationDashboard?.viewCalendar && (
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
                    onNavigate={monthChangeHandler}
                  />
                </div>
              )}
            </Card>
          )}
          <AccessWrapper role={NavigationDashboard?.viewProjectTimeLogReport}>
            <Card className="gx-card" title="Project Time Log Report">
              <div className="gx-d-flex gx-justify-content-between gx-flex-row gx-mb-3">
                <Form layout="inline" onFinish={generateChart} form={form}>
                  <FormItem name="chart">
                    <Select
                      style={{width: innerWidth <= 504 ? '100%' : 115}}
                      value={chart}
                      onChange={(c: any) => setChart(c)}
                      placeholder="Select Chart"
                      initialValues="Bar Chart"
                      options={[
                        {_id: '1', name: 'Bar Chart'},
                        {_id: '2', name: 'Pie Chart'},
                      ]?.map((x: {_id: string; name: string}) => ({
                        id: x._id,
                        value: x.name,
                      }))}
                    />
                  </FormItem>
                  <FormItem
                    name="project"
                    className="direct-form-project"
                    required
                    rules={[
                      {
                        required: true,
                        validator: async (rule, value) => {
                          try {
                            if (!value) {
                              throw new Error('Project is required.')
                            }
                            if (value?.trim() === '') {
                              throw new Error(
                                'Please enter a valid project name.'
                              )
                            }
                          } catch (err) {
                            throw new Error(err.message)
                          }
                        },
                      },
                    ]}
                  >
                    <Select
                      showSearchIcon={true}
                      value={project}
                      onChange={(c: any) => setProject(c)}
                      handleSearch={optimizedFn}
                      placeholder="Search Project"
                      options={(projectArray || [])?.map(
                        (x: {_id: string; name: string}) => ({
                          id: x._id,
                          value: x.name,
                        })
                      )}
                      inputSelect
                    />
                  </FormItem>
                  <FormItem name="logType" className="direct-form-project">
                    <Select
                      value={logType}
                      onChange={(c: any) => setlogType(c)}
                      placeholder="Select Log Types"
                      mode="multiple"
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
                          data={chartData?.map((x: any) => {
                            return {
                              name: x.logType[0].name,
                              color: x.logType[0].color,
                              value: +x.timeSpent?.toFixed(2),
                            }
                          })}
                        />
                      ) : (
                        <TinyBarChart
                          data={chartData?.map((x: any) => ({
                            name: x.logType[0].name,
                            color: x.logType[0].color,
                            time: +x.timeSpent?.toFixed(2),
                          }))}
                        />
                      )}
                    </div>
                  ) : chartData === undefined ? (
                    ''
                  ) : chartData.length === 0 ? (
                    'No Results Found.'
                  ) : (
                    ''
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
