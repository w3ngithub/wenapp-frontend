import {
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
import RoleAccess, {
  LEAVE_REPORT_REPORT_ACESS,
  WEEKLY_REPORT_ACCESS,
  WORK_LOG_REPORT_ACESS,
} from './RoleAccess'

export const SIDEBAR_ITEMS: sidebarItemsInterface[] = [
  {
    icon: 'dasbhoard',
    name: 'sidebar.dashboard',
    url: DASHBOARD,
    isExpandable: false,
    id: 1,
    roles: [RoleAccess.All],
  },
  {
    icon: 'view-o',
    name: 'sidebar.overview',
    url: OVERVIEW,
    isExpandable: false,
    id: 12,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.HumanResource,
    ],
  },
  {
    icon: 'contacts',
    name: 'sidebar.coworkers',
    url: COWORKERS,
    isExpandable: false,
    id: 2,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.HumanResource,
      RoleAccess.Finance,
    ],
  },
  {
    icon: 'folder-o',
    name: 'sidebar.projects',
    url: PROJECTS,
    isExpandable: false,
    id: 3,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.Finance,
      RoleAccess.Editor,
      RoleAccess.Normal,
    ],
  },
  {
    icon: 'select',
    name: 'sidebar.attendance',
    url: ATTENDANCE,
    isExpandable: false,
    id: 4,
    roles: [RoleAccess.All],
  },
  {
    icon: 'ckeditor',
    name: 'sidebar.logtime',
    url: LOGTIME,
    isExpandable: false,
    id: 5,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.Editor,
      RoleAccess.Normal,
    ],
  },
  {
    icon: 'hotel-booking',
    name: 'sidebar.leavemanagement',
    url: LEAVE,
    isExpandable: false,
    id: 6,
    roles: [RoleAccess.All],
  },
  {
    icon: 'calendar-new',
    name: 'sidebar.noticeboard',
    url: NOTICEBOARD,
    isExpandable: false,
    id: 7,
    roles: [RoleAccess.All],
  },
  {
    icon: 'chat-new',
    name: 'sidebar.blog',
    url: BLOG,
    isExpandable: false,
    id: 8,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.HumanResource,
      RoleAccess.Editor,
      RoleAccess.Normal,
      RoleAccess.Subscriber,
    ],
  },
  {
    icon: 'chart-line',
    name: 'sidebar.reports',
    url: REPORTS,
    isExpandable: true,
    id: 9,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.HumanResource,
      RoleAccess.Finance,
    ],
    subItems: [
      {
        name: 'sidebar.reports.weeklyreport',
        url: WEEKLY_REPORT,
        id: 1,
        roles: WEEKLY_REPORT_ACCESS,
      },
      {
        name: 'sidebar.reports.worklogreport',
        url: WORK_LOG_REPORT,
        id: 2,
        roles: WORK_LOG_REPORT_ACESS,
      },
      {
        name: 'sidebar.reports.leavereport',
        url: LEAVE_REPORT,
        id: 3,
        roles: LEAVE_REPORT_REPORT_ACESS,
      },
    ],
  },
  {
    icon: 'editor',
    name: 'sidebar.resources',
    url: RESOURCES,
    isExpandable: true,
    id: 10,
    roles: [RoleAccess.All],
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
    ],
  },
  {
    icon: 'setting',
    name: 'sidebar.settings',
    url: SETTINGS,
    isExpandable: false,
    id: 11,
    roles: [
      RoleAccess.Admin,
      RoleAccess.ProjectManager,
      RoleAccess.TeamLead,
      RoleAccess.HumanResource,
    ],
  },
]
