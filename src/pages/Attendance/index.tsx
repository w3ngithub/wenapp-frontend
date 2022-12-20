import React, {useEffect, useState} from 'react'
import {Card, Tabs} from 'antd'
import UserAttendance from './UserAttendance'
import AdminAttendance from './AdminAttendance'
import LateAttendance from './LateAttendance'
import AttendanceCalendar from './Calendar'
import AdminAttendanceCalendar from './AdminCalendar'
import {useLocation} from 'react-router-dom'
import {
  ATTENDANCE_ALL_TAB_NO_ACCESS,
  ATTENDANCE_LATE_ARRIVAL_ADMIN_CALENDAR_NO_ACCESS,
} from 'constants/RoleAccess'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

function Attendace() {
  const {state}: {state: any} = useLocation()

  const [tabKey, setTabKey] = useState('1')

  const {
    role: {
      key,
      permission: {Attendance: NavigationAttendance},
    },
  } = useSelector(selectAuthUser)

  useEffect(() => {
    setTabKey(state?.tab)
  }, [state])

  return (
    <Card title="Attendance">
      <Tabs
        type="card"
        activeKey={tabKey || '1'}
        onChange={(tab) => {
          setTabKey(tab)
        }}
      >
        {NavigationAttendance?.viewMyAttendance && (
          <Tabs.TabPane key="1" tab="My Attendance">
            <UserAttendance />
          </Tabs.TabPane>
        )}
        {NavigationAttendance?.viewMyAttendanceCalendar && (
          <Tabs.TabPane key="2" tab="My Attendance Calendar">
            <AttendanceCalendar />
          </Tabs.TabPane>
        )}

        {NavigationAttendance?.viewCoworkersAttendance && (
          <Tabs.TabPane key="3" tab="Co-workers Attendance">
            <AdminAttendance userRole={key} />
          </Tabs.TabPane>
        )}

        {NavigationAttendance?.viewCoworkersLateAttendance && (
          <Tabs.TabPane key="4" tab="Co-workers Late Attendance">
            <LateAttendance userRole={key} />
          </Tabs.TabPane>
        )}
        {NavigationAttendance?.viewCoworkersAttendanceCalendar && (
          <Tabs.TabPane key="5" tab="Co-workers Attendance Calendar">
            <AdminAttendanceCalendar />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Card>
  )
}

export default Attendace
