import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "antd";
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
import TinyBarChart from "routes/extensions/charts/recharts/bar/Components/TinyBarChart";
import Select from "components/Elements/Select";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "services/projects";
import { getLogTypes } from "services/timeLogs";
import PieChartWithCustomizedLabel from "routes/extensions/charts/recharts/pie/Components/PieChartWithCustomizedLabel";
import CustomActiveShapePieChart from "routes/extensions/charts/recharts/pie/Components/CustomActiveShapePieChart";

const FormItem = Form.Item;

const localizer = momentLocalizer(moment);

const Dashboard = () => {
	const [chart, setChart] = useState("1");

	const { data } = useQuery(["DashBoardprojects"], () =>
		getAllProjects({
			fields:
				"_id,name,-devOps,-createdBy,-designers,-developers,-projectStatus,-projectTags,-projectTypes,-qa,-updatedBy"
		})
	);

	const { data: logTypes } = useQuery(["DashBoardlogTypes"], () =>
		getLogTypes()
	);

	const generateChart = (values: any) => {
		setChart(values.chart);
	};

	return (
		<Auxiliary>
			<Row>
				<Col xl={8} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={TeamOutlined}
						totalCount={5}
						label="Co-workers On Leave"
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={<TeamOutlined />}
						totalCount={30}
						label="Co-workers Checked In Today"
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						// component={<TeamOutlined />}
						totalCount={2}
						label="Leave Request Pending"
					/>
				</Col>

				<Col xl={8} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-2">
					<Widget>
						<EventsAndAnnouncements />
						{/* <RecentActivity recentList={recentActivity} /> */}
					</Widget>
				</Col>

				<Col xl={16} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
					<Card className="gx-card" title="Project Time Log Report">
						<div className="gx-d-flex gx-justify-content-between gx-flex-row gx-mb-3">
							<Form layout="inline" onFinish={generateChart}>
								<FormItem name="chart">
									<Select
										placeholder="Select Chart"
										options={[
											{ _id: "1", name: "Bar Chart" },
											{ _id: "2", name: "Pie Chart" }
										]?.map((x: { _id: string; name: string }) => ({
											id: x._id,
											value: x.name
										}))}
									/>
								</FormItem>
								<FormItem name="project">
									<Select
										placeholder="Select Project"
										options={data?.data?.data?.data?.map(
											(x: { _id: string; name: string }) => ({
												id: x._id,
												value: x.name
											})
										)}
									/>
								</FormItem>
								<FormItem name="logType">
									<Select
										placeholder="Select Log Types"
										style={{ width: 250 }}
										mode="tags"
										options={logTypes?.data?.data?.data?.map(
											(x: { _id: string; name: string }) => ({
												id: x._id,
												value: x.name
											})
										)}
									/>
								</FormItem>
								<FormItem>
									<Button type="primary" key="submit" htmlType="submit">
										Generate Chart
									</Button>
								</FormItem>
							</Form>
						</div>
						{chart === "2" ? (
							<CustomActiveShapePieChart
								data={logTypes?.data?.data?.data?.map((x: any) => ({
									name: x.name,
									value: +(Math.random() * 100).toFixed()
								}))}
							/>
						) : (
							<TinyBarChart
								data={logTypes?.data?.data?.data?.map((x: any) => ({
									name: x.name,
									time: (Math.random() * 100).toFixed()
								}))}
							/>
						)}
					</Card>

					<Card className="gx-card" title="Calendar">
						<div className="gx-rbc-calendar">
							<Calendar
								localizer={localizer}
								events={events}
								startAccessor="start"
								endAccessor="end"
							/>
						</div>
					</Card>
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
