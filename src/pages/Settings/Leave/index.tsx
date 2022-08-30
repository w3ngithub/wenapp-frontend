import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../CommonTable";
import { LEAVES_COLUMN } from "constants/Settings";
import {
	addLeaveType,
	deleteLeaveType,
	editLeaveType,
	getLeaveTypes
} from "services/settings/leaveType";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import LeaveModal from "./LeaveModal";

interface leaveType {
	name: string;
	leaveDays: string;
}

function Leave() {
	const queryClient = useQueryClient();

	const [openModal, setOpenModal] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [dataToEdit, setDataToEdit] = useState<any>({});
	const { data: leaveTypes }: { data: any } = useQuery(
		["leaveTypes"],
		getLeaveTypes
	);

	const addLeaveTypeMutation = useMutation(addLeaveType, {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave type added successfully",
				"Leave type add failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["leaveTypes"])]
			),
		onError: error => {
			notification({
				message: "Leave type add failed!",
				type: "error"
			});
		}
	});
	const deleteLeaveTypeMutation = useMutation(deleteLeaveType, {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave type deleted successfully",
				"Leave type deletion failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["leaveTypes"])]
			),
		onError: error => {
			notification({
				message: "Leave Type deletion failed!",
				type: "error"
			});
		}
	});

	const editLeaveTypeMutation = useMutation(editLeaveType, {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave type updated successfully",
				"Leave type update failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["leaveTypes"])]
			),
		onError: error => {
			notification({
				message: "Leave type update failed!",
				type: "error"
			});
		}
	});

	const handleAddClick = (leave: leaveType) => {
		addLeaveTypeMutation.mutate(leave);
	};

	const handleEditClick = (leave: leaveType) => {
		editLeaveTypeMutation.mutate({ id: dataToEdit?._id, leave });
	};

	const handleDeleteClick = (data: any) => {
		deleteLeaveTypeMutation.mutate({ id: data._id });
	};

	const handleOpenEditModal = (data: any, type: string) => {
		setIsEditMode(true);
		setOpenModal(true);
		setDataToEdit(data);
	};

	const handleCloseModal = () => {
		setIsEditMode(false);

		setDataToEdit({});
		setOpenModal(false);
	};
	const handleOpenModal = (type: string) => {
		setOpenModal(true);
	};

	return (
		<>
			<LeaveModal
				toggle={openModal}
				isEditMode={isEditMode}
				editData={dataToEdit}
				isLoading={
					addLeaveTypeMutation.isLoading || editLeaveTypeMutation.isLoading
				}
				onSubmit={isEditMode ? handleEditClick : handleAddClick}
				onCancel={handleCloseModal}
			/>
			<Card title="Leave Type">
				<SettingTable
					data={leaveTypes?.data?.data?.data}
					columns={LEAVES_COLUMN(
						value => handleDeleteClick(value),
						value => handleOpenEditModal(value, "Leave Type")
					)}
					onAddClick={() => handleOpenModal("Leave Type")}
					isLoading={deleteLeaveTypeMutation.isLoading}
				/>
			</Card>
		</>
	);
}

export default Leave;
