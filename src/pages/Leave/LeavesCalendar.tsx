import { Card } from "antd";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { getLeavesOfAllUsers } from "services/leaves";

const localizer = momentLocalizer(moment);

const LeavesCalendar = () => {
	const leavesQuery = useQuery(
		["leavesCalendar"],
		() => getLeavesOfAllUsers("approved", "", ""),
		{
			onError: err => console.log(err)
		}
	);

	const leaveUsers = leavesQuery?.data?.data?.data?.data?.map((x: any) => ({
		title: x.halfDay ? x?.user?.name + ":Half Day" : x?.user?.name,
		start: new Date(new Date(Date.now()).toLocaleString().split(",")[0]),
		end: new Date(new Date(Date.now()).toLocaleString().split(",")[0])
	}));
	return (
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
	);
};

export default LeavesCalendar;
