const RoleAccess = {
  Admin: 'admin',
  ProjectManager: 'manager',
  Editor: 'editor',
  Normal: 'normal',
  HumanResource: 'hr',
  Finance: 'finance',
  TeamLead: 'lead',
  Subscriber: 'subscriber',
  All: 'all',
}

// Dashboard
export const DASHBOARD_PROJECT_LOG_NO_ACCESS = [
  RoleAccess.HumanResource,
  RoleAccess.Finance,
  RoleAccess.Subscriber,
]

// Co-workers
export const CO_WORKERS_TABLE_ACTION_NO_ACCESS = [
  RoleAccess.ProjectManager,
  RoleAccess.Finance,
  RoleAccess.TeamLead,
]

export const CO_WORKERS_SEARCH_IMPORT_NO_ACCESS = [RoleAccess.Finance]

export const CO_WORKERS_RESET_ALLOCATEDLEAVES_NO_ACCESS = [
  RoleAccess.TeamLead,
  RoleAccess.ProjectManager,
]

// Projects
export const PROJECTS_ADD_NEW_NO_ACCESS = [RoleAccess.Normal]
export const PROJECTS_TABLE_ACTION_NO_ACCESS = [RoleAccess.Normal]
export const PROJECTS_TABLE_ACTION_DELETE_NO_ACCESS = [RoleAccess.Editor]

// Attendance
export const ATTENDANCE_ALL_TAB_NO_ACCESS = [
  RoleAccess.Editor,
  RoleAccess.Normal,
  RoleAccess.Subscriber,
]

export const ATTENDANCE_CO_WORKER_ATTENDANCE_ADD_NO_ACCESS = [
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
]
export const ATTENDANCE_LATE_ATTENDANCE_CUT_LEAVE_NO_ACCESS = [
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
]

// LogTime
export const LOG_TIME_ADD_NO_ACCESS = [RoleAccess.TeamLead]
export const LOG_TIME_DELETE_NO_ACCESS = [
  RoleAccess.TeamLead,
  RoleAccess.Editor,
  RoleAccess.Normal,
]

// Leaves
export const LEAVE_TABS_NO_ACCESS = [
  RoleAccess.TeamLead,
  RoleAccess.Editor,
  RoleAccess.Normal,
  RoleAccess.Subscriber,
]

export const LEAVES_TAB_ACTIONS_NO_ACCESS = [RoleAccess.ProjectManager]
export const LEAVE_TAB_ADD_LEAVE_NO_ACCESS = [RoleAccess.Finance]

export const LEAVE_TABLE_ACTION_NO_ACESS = [
  RoleAccess.ProjectManager,
  RoleAccess.Finance,
]

// Noticeboard
export const NOTICEBOARD_ACTION_NO_ACCESS = [
  RoleAccess.TeamLead,
  RoleAccess.Editor,
  RoleAccess.Normal,
  RoleAccess.Finance,
  RoleAccess.Subscriber,
]

// Blogs
export const BLOGS_ACTION_NO_ACCESS = [RoleAccess.Normal, RoleAccess.Subscriber]

// Reports
export const WEEKLY_REPORT_ACCESS = [RoleAccess.Admin]
export const WORK_LOG_REPORT_ACESS = [
  RoleAccess.Admin,
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
  RoleAccess.HumanResource,
]
export const LEAVE_REPORT_REPORT_ACESS = [
  RoleAccess.Admin,
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
  RoleAccess.HumanResource,
  RoleAccess.Finance,
]

// Resources
export const HOLIDAY_ACTION_NO_ACCESS = [
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
  RoleAccess.Editor,
  RoleAccess.Normal,
  RoleAccess.Finance,
  RoleAccess.Subscriber,
]

// Settings
export const SETTINGS_TABS_NO_ACCESS = [
  RoleAccess.ProjectManager,
  RoleAccess.TeamLead,
]
export default RoleAccess
