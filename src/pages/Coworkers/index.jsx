import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Table, Form, Switch, Radio } from "antd";
import { getAllUsers } from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";
import { CO_WORKERCOLUMNS } from "constants/CoWorkers";
import CircularProgress from "components/Elements/CircularProgress";

const FormItem = Form.Item;

const formattedUsers = (users, isAdmin) => {
	return users.map(user => ({
		...user,
		key: user._id,
		dob: changeDate(user.dob),
		joinDate: changeDate(user.joinDate),
		isAdmin
	}));
};

function changeDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${dd}/${mm}/${yyyy}`;
}

function CoworkersPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [activeUser, setActiveUser] = useState(true);

	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id"));

	const { data, isLoading, isError } = useQuery(
		["users", page],
		() => getAllUsers(page),
		{ keepPreviousData: true }
	);

	const handleToggleModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleUserDetailSubmit = user => {
		console.log(user);
	};

	const handleTableChange = (pagination, filters, sorter) => {
		setSort(sorter);
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const setActiveInActiveUsers = e => {
		setActiveUser(e.target.value === "active" ? true : false);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<UserDetailForm
				toggle={openUserDetailModal}
				onToggleModal={handleToggleModal}
				onSubmit={handleUserDetailSubmit}
			/>
			<Card title="Co-workers">
				<div className="components-table-demo-control-bar">
					<Form layout="inline">
						<FormItem label="">
							<Radio.Group
								buttonStyle="solid"
								onChange={setActiveInActiveUsers}
							>
								<Radio.Button value="active">Active</Radio.Button>
								<Radio.Button value="inactive">Inactive</Radio.Button>
							</Radio.Group>
						</FormItem>
					</Form>
				</div>
				<Table
					className="gx-table-responsive"
					columns={CO_WORKERCOLUMNS(sort, handleToggleModal)}
					dataSource={formattedUsers(
						data.data.data.data,
						user.role.key === "admin"
					)}
					onChange={handleTableChange}
					rowSelection={{}}
					pagination={{
						current: page.page,
						pageSize: page.limit,
						pageSizeOptions: ["5", "10", "20", "50"],
						showSizeChanger: true,
						total: 20,
						onShowSizeChange,
						hideOnSinglePage: true,
						onChange: handlePageChange
					}}
					loading={isLoading}
				/>
			</Card>
		</div>
	);
}

export default CoworkersPage;
