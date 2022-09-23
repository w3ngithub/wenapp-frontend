import { Card } from "antd";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { getFiscalYearLeaves } from "services/leaves";

const localizer = momentLocalizer(moment);

const LeavesCalendar = () => {
	const leavesQuery = useQuery(
		["leavesCalendar"],
		() => getFiscalYearLeaves(),
		{
			onError: err => console.log(err)
		}
	);
		
	const leaveUsers = leavesQuery?.data?.data?.data?.data?.map(({ _id }: any) => {
		const nameSplitted= _id?.user[0].split(" ");
		const lastName = `${nameSplitted.pop().substring(0,1)}.`;
		const shortName = `${nameSplitted.join(" ")} ${lastName}`

		return {
			title: shortName,
			start: new Date(_id.leaveDates),
			end: new Date(_id.leaveDates)
		}
	})

	return (
		<Card className="gx-card" title="Calendar">
			<div className="gx-rbc-calendar">
				<Calendar
					localizer={localizer}
					events={leaveUsers}
					startAccessor="start"
					endAccessor="end"
					popup
				/>
			</div>
		</Card>
	);
};

export default LeavesCalendar;
