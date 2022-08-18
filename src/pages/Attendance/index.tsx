import React from "react";
import { Card, Tabs } from "antd";
import UserAttendance from "./UserAttendance";

function Attendace() {
	return (
		<Card title="Attendance">
			<Tabs type="card">
				<Tabs.TabPane key="1" tab="User Attendance">
					<UserAttendance />
				</Tabs.TabPane>
				<Tabs.TabPane key="2" tab="Admin Attendance"></Tabs.TabPane>
			</Tabs>
		</Card>
	);
}

export default Attendace;
