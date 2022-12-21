export const permissionRole = {
  Navigation: [
    {name: 'dashboard', label: 'Dashboard', rule: []},
    {name: `leaveManagement`, label: `Leave Management`, rule: []},
    {name: 'todaysOverview', label: `Today's Overview`, rule: []},
    {name: `noticeBoard`, label: `Notice Board`, rule: []},
    {name: 'coWorkers', label: `Co-Workers`, rule: []},
    {name: `blog`, label: `Blog `, rule: []},
    {name: `projects`, label: `Projects `, rule: []},
    {name: 'reports', label: `Reports`, rule: []},
    {name: `attendance`, label: `Attendance `, rule: []},
    {name: `resources`, label: `Resources `, rule: []},
    {name: 'logTime', label: `Log Time`, rule: []},
    {name: `settings`, label: `Settings `, rule: []},
  ],
  Dashboard: [
    {name: 'viewCalendar', label: 'View Calendar', rule: []},
    {
      name: `viewProjectTimeLogReport`,
      label: `View Project Time Log Report`,
      rule: [],
    },
    {name: 'viewTotalCoworkers', label: `View Total Co-workers`, rule: []},
    {name: `viewAnnouncement`, label: `View Announcement `, rule: []},
    {
      name: 'viewCoworkersPunhedInToday',
      label: `View Co-workers Punhed In Today`,
      rule: [],
    },
    {name: `viewHolidays`, label: `View Holidays `, rule: []},
    {
      name: `viewPendingLeaveRequest`,
      label: `View Pending Leave Request `,
      rule: [],
    },
    {name: 'viewSalaryReview', label: `View Salary Review`, rule: []},
    {
      name: `viewCoworkersOnLeave`,
      label: `View Co-workers On Leave `,
      rule: [],
    },
    {name: `viewBirthdays`, label: `View Birthdays `, rule: []},
    {name: 'viewRecentActivities', label: `View Recent Activities`, rule: []},
    {
      name: `enableMaintenanceMode`,
      label: `Enable Maintenance Mode `,
      rule: [],
    },
    {
      name: `makeclicakbleTotalCoworkers`,
      label: `Make Clickable Total Co-workers`,
      rule: [],
    },
    {
      name: `makeclickableCoworkersPunchIn`,
      label: `Make Clickable Co-workers Punch In`,
      rule: [],
    },
    {
      name: `makeclickableLeavePendingRequest`,
      label: `Make Clickable Leave Pending Request `,
      rule: [],
    },
    {
      name: `makeclickableCoworkersOnLeave`,
      label: `Make Clickable Co-workers On Leave `,
      rule: [],
    },
  ],
  'Co-Workers': [
    {name: 'viewCoworkers', label: 'View Co-workers', rule: []},
    {name: `exportCoworkers`, label: `Export Co-workers`, rule: []},
    {name: 'editCoworkers', label: `Edit Co-workers`, rule: []},
    {name: `importCoworkers`, label: `Import Co-workers `, rule: []},
    {name: 'disableCoworkers', label: `Disable Co-Workers`, rule: []},
    {name: `resetAllocatedLeaves`, label: `Reset Allocated Leaves `, rule: []},
    {name: `switchCoworkers`, label: `Switch Co-workers `, rule: []},
  ],
  Projects: [
    {name: 'createProjects', label: 'Create Projects', rule: []},
    {name: 'editProjects', label: 'Edit Projects', rule: []},
    {name: 'viewProjects', label: 'View Projects', rule: []},
    {name: 'deleteProjects', label: 'Delete Projects', rule: []},
  ],
  Attendance: [
    {name: 'createMyAttendance', label: 'Create My Attendance', rule: []},
    {
      name: 'editCoworkersAttendance',
      label: 'Edit Co-workers Attendance',
      rule: [],
    },
    {name: 'viewMyAttendance', label: 'View My Attendance', rule: []},
    {
      name: 'exportCoworkersAttendance',
      label: 'Export Co-workers Attendance',
      rule: [],
    },
    {
      name: 'viewMyAttendanceCalendar',
      label: 'View My Attendance Calendar',
      rule: [],
    },
    {
      name: 'viewCoworkersLateAttendance',
      label: 'View Co-workers Late Attendance',
      rule: [],
    },
    {
      name: 'viewCoworkersAttendance',
      label: 'View Co-workers Attendance',
      rule: [],
    },
    {name: 'cutLateArrivalLeave', label: 'Cut Late Arrival Leave', rule: []},
    {
      name: 'addCoworkersAttendance',
      label: 'Add Co-workers Attendance',
      rule: [],
    },
    {
      name: 'viewCoworkersAttendanceCalendar',
      label: 'View Co-workers Attendance Calendar',
      rule: [],
    },
  ],
  'Log Time': [
    {name: 'createLogTime', label: 'Create Log Time', rule: []},
    {name: 'editLogTime', label: 'Edit Log Time', rule: []},
    {name: 'viewLogTime', label: 'View Log Time', rule: []},
    {name: 'deleteLogTime', label: 'Delete Log Time', rule: []},
  ],

  'Leave Management': [
    {name: 'applyLeave', label: 'Apply Leave', rule: []},
    {name: 'viewCoworkersLeaves', label: 'View Co-workers Leaves', rule: []},
    {name: 'viewMyHistory', label: 'View My History', rule: []},
    {
      name: 'approveCoworkersLeaves',
      label: 'Approve Co-workers Leaves',
      rule: [],
    },
    {name: 'viewMyLeaveDetails', label: 'View My Leave Details', rule: []},
    {
      name: 'cancelCoworkersLeaves',
      label: 'Cancel Co-workers Leaves',
      rule: [],
    },
    {name: 'cancelMyLeaves', label: 'Cancel My Leaves', rule: []},
    {
      name: 'exportCoworkersLeaves',
      label: 'Export Co-workers Leaves',
      rule: [],
    },
    {name: 'viewLeaves', label: 'View Leaves', rule: []},
    {name: 'viewLeavesCalendar', label: 'View Leaves Calendar', rule: []},
    {name: 'addCoworkersLeaves', label: 'Add Co=workers Leaves', rule: []},
    {
      name: 'showQuarterlyLeaveDetails',
      label: 'Show Quarterly Leave Details',
      rule: [],
    },
    {name: 'editCoworkersLeaves', label: 'Edit Co-workers Leaves', rule: []},
    {
      name: 'showAnnualLeaveDetails',
      label: 'Show Annual Leave Details',
      rule: [],
    },
  ],

  'Notice Board': [
    {name: 'createNotice', label: 'Create Notice', rule: []},
    {name: 'editNotice', label: 'Edit Notice', rule: []},
    {name: 'viewNotice', label: 'View Notice', rule: []},
    {name: 'deleteNotice', label: 'Delete Notice', rule: []},
  ],
  Blog: [
    {name: 'createBlog', label: 'Create Blog', rule: []},
    {name: 'editBlog', label: 'Edit Blog', rule: []},
    {name: 'viewBlog', label: 'View Blog', rule: []},
    {name: 'deleteBlog', label: 'Delete Blog', rule: []},
  ],
  Reports: [
    {name: 'viewWeeklyReport', label: 'View Weekly Report', rule: []},
    {name: 'viewLeaveReport', label: 'View Leave Report', rule: []},
    {name: 'viewWorkLogReport', label: 'View Work Log Report', rule: []},
    {name: 'viewActivityLog', label: 'View Activity Log', rule: []},
  ],
  Resources: [
    {name: 'createFAQ', label: 'Create FAQ', rule: []},
    {name: 'createPolicy', label: 'Create Policy', rule: []},
    {name: 'createHoliday', label: 'Create Holiday', rule: []},
    {name: 'editFAQ', label: 'Edit FAQ', rule: []},
    {name: 'editPolicy', label: 'Edit Policy', rule: []},
    {name: 'editHoliday', label: 'Edit Holiday', rule: []},
    {name: 'viewFAQ', label: 'View FAQ', rule: []},
    {name: 'viewPolicy', label: 'View Policy', rule: []},
    {name: 'viewHoliday', label: 'View Holiday', rule: []},
    {name: 'deleteFAQ', label: 'Delete FAQ', rule: []},
    {name: 'deletePolicy', label: 'Delete Policy', rule: []},
    {name: 'deleteHoliday', label: 'Delete Holiday', rule: []},
  ],
  Settings: [
    {name: 'coWorkers', label: 'Co-Workers', rule: []},
    {name: 'projects', label: 'Projects', rule: []},
    {name: 'logTime', label: 'Log Time', rule: []},
    {name: 'leaveManagement', label: 'Leave Management', rule: []},
    {name: 'noticeBoard', label: 'Notice Board', rule: []},
    {name: 'blog', label: 'Blog', rule: []},
    {name: 'Resources', label: 'Resources', rule: []},
    {name: 'emails', label: 'Emails', rule: []},
  ],
}

export const CHANGE_SINGLE_CHECKBOX = 'CHANGE_SINGLE_CHECKBOX'
export const RESET = 'RESET'
export const SELECT_ALL_CHECKBOX = 'SELECT_ALL_CHECKBOX'
export const GLOBAL_SELECT_ALL = 'GLOBAL_SELECT_ALL'
export const GLOBAL_REMOVE_ALL = 'GLOBAL_REMOVE_ALL'
export const SET_EDIT_DATA = 'SET_EDIT_DATA'
