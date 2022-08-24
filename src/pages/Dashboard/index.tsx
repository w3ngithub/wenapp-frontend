import React from "react";
import { Col, Row } from "antd";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

import Auxiliary from "util/Auxiliary";
import ChartCard from "components/Modules/dashboard/Listing/ChartCard";

import UserImages from "components/Modules/dashboard/Listing/UserImages";
import RecentActivity from "components/Modules/dashboard/CRM/RecentActivity";
import { recentActivity } from "routes/socialApps/Wall/data";
import Widget from "components/Elements/Widget/index";
import CurrentPlan from "components/Modules/dashboard/Listing/CurrentPlan";
import DealsClosedCard from "components/Modules/dashboard/Listing/DealsClosedCard";
import PropertiesCard from "components/Modules/dashboard/Listing/PropertiesCard";
import TotalCountCard from "components/Elements/TotalCountCard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { events } from "routes/extensions/calendar/events";

import moment from "moment";
import EventsAndAnnouncements from "components/Modules/EventsAndAnnouncements";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
	return (
		<Auxiliary>
			<Row>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={TeamOutlined}
						totalCount={5}
						label="Co-workers On Leave"
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={<TeamOutlined />}
						className="gx-pink-purple-gradient"
						totalCount={30}
						label="Co-workers Checked In Today"
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={<TeamOutlined />}
						className="gx-bg-orange"
						totalCount={2}
						label="Leave Request Pending"
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						className="gx-bg-teal"
						// component={<TeamOutlined />}
						totalCount={38}
						label="Total Co-workers"
					/>
				</Col>

				<Col xl={8} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-2">
					<Widget>
						<EventsAndAnnouncements />
					</Widget>
				</Col>

				<Col xl={16} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
					<div className="gx-rbc-calendar">
						<Calendar
							localizer={localizer}
							events={events}
							startAccessor="start"
							endAccessor="end"
						/>
					</div>
					<Row>
						<Col xl={12} lg={12} md={24} sm={24} xs={24}>
							<CurrentPlan />
						</Col>
						<Col xl={12} lg={12} md={24} sm={24} xs={24}>
							<DealsClosedCard />
						</Col>
					</Row>
					<PropertiesCard />
				</Col>
			</Row>
		</Auxiliary>
	);
};

export default Dashboard;
