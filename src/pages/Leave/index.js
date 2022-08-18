import React, { useState } from "react";
import { Card, Table, Tabs } from "antd";
import { LEAVES_COLUMN } from "constants/Leaves";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	changeLeaveStatus,
	getLeavesOfAllUsers,
	getLeavesOfUser,
	getLeaveTypes,
	getTakenAndRemainingLeaveDaysOfUser
} from "services/leaves";
import { getAllUsers } from "services/users/userDetails";
import { changeDate, getLocalStorageData, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import RemainingAndAppliedLeaveCards from "./RemainingAndAppliedLeaveCards";
import LeavesApply from "./Apply";
import Leaves from "./Leaves";
import CircularProgress from "components/Elements/CircularProgress";

const TabPane = Tabs.TabPane;

const formattedUsers = users => {
	return users?.map(user => ({
		...user,
		key: user._id,
		dates: user?.leaveDates.map(date => changeDate(date)).join(" , "),
		type: user?.leaveType.name,
		status: user?.leaveStatus
	}));
};

function Leave() {
	const queryClient = useQueryClient();

	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [selectedRows, setSelectedRows] = useState([]);
	const [leaveStatus, setLeaveStatus] = useState(undefined);
	const [user, setUser] = useState(undefined);

	const usersQuery = useQuery(["users"], getAllUsers);

	const userLeavesQuery = useQuery(["userLeaves"], () =>
		getLeavesOfUser(getLocalStorageData("user_id").user._id)
	);

	const leaveDaysQuery = useQuery(["takenAndRemainingLeaveDays"], () =>
		getTakenAndRemainingLeaveDaysOfUser(getLocalStorageData("user_id").user._id)
	);

	const leavesQuery = useQuery(["leaves", leaveStatus, user], () =>
		getLeavesOfAllUsers(leaveStatus, user)
	);

	const leaveMutation = useMutation(
		payload => changeLeaveStatus(payload.id, payload.type),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Leave cancelled successfully",
					"Could not cancel leave",
					[() => queryClient.invalidateQueries(["userLeaves"])]
				),
			onError: error => {
				notification({ message: "Could not cancel leave", type: "error" });
			}
		}
	);

	const handleStatusChange = statusId => {
		setLeaveStatus(statusId);
	};
	const handleUserChange = user => {
		setUser(user);
	};

	const handleCancelLeave = project => {
		leaveMutation.mutate({ id: project._id, type: "cancel" });
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const handleRowSelect = rows => {
		setSelectedRows(rows);
	};
	const handleResetFilter = () => {
		setLeaveStatus(undefined);
		setUser(undefined);
	};

	function handleTabChange(key) {
		// if (key === "3") leavesQuery.refetch();
	}

	if (leaveDaysQuery.isLoading) return <CircularProgress />;
	return (
		<Card title="Leave Management System">
			<RemainingAndAppliedLeaveCards
				leavesRemaining={
					leaveDaysQuery?.data?.data?.data?.data[0]?.leavesRemaining
				}
				leavesTaken={leaveDaysQuery?.data?.data?.data?.data[0]?.leavesTaken}
			/>

			<Tabs type="card" onChange={handleTabChange}>
				<TabPane tab="Apply" key="1">
					<LeavesApply />
				</TabPane>
				<TabPane tab="My History" key="2">
					<Table
						className="gx-table-responsive"
						columns={LEAVES_COLUMN(handleCancelLeave)}
						dataSource={formattedUsers(userLeavesQuery?.data?.data?.data?.data)}
						pagination={{
							current: page.page,
							pageSize: page.limit,
							pageSizeOptions: ["5", "10", "20", "50"],
							showSizeChanger: true,
							total: userLeavesQuery?.data?.data?.data?.count || 1,
							onShowSizeChange,
							hideOnSinglePage: true,
							onChange: handlePageChange
						}}
						loading={userLeavesQuery.isFetching || leaveMutation.isLoading}
					/>
				</TabPane>
				<TabPane tab="Leaves" key="3">
					<Leaves
						data={formattedUsers(leavesQuery?.data?.data?.data?.data)}
						status={leaveStatus}
						user={user}
						users={usersQuery?.data?.data?.data?.data?.map(user => ({
							id: user._id,
							value: user.name
						}))}
						selectedRows={selectedRows}
						handleStatusChange={handleStatusChange}
						handleUserChange={handleUserChange}
						handleResetFilter={handleResetFilter}
						handleCancelLeave={handleCancelLeave}
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
						rowSelection={{
							onChange: handleRowSelect,
							selectedRowKeys: selectedRows
						}}
						isLoading={leavesQuery.isFetching || leaveMutation.isLoading}
						isExportDisabled={selectedRows.length === 0}
					/>
				</TabPane>
			</Tabs>
		</Card>
	);
}

export default Leave;
