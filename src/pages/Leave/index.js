import React, { useState } from "react";
import { Card, Tabs } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	changeLeaveStatus,
	getLeavesOfUser,
	getTakenAndRemainingLeaveDaysOfUser
} from "services/leaves";
import {
	formatToUtc,
	getLocalStorageData,
	handleResponse
} from "helpers/utils";
import { notification } from "helpers/notification";
import RemainingAndAppliedLeaveCards from "./RemainingAndAppliedLeaveCards";
import LeavesApply from "./Apply";
import Leaves from "./Leaves";
import CircularProgress from "components/Elements/CircularProgress";
import LeavesCalendar from "./LeavesCalendar";
import { useLocation } from "react-router-dom";
import MyHistory from "./MyHistory";
import moment from "moment";

const TabPane = Tabs.TabPane;

function Leave() {
	const location = useLocation();
	const queryClient = useQueryClient();

	const [selectedRows, setSelectedRows] = useState([]);

	const loggedInUser = getLocalStorageData("user_id");

	const leaveDaysQuery = useQuery(["takenAndRemainingLeaveDays"], () =>
		getTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
	);

	const leaveCancelMutation = useMutation(
		payload => changeLeaveStatus(payload.id, payload.type),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Leave cancelled successfully",
					"Could not cancel leave",
					[
						() => queryClient.invalidateQueries(["userLeaves"]),
						() => queryClient.invalidateQueries(["leaves"])
					]
				),
			onError: error => {
				notification({ message: "Could not cancel leave", type: "error" });
			}
		}
	);

	const handleCancelLeave = leave => {
		leaveCancelMutation.mutate({ id: leave._id, type: "cancel" });
	};

	const handleRowSelect = rows => {
		setSelectedRows(rows);
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

			<Tabs
				type="card"
				defaultActiveKey={location?.state?.tabKey}
				onChange={handleTabChange}
			>
				<TabPane tab="Apply" key="1">
					<LeavesApply user={loggedInUser?._id} />
				</TabPane>
				<TabPane tab="My History" key="2">
					<MyHistory
						userId={loggedInUser?._id}
						handleCancelLeave={handleCancelLeave}
					/>
					{/* <Table
						className="gx-table-responsive"
						columns={LEAVES_COLUMN(handleCancelLeave).filter(
							(item, index) => index !== 0
						)}
						dataSource={formattedLeaves(
							userLeavesQuery?.data?.data?.data?.data
						)}
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
						loading={
							userLeavesQuery.isFetching || leaveCancelMutation.isLoading
						}
					/> */}
				</TabPane>
				{loggedInUser?.role?.value === "Admin" && (
					<>
						<TabPane tab="Leaves" key="3">
							<Leaves
								status={location?.state?.leaveStatus}
								selectedRows={selectedRows}
								handleCancelLeave={handleCancelLeave}
								rowSelection={{
									onChange: handleRowSelect,
									selectedRowKeys: selectedRows
								}}
								isExportDisabled={selectedRows.length === 0}
							/>
						</TabPane>
						<TabPane tab="Leaves Calendar" key="4">
							<LeavesCalendar />
						</TabPane>
					</>
				)}
			</Tabs>
		</Card>
	);
}

export default Leave;
