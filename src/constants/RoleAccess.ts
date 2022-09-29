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

export default RoleAccess
