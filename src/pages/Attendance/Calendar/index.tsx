import { Card, Spin } from "antd";
import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import {
	getLocalStorageData,
	MuiFormatDate,
	sortFromDate
} from "helpers/utils";
import { searchAttendacentOfUser } from "services/attendances";
import { monthlyState } from "constants/Attendance";
import { getLeavesOfAllUsers } from "services/leaves";
import useWindowsSize from "hooks/useWindowsSize";

const localizer = momentLocalizer(moment);

function AttendanceCalendar() {
	const user = getLocalStorageData("user_id");
	const {innerWidth} = useWindowsSize();
	const [date, setDate] = useState(monthlyState);
	const { data, isLoading } = useQuery(["userAttendance", user, date], () =>
		searchAttendacentOfUser({
			userId: user._id,
			fromDate: date?.[0] ? MuiFormatDate(date[0]) + "T00:00:00Z" : "",
			toDate: date?.[1] ? MuiFormatDate(date[1]) + "T00:00:00Z" : ""
		})
	);
	const { data: userLeaves } = useQuery(
		["userLeaves"],
		() => getLeavesOfAllUsers("approved", user._id),
		{
			select: res => {
				return res?.data?.data?.data;
			}
		}
	);

	const handleCalendarRangeChange = (calendarDate: any) => {
		const mom = moment(moment(calendarDate[0]).add(1, "days"))
			.utc()
			.format();
		const filterByWeek = calendarDate.length === 7;
		const filterByDay = calendarDate.length === 1;
		if (filterByWeek) {
			setDate([calendarDate[0], calendarDate[6]]);
		} else if (filterByDay) {
			setDate([calendarDate[0], mom]);
		} else {
			setDate([calendarDate.start, calendarDate.end]);
		}
	};

	const handleEventStyle = (event: any) => {
		let style: any = {
			fontSize: "13px",
			width: 'fit-content',
			// width: innerWidth <=729 ? '2.5rem' : 'fit-content',
			margin: "0px auto",
			fontWeight: "500",
			height: "27px",
			padding: "5px 10px"
		};
		if (event.type === "leave")
			style = {
				...style,
				backgroundColor: "#FC6BAB"
			};

		if (event.isLessHourWorked)
			style = {
				...style,
				backgroundColor: "#E14B4B"
			};
		if (!event.isLessHourWorked && event.type !== "leave")
			style = {
				...style,
				backgroundColor: "#038fde"
			};

		return {
			style
		};
	};

	let attendances: any[] = [],
		leaves: any[] = [];

	userLeaves?.forEach((leave: any) => {
		leaves.push({
			id: leave?._id,
			title: leave?.leaveType?.name,
			start: new Date(leave?.leaveDates?.[0]),
			end: new Date(leave?.leaveDates?.[0]),
			type: "leave",
			allDay: true
		});
	});

	data?.data?.data?.attendances[0]?.data?.forEach((attendance: any) => {
		const sortedAttendance = sortFromDate(
			attendance?.data,
			"punchInTime"
		).filter((attendance: any) => attendance.punchOutTime);

		const totalHoursWorked: number = sortedAttendance.reduce(
			(acc: number, attendance: any) =>
				new Date(attendance.punchOutTime).getHours() -
				new Date(attendance.punchInTime).getHours() +
				acc,
			0
		);

		attendances.push({
			id: attendance?._id,
			title: "Hours: " + totalHoursWorked,
			start: new Date(attendance._id?.attendanceDate),
			end: new Date(attendance._id?.attendanceDate),
			isLessHourWorked: totalHoursWorked < 9,
			allDay: true
		});
	});

	return (
		<Card className="gx-card" title="Calendar">
			<Spin spinning={isLoading}>
				<div className="gx-rbc-calendar">
					<Calendar
						localizer={localizer}
						events={[...attendances, ...leaves]}
						startAccessor="start"
						endAccessor="end"
						onRangeChange={handleCalendarRangeChange}
						popup
						views={["month", "week", "day"]}
						eventPropGetter={handleEventStyle}
					/>
				</div>
			</Spin>
		</Card>
	);
}

export default AttendanceCalendar;
