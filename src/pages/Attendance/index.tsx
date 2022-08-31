import React from "react";
import { Card, Tabs } from "antd";
import UserAttendance from "./UserAttendance";
import AdminAttendance from "./AdminAttendance";

function Attendace() {
	return (
		<Card title="Attendance">
			<Tabs type="card">
				<Tabs.TabPane key="1" tab="My Attendance">
					<UserAttendance />
				</Tabs.TabPane>
				<Tabs.TabPane key="2" tab="Co-workers' Attendance">
					<AdminAttendance />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
}

export default Attendace;
