import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CommonModal from "./CommonModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createHolidays,
	deleteHoliday,
	getAllHolidays,
	updateHoliday
} from "services/resources";
import { Button, Card, Table } from "antd";
import { HOLIDAY_COLUMNS } from "constants/Holidays";
import { changeDate, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";

const localizer = momentLocalizer(moment);

const formattedHoliday = holidays => {
	return holidays?.map(holiday => ({
		...holiday,
		key: holiday._id,
		date: changeDate(holiday.date)
	}));
};

function Holiday() {
	const queryClient = useQueryClient();

	const [openAdd, setOpenAdd] = useState(false);
	const [sort, setSort] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);
	const [dataToEdit, setDataToEdit] = useState({});

	const { data: Holidays, isLoading, isFetching } = useQuery(
		["DashBoardHolidays"],
		() => getAllHolidays({ sort: "-createdAt", limit: "1" })
	);

	const createHolidaysMutation = useMutation(createHolidays, {
		onSuccess: response =>
			handleResponse(
				response,
				"Holidays added successfully",
				"Holidays add failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["DashBoardHolidays"])
				]
			),
		onError: error => {
			notification({
				message: "Holidays add failed!",
				type: "error"
			});
		}
	});

	const deleteHolidayMutation = useMutation(deleteHoliday, {
		onSuccess: response =>
			handleResponse(
				response,
				"Holiday deleted successfully",
				"Holiday deletion failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["DashBoardHolidays"])
				]
			),
		onError: error => {
			notification({
				message: "Holiday deletion failed!",
				type: "error"
			});
		}
	});

	const editHolidayMutation = useMutation(updateHoliday, {
		onSuccess: response =>
			handleResponse(
				response,
				"Holiday updated successfully",
				"Holiday update failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["DashBoardHolidays"])
				]
			),
		onError: error => {
			notification({
				message: "Holiday update failed!",
				type: "error"
			});
		}
	});

	const handleAddClick = holiday => {
		createHolidaysMutation.mutate(holiday);
	};

	const handleEditClick = holidays => {
		editHolidayMutation.mutate({
			id: Holidays?.data?.data?.data?.[0]?._id,
			holidays
		});
	};

	const handleDeleteClick = data => {
		deleteHolidayMutation.mutate({
			holidayId: data._id,
			docId: Holidays?.data?.data?.data?.[0]?._id
		});
	};

	const handleOpenEditModal = data => {
		setIsEditMode(true);
		setOpenAdd(true);

		setDataToEdit(Holidays?.data?.data?.data?.[0]?.holidays);
	};

	const handleCloseModal = () => {
		setIsEditMode(false);

		setDataToEdit({});
		setOpenAdd(false);
	};

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
			<CommonModal
				toggle={openAdd}
				isEditMode={isEditMode}
				editData={dataToEdit}
				onCancel={handleCloseModal}
				onSubmit={isEditMode ? handleEditClick : handleAddClick}
				isLoading={
					createHolidaysMutation.isLoading || editHolidayMutation.isLoading
				}
			/>
			<Card
				title="Holidays"
				extra={
					<Button
						className="gx-btn gx-btn-primary gx-text-white "
						onClick={() => setOpenAdd(true)}
					>
						Add New Year Holidays
					</Button>
				}
			>
				<Table
					className="gx-table-responsive"
					columns={HOLIDAY_COLUMNS(
						sort,
						handleDeleteClick,
						handleOpenEditModal
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
						popup
					/>
				</div>
			</Card>
		</div>
	);
}

export default Holiday;
