import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CommonModal from "./CommonModal";
import { useQuery } from "@tanstack/react-query";
import { getAllHolidays } from "services/resources";
import { Button, Card, Table } from "antd";
import { HOLIDAY_COLUMNS } from "constants/Holidays";
import { changeDate } from "helpers/utils";

const localizer = momentLocalizer(moment);

const formattedHoliday = holidays => {
	return holidays?.map(holiday => ({
		...holiday,
		key: holiday._id,
		date: changeDate(holiday.date)
	}));
};

function Holiday() {
	const [openAdd, setOpenAdd] = useState(false);
	const [sort, setSort] = useState({});

	const { data: Holidays, isLoading, isFetching } = useQuery(
		["DashBoardHolidays"],
		() => getAllHolidays({ sort: "-createdAt", limit: "1" })
	);

	const handleTableChange = (pagination, filters, sorter) => {
		setSort(sorter);
	};

	const holidaysCalendar = Holidays?.data?.data?.data?.[0]?.holidays?.map(
		x => ({
			title: x.title,
			start: new Date(x.date),
			end: new Date(x.date)
		})
	);

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
			>
				<Table
					className="gx-table-responsive"
					columns={HOLIDAY_COLUMNS(
						sort
						// handleOpenEditModal,
						// confirmDeleteProject
					)}
					dataSource={formattedHoliday(
						Holidays?.data?.data?.data?.[0]?.holidays
					)}
					onChange={handleTableChange}
					pagination={false}
					loading={isLoading || isFetching}
				/>
			</Card>
			<Card title="Holidays Calendar">
				<div className="gx-rbc-calendar">
					<Calendar
						localizer={localizer}
						events={holidaysCalendar}
						startAccessor="start"
						endAccessor="end"
					/>
				</div>
			</Card>
		</div>
	);
}

export default Holiday;
