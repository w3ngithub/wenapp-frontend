// basic calendar events style - start
export interface Style {
  fontSize: string
  width: string
  margin: string
  fontWeight: string
  height: string
  background?: string
  padding?: string
  color?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  backgroundColor?: string
}

export interface Events {
  title: string
  type: string
  leaveType: string
  halfDay: string
  startDate: any
  id: string
  name: string
  isLessHourWorked?: boolean
}

export interface Notices {
  title: string
  noticeType: {name: string}
  startDate: string
  endDate: string
}
// basic calendar events style -end

//formatted users for checkin employees - start
export interface FormattedUserData {
  attendanceDate?: string
  createdAt?: string
  punchInLocation?: number[]
  punchInTime?: string
  punchOutLocation?: number[]
  punchOutTime?: string
  punchInIp?: string
  punchOutIp?: string
  createdBy?: string
  midDayExit?: boolean
  punchInNote?: string
  punchOutNote?: string
  updatedAt?: string
  lateArrivalLeaveCut?: boolean
  officeTime?: {utcDate: string; hour: string; minute: string}
  punchHour?: number
  punchMinutes?: number
  startHour?: number
  startMinute?: number
  user?: string
  userId?: string
  _id?: string
}
export interface UsersFormatted {
  data: FormattedUserData[]
  _id: {
    attendanceDate: string
    user: string
  }
}

//coworkers late attendance
export interface LateUsers {
  data: FormattedUserData[]
  _id: {userId: string; user: string}
}

export interface ViewLateAttendance extends FormattedUserData {
  attendanceDay: string
  date: string
  key: string
  officeHour: string
}
//formatted users for checkin employees-end

//attendace view details- start
export interface viewAttendance {
  attendanceDate: string
  attendanceDay: string
  punchInTime: string
  punchOutTime: string
  officeHour: string
  punchInNote: string
  punchOutNote: string
  user?: string
}
//attendace view details

// basic leave interface- start
export interface CommonLeaves {
  _id: string
  user: [{name: string}]
  leaveDates: string[]
  halfDay: string
  createdAt?: string
  leaveStatus?: string
  reason?: string
  updatedAt?: string
}

export interface CutLeave {
  data: {
    leaveDates: string[]
    halfDay: string
    leaveStatus?: string
    reason?: string
    leaveType: string
  }
  id: string
}

export interface UpdateLateLeave {
  attendance: number[]
  leaveCutdate: string
  leaveType: string
  userId: string
}
// basic leave interface-end

//employees on leave- start
export interface Leaves extends CommonLeaves {
  leaveType: [{name: string; _id?: string}]
}
//employees on leave-end

//attendances calendar- start
export interface CalendarLeaves extends CommonLeaves {
  leaveType: {name: string; _id?: string}
}

export interface EachDay {
  title: string
  start: any
  end: any
  allDay: boolean
  type: string
  isLessHoursWorked?: boolean
}

export interface EachDayLeave extends EachDay {
  id: string
}

export interface SelectLeaves extends EachDay {
  id: {attendanceDate: string; user: string}
}

//attendance calendar-end
