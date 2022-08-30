import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { events } from "routes/extensions/calendar/events";
import CommonModal from "./CommonModal";

const localizer = momentLocalizer(moment);

function Holiday() {
	return (
		<div className="gx-main-content">
			<CommonModal />
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

export default Holiday;
