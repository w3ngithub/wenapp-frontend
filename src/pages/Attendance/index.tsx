import React from "react";
import { Card, Tabs } from "antd";
import UserAttendance from "./UserAttendance";
import AdminAttendance from "./AdminAttendance";
import LateAttendance from "./LateAttendance";
import AttendanceCalendar from "./Calendar";

function Attendace() {
	return (
		<Card title="Attendance">
			<Tabs type="card">
				<Tabs.TabPane key="1" tab="My Attendance">
					<UserAttendance />
				</Tabs.TabPane>
				<Tabs.TabPane key="2" tab="Calendar">
					<AttendanceCalendar />
				</Tabs.TabPane>
				<Tabs.TabPane key="3" tab="Co-workers Attendance">
					<AdminAttendance />
				</Tabs.TabPane>
				<Tabs.TabPane key="4" tab="Co-workers Late Attendance">
					<LateAttendance />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
}

export default Attendace;
