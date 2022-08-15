import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { events } from "routes/extensions/calendar/events";

const localizer = momentLocalizer(moment);

function CalendarResource() {
	return (
		<div className="gx-main-content">
			<div className="gx-rbc-calendar">
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
				/>
			</div>
		</div>
	);
}

export default CalendarResource;
