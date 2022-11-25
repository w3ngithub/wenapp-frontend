import React, {useEffect, lazy, Suspense} from 'react'
import {connect} from 'react-redux'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import {ConfigProvider} from 'antd'
import moment from 'moment'
import 'moment/locale/en-gb'
import {IntlProvider} from 'react-intl'
import AppLocale from 'lngProvider'
import MainApp from './MainApp'
import SignIn from 'containers/SignIn'
import SignUp from 'containers/SignUp'

import {
  ADDBLOG,
  ATTENDANCE,
  BLOG,
  BLOGDETAIL,
  BLOGS,
  COWORKERS,
  DASHBOARD,
  EDITBLOG,
  FAQS,
  FORGOT_PASSWORD,
  HOLIDAY,
  INVITE,
  LEAVE,
  LEAVE_REPORT,
  LOGTIME,
  NOTICEBOARD,
  OVERVIEW,
  POLICY,
  PROFILE,
  PROJECTS,
  PROJECT_LOG,
  REPORTS,
  RESET_PASSWORD,
  RESOURCES,
  SETTINGS,
  SIGNIN,
  SIGNUP,
  WEEKLY_REPORT,
  WORK_LOG_REPORT,
} from 'helpers/routePath'
import {ProtectedRoute} from 'components/Elements/ProtectedRoute'
import Profile from 'pages/Profile'
import InviteUserSignup from 'pages/InviteUserSignup'
import WeeklyReport from 'pages/Reports/WeeklyReport'
import WorkLogReport from 'pages/Reports/WorkLogReport'
import LeaveReport from 'pages/Reports/LeaveReport'
import Faqs from 'pages/Resources/Faqs'
import Policy from 'pages/Resources/Policy'
import Holiday from 'pages/Resources/Holiday'
import Blogs from 'pages/Blog/Blogs'
import BlogDetail from 'pages/Blog/BlogDetail'
import AddBlog from 'pages/Blog/AddBlog'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import ForgotPassword from 'containers/ForgotPassword'
import ResetPassword from 'containers/ResetPassword'
import CircularProgress from 'components/Elements/CircularProgress'
import AccessRoute from 'components/Hoc/AccessRoute'
import RoleAccess, {
  LEAVE_REPORT_REPORT_ACESS,
  WEEKLY_REPORT_ACCESS,
  WORK_LOG_REPORT_ACESS,
} from 'constants/RoleAccess'
import Error404 from 'components/Modules/404'

const Dashboard = lazy(() => import('pages/Dashboard'))
const Overview = lazy(() => import('pages/Overview'))
const Coworkers = lazy(() => import('pages/Coworkers'))
const Projects = lazy(() => import('pages/Projects'))
const Attendace = lazy(() => import('pages/Attendance'))
const LogTime = lazy(() => import('pages/LogTime'))
const Leave = lazy(() => import('pages/Leave'))
const Noticeboard = lazy(() => import('pages/Noticeboard'))
const Blog = lazy(() => import('pages/Blog'))
const Reports = lazy(() => import('pages/Reports'))
const Resources = lazy(() => import('pages/Resources'))
const Settings = lazy(() => import('pages/Settings'))
const ProjectLogs = lazy(() => import('pages/ProjectLogs'))

moment.locale('en-gb')

