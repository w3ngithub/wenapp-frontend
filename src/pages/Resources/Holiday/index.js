import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { events } from "routes/extensions/calendar/events";
import CommonModal from "./CommonModal";
import { useQuery } from "@tanstack/react-query";
import { getAllHolidays } from "services/resources";
import { Button, Card } from "antd";

const localizer = momentLocalizer(moment);

function Holiday() {
	const [openAdd, setOpenAdd] = useState(false);

	const { data: Holidays } = useQuery(["DashBoardHolidays"], () =>
		getAllHolidays({ sort: "-createdAt", limit: "1" })
	);

	console.log(Holidays?.data?.data?.data?.[0]?.holidays);
	return (
		<div className="gx-main-content">
			<CommonModal toggle={openAdd} onCancel={() => setOpenAdd(false)} />
			<Card
				title={
					<span className="gx-d-flex gx-justify-content-between">
						<span>Holidays</span>
						<span>
							<Button
								className="gx-btn gx-btn-primary gx-text-white "
								onClick={() => setOpenAdd(true)}
							>
								Add New Year Holidays
							</Button>
						</span>
					</span>
				}
			></Card>
			<Card title="Holidays Calendar">
				<div className="gx-rbc-calendar">
					<Calendar
						localizer={localizer}
						events={events}
						startAccessor="start"
						endAccessor="end"
					/>
				</div>
			</Card>
		</div>
	);
}

export default Holiday;
