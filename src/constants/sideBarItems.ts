import {
  ACTIVITY_LOGS,
  ATTENDANCE,
  BLOG,
  COWORKERS,
  DASHBOARD,
  FAQS,
  HOLIDAY,
  LEAVE,
  LEAVE_REPORT,
  LOGTIME,
  NOTICEBOARD,
  OVERVIEW,
  POLICY,
  PROJECTS,
  REPORTS,
  RESOURCES,
  SETTINGS,
  WEEKLY_REPORT,
  WORK_LOG_REPORT,
} from '../helpers/routePath'
import sidebarItemsInterface from '../types/sideBar'

export const SIDEBAR_ITEMS = ({Navigation, Reports}:any) : sidebarItemsInterface[]=> [
  {
    icon: 'dasbhoard',
    name: 'sidebar.dashboard',
    url: DASHBOARD,
    isExpandable: false,
    id: 1,
    roles: Navigation.dashboard,
  },
  {
    icon: 'view-o',
    name: 'sidebar.overview',
    url: OVERVIEW,
    isExpandable: false,
    id: 12,
    roles: Navigation?.todaysOverview
  },
  {
    icon: 'contacts',
    name: 'sidebar.coworkers',
    url: COWORKERS,
    isExpandable: false,
    id: 2,
    roles: Navigation?.coWorkers
  },
  {
    icon: 'folder-o',
    name: 'sidebar.projects',
    url: PROJECTS,
    isExpandable: false,
    id: 3,
    roles:Navigation?.projects
  },
  {
    icon: 'select',
    name: 'sidebar.attendance',
    url: ATTENDANCE,
    isExpandable: false,
    id: 4,
    roles: true,
  },
  {
    icon: 'ckeditor',
    name: 'sidebar.logtime',
    url: LOGTIME,
    isExpandable: false,
    id: 5,
    roles: Navigation?.logTime
  },
  {
    icon: 'hotel-booking',
    name: 'sidebar.leavemanagement',
    url: LEAVE,
    isExpandable: false,
    id: 6,
    roles: true,
  },
  {
    icon: 'calendar-new',
    name: 'sidebar.noticeboard',
    url: NOTICEBOARD,
    isExpandable: false,
    id: 7,
    roles: true,
  },
  {
    icon: 'chat-new',
    name: 'sidebar.blog',
    url: BLOG,
    isExpandable: false,
    id: 8,
    roles: Navigation?.blog
  },
  {
    icon: 'chart-line',
    name: 'sidebar.reports',
    url: REPORTS,
    isExpandable: true,
    id: 9,
    roles: Navigation?.reports,
    subItems: [
      {
        name: 'sidebar.reports.weeklyreport',
        url: WEEKLY_REPORT,
        id: 1,
        roles: Reports?.viewWeeklyReport,
      },
      {
        name: 'sidebar.reports.worklogreport',
        url: WORK_LOG_REPORT,
        id: 2,
        roles: Reports?.viewWorkLogReport,
      },
      {
        name: 'sidebar.reports.leavereport',
        url: LEAVE_REPORT,
        id: 3,
        roles: Reports?.viewLeaveReport,
      },
      {
        name: 'sidebar.reports.activitylogs',
        url: ACTIVITY_LOGS,
        id: 4,
        roles: Reports?.viewActivityLog,
      },
    ],
  },
  {
    icon: 'editor',
    name: 'sidebar.resources',
    url: RESOURCES,
    isExpandable: true,
    id: 10,
    roles: true,
    subItems: [
      {
        name: 'sidebar.resources.faq',
        url: FAQS,
        id: 1,
      },
      {
        name: 'sidebar.resources.policy',
        url: POLICY,
        id: 2,
      },
      {
        name: 'sidebar.resources.holiday',
        url: HOLIDAY,
        id: 3,
      },
      {
        name: 'sidebar.resources.ir',
        url: 'ir',
        id: 4,
      },
    ],
  },
  {
    icon: 'setting',
    name: 'sidebar.settings',
    url: SETTINGS,
    isExpandable: false,
    id: 11,
    roles: Navigation?.settings
  },
]
