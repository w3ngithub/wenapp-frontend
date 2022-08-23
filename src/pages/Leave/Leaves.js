import React, { useState } from "react";
import { Button, Form, Table } from "antd";
import Select from "components/Elements/Select";
import { LEAVES_COLUMN, STATUS_TYPES } from "constants/Leaves";
import { CSVLink } from "react-csv";
import LeaveModal from "components/Modules/LeaveModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeLeaveStatus, getLeavesOfAllUsers } from "services/leaves";
import { changeDate, handleResponse } from "helpers/utils";
import Notification from "components/Elements/Notification";
import { getAllUsers } from "services/users/userDetails";

const FormItem = Form.Item;

const formattedLeaves = leaves => {
	return leaves?.map(leave => ({
		...leave,
		key: leave._id,
		dates: leave?.leaveDates.map(date => changeDate(date)).join(" , "),
		type: leave?.leaveType.name,
		status: leave?.leaveStatus
	}));
};

function Leaves({
	selectedRows,
	handleCancelLeave,
	rowSelection,
	isExportDisabled
}) {
	const queryClient = useQueryClient();

	const [openModal, setOpenModal] = useState(false);
	const [dataToEdit, setDataToEdit] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);
	const [readOnly, setReadOnly] = useState(false);
	const [leaveStatus, setLeaveStatus] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });

	const [user, setUser] = useState(undefined);

	const leavesQuery = useQuery(["leaves", leaveStatus, user], () =>
		getLeavesOfAllUsers(leaveStatus, user)
	);
	const usersQuery = useQuery(["users"], getAllUsers);

	const leaveApproveMutation = useMutation(
		payload => changeLeaveStatus(payload.id, payload.type),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Leave approved successfully",
					"Could not approve leave",
					[
						() => queryClient.invalidateQueries(["userLeaves"]),
						() => queryClient.invalidateQueries(["leaves"])
					]
				),
			onError: error => {
				Notification({ message: "Could not approve leave", type: "error" });
			}
		}
	);

	const handleApproveLeave = leave => {
		leaveApproveMutation.mutate({ id: leave._id, type: "approve" });
	};

	const handleStatusChange = statusId => {
		setLeaveStatus(statusId);
	};
	const handleUserChange = user => {
		setUser(user);
	};

	const handleResetFilter = () => {
		setLeaveStatus(undefined);
		setUser(undefined);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setIsEditMode(false);
	};
	const handleOpenModal = () => {
		setOpenModal(true);
		setReadOnly(false);
	};

	const handleOpenEditModal = (data, mode) => {
		setIsEditMode(true);
		setDataToEdit(data);
		handleOpenModal();
		setReadOnly(mode);
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};
	const data = formattedLeaves(leavesQuery?.data?.data?.data?.data);
	const allUsers = usersQuery?.data?.data?.data?.data?.map(user => ({
		id: user._id,
		value: user.name
	}));
	return (
		<div>
			<LeaveModal
				leaveData={dataToEdit}
				isEditMode={isEditMode}
				open={openModal}
				onClose={handleCloseModal}
				users={usersQuery?.data?.data?.data?.data}
				readOnly={readOnly}
			/>
			<div className="components-table-demo-control-bar">
				<div className="gx-d-flex gx-justify-content-between gx-flex-row">
					<Form layout="inline">
						<FormItem>
							<Select
								placeholder="Select Status"
								onChange={handleStatusChange}
								value={leaveStatus}
								options={STATUS_TYPES}
							/>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select User"
								value={user}
								options={allUsers}
								onChange={handleUserChange}
							/>
						</FormItem>

						<FormItem>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={handleResetFilter}
							>
								Reset
							</Button>
						</FormItem>
					</Form>
					<div>
						<Button
							className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
							onClick={handleOpenModal}
						>
							Add Leave
						</Button>
						<CSVLink
							filename={"Leaves"}
							data={
								data?.length > 0
									? [
											["Dates", "Type", "Reason", "Status"],

											...data
												?.filter(leave => selectedRows.includes(leave?._id))
												?.map(leave => [
													leave?.dates,
													leave?.type,
													leave?.reason,
													leave?.status
												])
									  ]
									: []
							}
						>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								disabled={isExportDisabled}
							>
								Export
							</Button>
						</CSVLink>
					</div>
				</div>
			</div>
			<Table
				className="gx-table-responsive"
				columns={LEAVES_COLUMN(
					handleCancelLeave,
					handleApproveLeave,
					handleOpenEditModal,
					true
				)}
				dataSource={data}
				// onChange={handleTableChange}
				rowSelection={rowSelection}
				pagination={{
					current: page.page,
					pageSize: page.limit,
					pageSizeOptions: ["5", "10", "20", "50"],
					showSizeChanger: true,
					total: leavesQuery?.data?.data?.data?.count || 1,
					onShowSizeChange,
					hideOnSinglePage: true,
					onChange: handlePageChange
				}}
				loading={leavesQuery.isFetching || leaveApproveMutation.isLoading}
			/>
		</div>
	);
}

export default Leaves;
