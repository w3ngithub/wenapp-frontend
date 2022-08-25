import React from "react";
import { Card, Tabs } from "antd";
import Coworkers from "./Coworkers";
import Projects from "./Projects";
import Logtime from "./Logtime";
import Leave from "./Leave";
import Noticeboard from "./Noticeboard";
import Blog from "./Blog";

const TabPane = Tabs.TabPane;

function Settings() {
	return (
		<Card title="Settings">
			<Tabs type="card">
				<TabPane tab="Co-Workers" key="1">
					<Coworkers />
				</TabPane>

				<TabPane tab="Projects" key="2">
					<Projects />
				</TabPane>
				<TabPane tab="Log Time" key="3">
					<Logtime />
				</TabPane>
				<TabPane tab="Leave Management" key="4">
					<Leave />
				</TabPane>
				<TabPane tab="Notice Board" key="5">
					<Noticeboard />
				</TabPane>
				<TabPane tab="Blog" key="6">
					<Blog />
				</TabPane>
			</Tabs>
		</Card>
	);
}

export default Settings;
