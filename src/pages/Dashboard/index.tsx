import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import Widget from "components/Elements/Widget/index";
import TotalCountCard from "components/Elements/TotalCountCard";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
import {
	getPendingLeavesCount,
	getTodaysUserLeaveCount,
	getWeekRangeLeaves
} from "services/leaves";
import { getLocalStorageData, oneWeekFilterCheck } from "helpers/utils";
import { getWeeklyNotices } from "services/noticeboard";
import { getAllHolidays } from "services/resources";
import {
	getActiveUsersCount,
	getBirthMonthUsers,
	getSalaryReviewUsers
} from "services/users/userDetails";
import { getTodaysUserAttendanceCount } from "services/attendances";
import { useNavigate } from "react-router-dom";
import useWindowsSize from "hooks/useWindowsSize";

const FormItem = Form.Item;

const localizer = momentLocalizer(moment);

const Dashboard = () => {
	const [chart, setChart] = useState("1");
	const [project, setProject] = useState("");
	const [logType, setlogType] = useState("");
	const navigate = useNavigate();
	const loggedInUser = getLocalStorageData("user_id");
	const { innerWidth } = useWindowsSize();
	const [form] = Form.useForm();

	const { data: salaryReview } = useQuery(
		["usersSalaryReview"],
		getSalaryReviewUsers
	);

	const { data: AttendanceCount } = useQuery(
		["todaysAttendance"],
		getTodaysUserAttendanceCount
	);

	const { data: PendingLeaves } = useQuery(
		["pendingLeave"],
		getPendingLeavesCount
	);

	const { data: ActiveUsers } = useQuery(
		["DashBoardActiveUsers"],
		getActiveUsersCount
	);

	const { data: TodaysLeave } = useQuery(
		["DashBoardTodaysLeave"],
		getTodaysUserLeaveCount
	);

	const { data: BirthMonthUsers } = useQuery(
		["bithMonthUsers"],
		getBirthMonthUsers
	);

	const { data: notices } = useQuery(["DashBoardnotices"], getWeeklyNotices);

	const { data: Holidays } = useQuery(["DashBoardHolidays"], () =>
		getAllHolidays({ sort: "-createdAt", limit: "1" })
	);

	const chartQuery = useQuery(
		["projectChart", project, logType],
		() => getTimeLogChart({ project, logType }),
		{ enabled: false, refetchOnWindowFocus: false }
	);

	const leavesQuery = useQuery(
		["DashBoardleaves"],
		() => getWeekRangeLeaves(),
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

	const handleEventStyle = (event: any) => {
		let style: any = {
			fontSize: "10px",
			width: innerWidth <=729 ? '2.5rem' : 'fit-content',
			margin: "0px auto",
			fontWeight: "600",
			marginBottom: "10px",

			background: "transparent"
		};
		if (event.type === "birthday")
			style = {
				...style,
				color: "#FC6BAB"
			};
		if (event.type === "holiday")
			style = {
				...style,
				color: "rgb(235 68 68)"
			};
		if (event.type === "leave")
			style = {
				...style,
				fontWeight: "400",

				color: "#038fde"
			};

		return {
			style
		};
	};

	const CustomEvent = (props: any) => {
		const style = {
			display: "flex",
			alignItems: "center",
			gap: "4px",
			margin: "0 !important"
		};
		if (props.event.type === "birthday")
			return (
				<p style={{ ...style, marginTop: "20px", flexWrap: "wrap" }}>
					<i className="icon icon-birthday-new gx-fs-lg" />
					{props?.event?.title}
				</p>
			);
		if (props.event.type === "holiday")
			return (
				<p style={{ ...style, marginTop: "25px" }}>{props?.event?.title}</p>
			);

		if (props.event.type === "leave")
			return (
				<>
					<h6
						style={{
							margin: "0px",
							textAlign: "center",
							fontSize: "10px",
							fontWeight: "600"
						}}
					>
						{props?.event?.leaveType}:
					</h6>
					{props?.event?.title}
				</>
			);

		return <p>{props?.event?.title}</p>;
	};

	let components = {
		event: CustomEvent // used by each view (Month, Day, Week)
	};

	const leaveUsers = leavesQuery?.data?.data?.data?.users?.map(
		({ _id: x }: any, index: number) => ({
			title: x?.user?.[0],
			start: new Date(
				new Date(x.leaveDates).toLocaleDateString().split("T")[0]
			),
			end: new Date(new Date(x.leaveDates).toLocaleDateString().split("T")[0]),
			type: "leave",
			leaveType: x?.leaveType?.[0]
		})
	);

	const noticesCalendar = notices?.data?.data?.notices?.map((x: any) => ({
		title: x.title,
		end: x.endDate ? new Date(x.endDate) : new Date(x.startDate),
		start: new Date(x.startDate)
	}));

	const holidaysCalendar = Holidays?.data?.data?.data?.[0]?.holidays
		?.filter(oneWeekFilterCheck)
		?.map((x: any) => ({
			title: x.title,
			start: new Date(x.date),
			end: new Date(x.date),
			type: "holiday"
		}));

	const BirthDayCalendar = BirthMonthUsers?.data?.data?.users?.map(
		(x: any) => ({
			title: x.name,
			start: new Date(
				`${new Date().getFullYear()}/${new Date(x.dob).getMonth() +
					1}/${new Date(x.dob).getDate()}`
			),
			end: new Date(
				`${new Date().getFullYear()}/${new Date(x.dob).getMonth() +
					1}/${new Date(x.dob).getDate()}`
			),
			type: "birthday"
		})
	);

	const calendarEvents = [
		...(leaveUsers || []),
		...(noticesCalendar || []),
		...(holidaysCalendar || []),
		...(BirthDayCalendar || [])
	];

	const chartData = chartQuery?.data?.data?.data?.chart;
	const isAdmin = loggedInUser?.role?.value === "Admin";
	const width = isAdmin ? 6 : 8;

	return (
		<Auxiliary>
			<Row>
				<Col xl={width} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						isLink={loggedInUser?.role?.value === "Admin" ? true : false}
						className="gx-cyan-green-gradient"
						totalCount={ActiveUsers?.data?.data?.user || 0}
						label="Total Co-workers"
						onClick={
							loggedInUser?.role?.value !== "Admin"
								? null
								: () => navigate("/coworkers")
						}
					/>
				</Col>

				<Col xl={width} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						isLink={loggedInUser?.role?.value === "Admin" ? true : false}
						icon={LoginOutlined}
						className="gx-pink-purple-corner-gradient"
						totalCount={AttendanceCount?.data?.attendance?.[0]?.count || 0}
						label="Co-workers Punched In Today"
						onClick={
							loggedInUser?.role?.value !== "Admin"
								? null
								: () => navigate("/todays-overview")
						}
					/>
				</Col>
				{isAdmin && (
					<Col xl={6} lg={12} md={12} sm={12} xs={24}>
						<TotalCountCard
							isLink={loggedInUser?.role?.value === "Admin" ? true : false}
							icon={ExceptionOutlined}
							className="gx-pink-orange-corner-gradient"
							totalCount={PendingLeaves?.data?.data?.leaves || 0}
							label="Pending Leave Request"
							onClick={() =>
								navigate("/leave", {
									state: { tabKey: "3", leaveStatus: "pending" }
								})
							}
						/>
					</Col>
				)}
				<Col xl={width} lg={12} md={12} sm={12} xs={24}>
					<TotalCountCard
						isLink={loggedInUser?.role?.value === "Admin" ? true : false}
						totalCount={TodaysLeave?.data?.leaves?.[0]?.count || 0}
						label="Co-workers On Leave"
						icon={LogoutOutlined}
						onClick={
							loggedInUser?.role?.value !== "Admin"
								? null
								: () => navigate("/todays-overview")
						}
					/>
				</Col>

				<Col xl={8} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-2">
					<Widget>
						<EventsAndAnnouncements
							announcements={notices?.data?.data?.notices}
							holidays={Holidays?.data?.data?.data?.[0]?.holidays}
							birthdays={BirthMonthUsers?.data?.data?.users}
							salaryReview={salaryReview?.data?.data?.users}
						/>
					</Widget>
				</Col>

				<Col xl={16} lg={24} md={24} sm={24} xs={24} className="gx-order-lg-1">
					<Card className="gx-card" title="Calendar">
						<div className="gx-rbc-calendar">
							<Calendar
								components={components}
								localizer={localizer}
								events={calendarEvents}
								startAccessor="start"
								endAccessor="end"
								popup
								eventPropGetter={handleEventStyle}
								views={["month", "week", "day"]}
							/>
						</div>
					</Card>
					<Card className="gx-card" title="Project Time Log Report">
						<div className="gx-d-flex gx-justify-content-between gx-flex-row gx-mb-3">
							<Form layout="inline" onFinish={generateChart} form={form}>
								<FormItem name="chart">
									<Select
										style={{ width: innerWidth <= 504 ? "100%" : 115 }}
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
								<FormItem name="project" className="direct-form-item">
									<Select
										value={project}
										onChange={(c: any) => setProject(c)}
										// style={{ width: ( innerWidth <= 504 ? '100%' : 150 )}}
										placeholder="Select Project"
										options={data?.data?.data?.data?.map(
											(x: { _id: string; name: string }) => ({
												id: x._id,
												value: x.name
											})
										)}
										inputSelect
									/>
								</FormItem>
								<FormItem name="logType" className="direct-form-item">
									<Select
										value={logType}
										onChange={(c: any) => setlogType(c)}
										placeholder="Select Log Types"
										// style={{ width: ( innerWidth <= 504 ? '100%' : 215 )}}
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
				</Col>
			</Row>
		</Auxiliary>
	);
};

export default Dashboard;
