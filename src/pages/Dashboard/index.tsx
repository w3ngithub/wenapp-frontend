import React, { useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import Widget from "components/Elements/Widget/index";
import TotalCountCard from "components/Elements/TotalCountCard";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { events } from "routes/extensions/calendar/events";
import moment from "moment";
import EventsAndAnnouncements from "components/Modules/EventsAndAnnouncements";
import {
	LoginOutlined,
	LogoutOutlined,
	ExceptionOutlined
} from "@ant-design/icons";
import TinyBarChart from "routes/extensions/charts/recharts/bar/Components/TinyBarChart";
import Select from "components/Elements/Select";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "services/projects";
import { getLogTypes, getTimeLogChart } from "services/timeLogs";
import CustomActiveShapePieChart from "routes/extensions/charts/recharts/pie/Components/CustomActiveShapePieChart";
import { getLeavesOfAllUsers } from "services/leaves";
import { formatToUtc } from "helpers/utils";

const FormItem = Form.Item;

const localizer = momentLocalizer(moment);
const todayStartDay = moment.utc(formatToUtc(moment().startOf("day"))).format();

const Dashboard = () => {
	const [chart, setChart] = useState("1");
	const [project, setProject] = useState("");
	const [logType, setlogType] = useState("");

	const chartQuery = useQuery(
		["projectChart", project, logType],
		() => getTimeLogChart({ project, logType }),
		{ enabled: false, refetchOnWindowFocus: false }
	);

	const leavesQuery = useQuery(
		["DashBoardleaves"],
		() => getLeavesOfAllUsers("approved", "", todayStartDay),
		{
			onError: err => console.log(err)
		}
	);

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
		if (project === "" || project === undefined) return;
		chartQuery.refetch();
	};

	const leaveUsers = leavesQuery?.data?.data?.data?.data?.map((x: any) => ({
		title: x.halfDay ? x?.user?.name + ":Half Day" : x?.user?.name,
		start: new Date(new Date(Date.now()).toLocaleString().split(",")[0]),
		end: new Date(new Date(Date.now()).toLocaleString().split(",")[0])
	}));

	// const calendarEvents = [...leaveUsers];

	const chartData = chartQuery?.data?.data?.data?.chart;

	return (
		<Auxiliary>
			<Row>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						isLink={true}
						totalCount={5}
						label="Staff On Leave"
						icon={LogoutOutlined}
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						icon={LoginOutlined}
						className="gx-pink-purple-gradient"
						totalCount={30}
						label="Staff Checked In Today"
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						icon={ExceptionOutlined}
						className="gx-bg-orange"
						totalCount={2}
						label="Pending Leave Request"
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						className="gx-bg-teal"
						totalCount={38}
						label="Total Staff"
					/>
				</Col>

				<Col xl={8} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-2">
					<Widget>
						<EventsAndAnnouncements />
					</Widget>
				</Col>

				<Col xl={16} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
					<Card className="gx-card" title="Project Time Log Report">
						<div className="gx-d-flex gx-justify-content-between gx-flex-row gx-mb-3">
							<Form layout="inline" onFinish={generateChart}>
								<FormItem name="chart">
									<Select
										value={chart}
										onChange={(c: any) => setChart(c)}
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
										value={project}
										onChange={(c: any) => setProject(c)}
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
										value={logType}
										onChange={(c: any) => setlogType(c)}
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
						{project && (
							<div>
								{chartData && chartData.length ? (
									<div>
										{chart === "2" ? (
											<CustomActiveShapePieChart
												data={chartData?.map((x: any) => ({
													name: x.logType[0].name,
													value: +x.timeSpent.toFixed()
												}))}
											/>
										) : (
											<TinyBarChart
												data={chartData?.map((x: any) => ({
													name: x.logType[0].name,
													time: x.timeSpent.toFixed()
												}))}
											/>
										)}
									</div>
								) : (
									"No Data"
								)}
							</div>
						)}
					</Card>

					<Card className="gx-card" title="Calendar">
						<div className="gx-rbc-calendar">
							<Calendar
								localizer={localizer}
								events={leaveUsers}
								startAccessor="start"
								endAccessor="end"
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</Auxiliary>
	);
};

export default Dashboard;
