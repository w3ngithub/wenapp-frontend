import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Radio, Select, Input, Button } from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";
import {
	getAllUsers,
	getUserPosition,
	getUserRoles,
	updateUser
} from "services/users/userDetails";
import UserDetailForm from "components/Modules/UserDetailModal";
import { CO_WORKERCOLUMNS } from "constants/CoWorkers";
import CircularProgress from "components/Elements/CircularProgress";
import { changeDate } from "helpers/utils";
import ImportUser from "./ImportUsers";

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

function CoworkersPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [activeUser, setActiveUser] = useState("");
	const [position, setPosition] = useState(undefined);
	const [role, setRole] = useState(undefined);
	const [name, setName] = useState("");
	const [userRecord, setUserRecord] = useState({});
	const queryClient = useQueryClient();
	const [readOnly, setReadOnly] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [openImport, setOpenImport] = useState(false);
	const [files, setFiles] = useState([]);

	const activeUserRef = useRef("");
	const nameRef = useRef("");

	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id"));

	const { data: roleData } = useQuery(["userRoles"], getUserRoles);
	const { data: positionData } = useQuery(["userPositions"], getUserPosition);
	const { data, isLoading, isError, isFetching } = useQuery(
		["users", page, activeUser, role, position, name],
		() => getAllUsers({ ...page, active: activeUser, role, position, name }),
		{ keepPreviousData: true }
	);

	const mutation = useMutation(
		updatedUser => updateUser(updatedUser.userId, updatedUser.updatedData),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["users"]);
				setOpenUserDetailModal(prev => false);
				setReadOnly(false);
			}
		}
	);

	const handleToggleModal = (userRecordToUpdate, mode) => {
		setOpenUserDetailModal(prev => !prev);
		setUserRecord(userRecordToUpdate);
		setReadOnly(mode);
	};

	const handleUserDetailSubmit = (user, reset) => {
		const userTofind = data.data.data.data.find(x => x._id === user._id);
		mutation.mutate({
			userId: user._id,
			updatedData: {
				...user,
				dob: user.dob ? userTofind.dob : undefined,
				joinDate: user.joinDate ? userTofind.joinDate : undefined,
				lastReviewDate: user.lastReviewDate
					? moment.utc(user.lastReviewDate).format()
					: undefined,
				exitDate: user.exitDate ? moment.utc(user.exitDate).format() : undefined
			}
		});
		reset.form.resetFields();
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
		setSelectedRows([]);
		nameRef.current.input.state.value = "";
		activeUserRef.current.state.value = undefined;
	};

	const handleRowSelect = rows => {
		setSelectedRows(rows);
	};

	const handleImportUser = () => {};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<ImportUser
				toggle={openImport}
				onSubmit={handleImportUser}
				onClose={() => setOpenImport(false)}
				files={files}
				setFiles={setFiles}
			/>
			<UserDetailForm
				toggle={openUserDetailModal}
				onToggleModal={handleToggleModal}
				onSubmit={handleUserDetailSubmit}
				loading={mutation.isLoading}
				roles={roleData}
				position={positionData}
				intialValues={userRecord}
				readOnly={readOnly}
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
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
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
						<div>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={() => setOpenImport(true)}
							>
								Import
							</Button>
							<CSVLink
								filename={"co-workers"}
								data={[
									["Name", "Role", "Position", "DOB", "Email"],
									...data?.data?.data?.data
										?.filter(x => selectedRows.includes(x._id))
										.map(d => [
											d?.name,
											d?.role.value,
											d?.position.name,
											d?.dob,
											d?.email
										])
								]}
							>
								<Button
									className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
									disabled={selectedRows.length === 0}
								>
									Export
								</Button>
							</CSVLink>
						</div>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={CO_WORKERCOLUMNS(sort, handleToggleModal, mutation)}
					dataSource={formattedUsers(
						data.data.data.data,
						user.role.key === "admin"
					)}
					onChange={handleTableChange}
					rowSelection={{
						onChange: handleRowSelect,
						selectedRowKeys: selectedRows
					}}
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
					loading={mutation.isLoading || isFetching}
				/>
			</Card>
		</div>
	);
}

export default CoworkersPage;
