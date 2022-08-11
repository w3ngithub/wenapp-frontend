import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Table, Tabs } from "antd";
import { LEAVES_COLUMN, STATUS_TYPES } from "constants/Leaves";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	changeLeaveStatus,
	getLeavesOfAllUsers,
	getLeavesOfUser
} from "services/leaves";
import { changeDate, getLocalStorageData, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import IconWithTextCard from "components/Modules/Metrics/IconWithTextCard";
import Select from "components/Elements/Select";
import { CSVLink } from "react-csv";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

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

	const { data, isLoading, isFetching } = useQuery(["userLeaves"], () =>
		getLeavesOfUser(getLocalStorageData("user_id").user._id)
	);

	const leavesQuery = useQuery(["leaves"], getLeavesOfAllUsers, {
		enabled: false
	});
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

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const handleRowSelect = rows => {
		setSelectedRows(rows);
	};

	function handleTabChange(key) {
		if (key === "2") leavesQuery.refetch();
	}
	return (
		<div>
			<Card title="LMS">
				<Row>
					<Col xl={12} sm={12} xs={12} className="gx-col-full">
						<IconWithTextCard
							cardColor="cyan"
							icon="product-list"
							title="7"
							subTitle="Leave Days Remaining"
						/>
					</Col>
					<Col xl={12} sm={12} xs={12} className="gx-col-full">
						<IconWithTextCard
							cardColor="orange"
							icon="tasks"
							title="3"
							subTitle="Leave Days Applied"
						/>
					</Col>
				</Row>
				<Tabs type="card" onChange={handleTabChange}>
					<TabPane tab="History" key="1">
						<div className="components-table-demo-control-bar">
							<Button className="gx-btn gx-btn-primary gx-text-white gx-mt-auto">
								Add Leave
							</Button>
						</div>
						<Table
							className="gx-table-responsive"
							columns={LEAVES_COLUMN(leaveMutation)}
							dataSource={formattedUsers(data?.data?.data?.data)}
							// onChange={handleTableChange}
							// rowSelection={{
							// 	onChange: handleRowSelect,
							// 	selectedRowKeys: selectedRows
							// }}
							pagination={{
								current: page.page,
								pageSize: page.limit,
								pageSizeOptions: ["5", "10", "20", "50"],
								showSizeChanger: true,
								total: data?.data?.data?.count || 1,
								onShowSizeChange,
								hideOnSinglePage: true,
								onChange: handlePageChange
							}}
							loading={isFetching || leaveMutation.isLoading}
						/>
					</TabPane>
					<TabPane tab="Leaves" key="2">
						<div className="components-table-demo-control-bar">
							<div className="gx-d-flex gx-justify-content-between gx-flex-row">
								<Form layout="inline">
									<FormItem>
										<Select
											placeholder="Select Status"
											// onChange={handleRoleChange}
											value={undefined}
											options={STATUS_TYPES}
										/>
									</FormItem>
									<FormItem>
										<Select
											placeholder="Select User"
											value={undefined}
											options={[{ id: 1, value: "hello" }]}

											// onChange={handlePositionChange}
											// value={position}
											// options={positionData?.data?.data?.data?.map(x => ({
											// 	id: x._id,
											// 	value: x.name
											// }))}
										/>
									</FormItem>

									<FormItem>
										<Button
											className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
											// onClick={handleResetFilter}
										>
											Reset
										</Button>
									</FormItem>
								</Form>
								<div>
									<Button className="gx-btn gx-btn-primary gx-text-white gx-mt-auto">
										Add Leave
									</Button>
									<CSVLink
										filename={"co-workers"}
										data={[
											[
												"Name",
												"Email",
												"Role",
												"RoleId",
												"Position",
												"PositionId",
												"DOB",
												"Join Date"
											]
											// ...data?.data?.data?.data
											// 	?.filter(x => selectedRows.includes(x?._id))
											// 	?.map(d => [
											// 		d?.name,
											// 		d?.email,
											// 		d?.role.value,
											// 		d?.role._id,
											// 		d?.position.name,
											// 		d?.position._id,
											// 		changeDate(d?.dob),
											// 		changeDate(d?.joinDate)
											// 	])
										]}
									>
										<Button
											className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
											// disabled={selectedRows.length === 0}
										>
											Export
										</Button>
									</CSVLink>
								</div>
							</div>
						</div>
						<Table
							className="gx-table-responsive"
							columns={LEAVES_COLUMN(leaveMutation, true)}
							dataSource={formattedUsers(data?.data?.data?.data)}
							// onChange={handleTableChange}
							rowSelection={{
								onChange: handleRowSelect,
								selectedRowKeys: selectedRows
							}}
							pagination={{
								current: page.page,
								pageSize: page.limit,
								pageSizeOptions: ["5", "10", "20", "50"],
								showSizeChanger: true,
								total: data?.data?.data?.count || 1,
								onShowSizeChange,
								hideOnSinglePage: true,
								onChange: handlePageChange
							}}
							loading={isFetching || leaveMutation.isLoading}
						/>
					</TabPane>
				</Tabs>
			</Card>
		</div>
	);
}

export default Leave;
