import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Radio, Select, Input, Button } from "antd";
import {
	getAllUsers,
	getUserPosition,
	getUserRoles,
	updateUser
} from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";
import { CO_WORKERCOLUMNS } from "constants/CoWorkers";
import CircularProgress from "components/Elements/CircularProgress";

const Search = Input.Search;
const Option = Select.Option;
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
	const [activeUser, setActiveUser] = useState("");
	const [position, setPosition] = useState(undefined);
	const [role, setRole] = useState(undefined);
	const [name, setName] = useState("");
	const queryClient = useQueryClient();

	const activeUserRef = useRef("");
	const nameRef = useRef("");

	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id"));

	const { data, isLoading, isError } = useQuery(
		["users", page, activeUser, role, position, name],
		() => getAllUsers({ ...page, active: activeUser, role, position, name }),
		{ keepPreviousData: true }
	);

	const { data: roleData } = useQuery(["userRoles"], getUserRoles);
	const { data: positionData } = useQuery(["userPositions"], getUserPosition);

	const mutation = useMutation(
		updatedUser => updateUser(updatedUser.userId, updatedUser.updatedData),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["users"]);
			}
		}
	);

	// // api call to make active/inactive user
	// const makeUserActiveInactive = () => {

	// };

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

	const handleRoleChange = roleId => {
		setRole(roleId);
	};

	const handlePositionChange = positionId => {
		setPosition(positionId);
	};

	const handleResetFilter = () => {
		setName("");
		setRole(undefined);
		setPosition(undefined);
		setActiveUser("");
		nameRef.current.input.state.value = "";
		activeUserRef.current.state.value = undefined;
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
					<Search
						placeholder="Search Users"
						onSearch={value => setName(value)}
						style={{ width: 200 }}
						enterButton
						ref={nameRef}
					/>
					<Form layout="inline">
						<FormItem>
							<Select
								placeholder="Select Role"
								style={{ width: 200 }}
								onChange={handleRoleChange}
								value={role}
							>
								{roleData &&
									roleData.data.data.data.map(role => (
										<Option value={role._id} key={role._id}>
											{role.value}
										</Option>
									))}
							</Select>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select Position"
								style={{ width: 200 }}
								onChange={handlePositionChange}
								value={position}
							>
								{positionData &&
									positionData.data.data.data.map(position => (
										<Option value={position._id} key={position._id}>
											{position.name}
										</Option>
									))}
							</Select>
						</FormItem>
						<FormItem>
							<Radio.Group
								buttonStyle="solid"
								onChange={setActiveInActiveUsers}
								ref={activeUserRef}
							>
								<Radio.Button value="active">Active</Radio.Button>
								<Radio.Button value="inactive">Inactive</Radio.Button>
							</Radio.Group>
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
				</div>
				<Table
					className="gx-table-responsive"
					columns={CO_WORKERCOLUMNS(sort, handleToggleModal, mutation)}
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
						total: 25,
						onShowSizeChange,
						hideOnSinglePage: true,
						onChange: handlePageChange
					}}
					loading={mutation.isLoading}
				/>
			</Card>
		</div>
	);
}

export default CoworkersPage;