function App(props: any) {
  const {locale, authUser, themeType, switchingUser} = props

  const currentAppLocale = AppLocale[locale.locale]
  const navigate = useNavigate()

  useEffect(() => {
    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add('dark-theme')
    } else if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme')
    }
  }, [themeType])

  useEffect(() => {
    if (
      Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] !==
        'Katmandu' &&
      Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] !==
        'Kathmandu'
    )
      navigate('notAllowed')
  }, [])

  if (switchingUser) return <FallBack />

  return (
    <ConfigProvider locale={currentAppLocale.antd}>
      {/* <ConfigProvider locale={en_GB}> */}
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Routes>
          <Route path="/" element={<Navigate to={DASHBOARD} />} />
          <Route path={SIGNIN} element={<SignIn />} />
          <Route path={SIGNUP} element={<SignUp />} />
          <Route path={INVITE} element={<InviteUserSignup />} />
          <Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={RESET_PASSWORD} element={<ResetPassword />} />

          <Route element={<ProtectedRoute auth={authUser} />}>
            <Route element={<MainApp />}>
              <Route
                path={DASHBOARD}
                element={
                  <Suspense fallback={<FallBack />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path={OVERVIEW}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.HumanResource,
                      ]}
                    >
                      <Overview />
                    </AccessRoute>
                  </Suspense>
                }
              />
              <Route
                path={COWORKERS}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.HumanResource,
                        RoleAccess.Finance,
                      ]}
                    >
                      <Coworkers />
                    </AccessRoute>
                  </Suspense>
                }
              />
              <Route
                path={PROJECTS}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.Editor,
                        RoleAccess.Normal,
                      ]}
                    >
                      <Projects />
                    </AccessRoute>
                  </Suspense>
                }
              ></Route>
              <Route
                path={ATTENDANCE}
                element={
                  <Suspense fallback={<FallBack />}>
                    <Attendace />
                  </Suspense>
                }
              />
              <Route
                path={LOGTIME}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.Editor,
                        RoleAccess.Normal,
                      ]}
                    >
                      <LogTime />
                    </AccessRoute>
                  </Suspense>
                }
              />
              <Route
                path={LEAVE}
                element={
                  <Suspense fallback={<FallBack />}>
                    <Leave />
                  </Suspense>
                }
              />
              <Route
                path={NOTICEBOARD}
                element={
                  <Suspense fallback={<FallBack />}>
                    <Noticeboard />
                  </Suspense>
                }
              />
              <Route
                path={BLOG}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.HumanResource,
                        RoleAccess.Editor,
                        RoleAccess.Normal,
                        RoleAccess.Subscriber,
                      ]}
                    >
                      <Blog />
                    </AccessRoute>
                  </Suspense>
                }
              >
                <Route path={BLOGS} element={<Blogs />} />
                <Route path={ADDBLOG} element={<AddBlog />} />
                <Route path={EDITBLOG} element={<AddBlog />} />
                <Route path={BLOGDETAIL} element={<BlogDetail />} />
              </Route>
              <Route
                path={REPORTS}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.HumanResource,
                        RoleAccess.Finance,
                      ]}
                    >
                      <Reports />
                    </AccessRoute>
                  </Suspense>
                }
              >
                <Route
                  path={WEEKLY_REPORT}
                  element={
                    <AccessRoute roles={WEEKLY_REPORT_ACCESS}>
                      <WeeklyReport />
                    </AccessRoute>
                  }
                />
                <Route
                  path={WORK_LOG_REPORT}
                  element={
                    <AccessRoute roles={WORK_LOG_REPORT_ACESS}>
                      <WorkLogReport />
                    </AccessRoute>
                  }
                />
                <Route
                  path={LEAVE_REPORT}
                  element={
                    <AccessRoute roles={LEAVE_REPORT_REPORT_ACESS}>
                      <LeaveReport />
                    </AccessRoute>
                  }
                />
              </Route>
              <Route
                path={RESOURCES}
                element={
                  <Suspense fallback={<FallBack />}>
                    <Resources />
                  </Suspense>
                }
              >
                <Route path={FAQS} element={<Faqs />} />
                <Route path={POLICY} element={<Policy />} />
                <Route path={HOLIDAY} element={<Holiday />} />
              </Route>
              <Route
                path={SETTINGS}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.HumanResource,
                      ]}
                    >
                      <Settings />
                    </AccessRoute>
                  </Suspense>
                }
              />
              <Route
                path={PROJECT_LOG}
                element={
                  <Suspense fallback={<FallBack />}>
                    <AccessRoute
                      roles={[
                        RoleAccess.Admin,
                        RoleAccess.ProjectManager,
                        RoleAccess.TeamLead,
                        RoleAccess.Editor,
                        RoleAccess.Normal,
                      ]}
                    >
                      <ProjectLogs />
                    </AccessRoute>
                  </Suspense>
                }
              />
              <Route path={PROFILE} element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Error404 />} />
          <Route
            path="notAllowed"
            element={<Error404 message="You are not allowed!" />}
          />
        </Routes>
      </IntlProvider>
    </ConfigProvider>
  )
}

const FallBack = () => <CircularProgress className="" />

const mapStateToProps = ({settings, auth}: {settings: any; auth: any}) => {
  const {locale, themeType} = settings
  const {authUser, switchingUser} = auth
  return {locale, authUser, themeType, switchingUser}
}
export default connect(mapStateToProps)(App)
