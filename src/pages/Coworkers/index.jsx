import "@ant-design/compatible/assets/index.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Radio, Table } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import UserDetailForm from "components/Modules/UserDetailModal";
import { CO_WORKERCOLUMNS } from "constants/CoWorkers";
import { notification } from "helpers/notification";
import { changeDate, handleResponse } from "helpers/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import {
	getAllUsers,
	getUserPosition,
	getUserPositionTypes,
	getUserRoles,
	updateUser
} from "services/users/userDetails";
import ImportUsers from "./ImportUsers";
import Select from "components/Elements/Select";
import useWindowsSize from "hooks/useWindowsSize";

const Search = Input.Search;
const FormItem = Form.Item;

const formattedUsers = (users, isAdmin) => {
	return users?.map(user => ({
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
	const [defaultUser, setDefaultUser] = useState("");
	const [position, setPosition] = useState(undefined);
	const [role, setRole] = useState(undefined);
	const [name, setName] = useState("");
	const [typedName, setTypedName] = useState("");
	const [userRecord, setUserRecord] = useState({});
	const [readOnly, setReadOnly] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [openImport, setOpenImport] = useState(false);
	const [files, setFiles] = useState([]);
	const queryClient = useQueryClient();

	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id"));
	const {innerWidth} = useWindowsSize()
	const [form] = Form.useForm();

	const { data: roleData } = useQuery(["userRoles"], getUserRoles);
	const { data: positionData } = useQuery(["userPositions"], getUserPosition);
	const { data: positionTypes } = useQuery(
		["userPositionTypes"],
		getUserPositionTypes
	);
	const { data, isLoading, isFetching, isError } = useQuery(
		["users", page, activeUser, role, position, name],
		() => getAllUsers({ ...page, active: activeUser, role, position, name }),
		{
			keepPreviousData: true
		}
	);

	const mutation = useMutation(
		updatedUser => updateUser(updatedUser.userId, updatedUser.updatedData),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"User Updated Successfully",
					"Could not update User",
					[
						() => queryClient.invalidateQueries(["users"]),
						() => setOpenUserDetailModal(false)
					]
				),
			onError: error => {
				notification({ message: "Could not update User", type: "error" });
			}
		}
	);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Users!", type: "error" });
		}
	}, [isError]);

	const handleToggleModal = (userRecordToUpdate, mode) => {
		setOpenUserDetailModal(prev => !prev);
		setUserRecord(userRecordToUpdate);
		setReadOnly(mode);
	};

	const handleUserDetailSubmit = user => {
		try {
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
					exitDate: user.exitDate
						? moment.utc(user.exitDate).format()
						: undefined
				}
			});
		} catch (error) {
			notification({ message: "Could not update User!", type: "error" });
		}
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
		setDefaultUser(e.target.value);
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
		setTypedName("");
		setRole(undefined);
		setPosition(undefined);
		setActiveUser("");
		setDefaultUser("");
		setSelectedRows([]);
	};

	const handleRowSelect = rows => {
		setSelectedRows(rows);
	};


	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<div>
			<ImportUsers
				toggle={openImport}
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
				positionTypes={positionTypes}
				intialValues={userRecord}
				readOnly={readOnly}
			/>
			<Card title="Co-workers">
				<div className="components-table-demo-control-bar">
					<Search
						allowClear
						placeholder="Search Co-workers"
						onSearch={value => {
							setPage(prev => ({ ...prev, page: 1 }));
							setName(value);
						}}
						onChange={e => setTypedName(e.target.value)}
						value={typedName}
						enterButton
						className="direct-form-item"
					/>
					<div className="gx-d-flex gx-justify-content-between gx-flex-row " >
						<Form layout="inline" form={form}>
							<FormItem className="direct-form-item margin-1r">
								<Select
									placeholder="Select Role"
									onChange={handleRoleChange}
									value={role}
									options={roleData?.data?.data?.data?.map(x => ({
										...x,
										id: x._id
									}))}
								/>
							</FormItem>
							<FormItem className="direct-form-item ">
								<Select
									placeholder="Select Position"
									className="margin-1r"
									onChange={handlePositionChange}
									value={position}
									options={positionData?.data?.data?.data?.map(x => ({
										id: x._id,
										value: x.name
									}))}
								/>
							</FormItem>
								<FormItem style={{marginBottom: '6px'}}>
									<Radio.Group
										buttonStyle="solid"
										value={defaultUser}
										onChange={setActiveInActiveUsers}
										id="radio"
									>
										<Radio.Button value="active">Active</Radio.Button>
										<Radio.Button value="inactive">Inactive</Radio.Button>
									</Radio.Group>
								</FormItem>
							<FormItem style={{marginBottom: '1px'}}>
								<Button
									className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
									onClick={handleResetFilter}
								>
									Reset
								</Button>
							</FormItem>
						</Form>
						<div style={{marginBottom: '4px'}}>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={() => setOpenImport(true)}
							>
								Import
							</Button>
							{data?.status && (
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
										],
										...data?.data?.data?.data
											?.filter(x => selectedRows.includes(x?._id))
											?.map(d => [
												d?.name,
												d?.email,
												d?.role.value,
												d?.role._id,
												d?.position.name,
												d?.position._id,
												changeDate(d?.dob),
												changeDate(d?.joinDate)
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
							)}
						</div>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={CO_WORKERCOLUMNS(sort, handleToggleModal, mutation)}
					dataSource={formattedUsers(
						data?.data?.data?.data,
						user?.role?.key === "admin"
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
						total: data?.data?.data?.count || 1,
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
