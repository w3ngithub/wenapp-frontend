import { Card, Spin } from "antd";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import {
	getLocalStorageData,
	MuiFormatDate,
	sortFromDate
} from "helpers/utils";
import {
	getAttendacentOfUser,
	searchAttendacentOfUser
} from "services/attendances";
import { monthlyState } from "constants/Attendance";

const localizer = momentLocalizer(moment);

function AttendanceCalendar() {
	const user = getLocalStorageData("user_id");
	const [date, setDate] = useState(monthlyState);
	const { data, isLoading, isFetching } = useQuery(
		["userAttendance", user, date],
		() =>
			searchAttendacentOfUser({
				userId: user._id,
				fromDate: date?.[0] ? MuiFormatDate(date[0]) + "T00:00:00Z" : "",
				toDate: date?.[1] ? MuiFormatDate(date[1]) + "T00:00:00Z" : ""
			})
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

	let attendances: any[] = [];

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
			title: "Office Hrs: " + totalHoursWorked,
			start: new Date(attendance._id?.attendanceDate),
			end: new Date(attendance._id?.attendanceDate)
		});
	});
	return (
		<Card className="gx-card" title="Calendar">
			<Spin spinning={isLoading}>
				<div className="gx-rbc-calendar">
					<Calendar
						localizer={localizer}
						events={attendances}
						startAccessor="start"
						endAccessor="end"
						onRangeChange={handleCalendarRangeChange}
					/>
				</div>
			</Spin>
		</Card>
	);
}

export default AttendanceCalendar;
