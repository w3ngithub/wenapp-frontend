import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Radio, Select, Input, Button } from "antd";
import {
	getUserPosition,
	getUserRoles,
	updateUser
} from "services/users/userDetails";
import CircularProgress from "components/Elements/CircularProgress";
import { changeDate } from "helpers/utils";
import { getAllProjects } from "services/projects";
import { PROJECT_COLUMNS } from "constants/Projects";

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

const formattedProjects = (projects, isAdmin) => {
	return projects.map(project => ({
		...project,
		key: project._id,
		projectStatus: project.projectStatus.name,
		projectTypes: project.projectTypes[0].name,
		startDate: changeDate(project.startDate),
		endDate: project?.endDate ? changeDate(project?.endDate) : "",
		isAdmin
	}));
};

function CoworkersPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [activeUser, setActiveUser] = useState("");
	const [position, setPosition] = useState(undefined);
	const [role, setRole] = useState(undefined);
	const [name, setName] = useState("");
	const queryClient = useQueryClient();

	const activeUserRef = useRef("");
	const nameRef = useRef("");

	// get user detail from storage
	const { user } = JSON.parse(localStorage.getItem("user_id") || "{}");

	const { data: roleData } = useQuery(["userRoles"], getUserRoles);
	const { data: positionData } = useQuery(["userPositions"], getUserPosition);
	const { data, isLoading, isError, isFetching } = useQuery(
		["projects", page, activeUser, role, position, name],
		() => getAllProjects({ ...page, active: activeUser, role, position, name }),
		{ keepPreviousData: true }
	);

	const mutation = useMutation(
		updatedUser => updateUser(updatedUser.userId, updatedUser.updatedData),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["users"]);
			}
		}
	);

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
			<Card title="Projects">
				<div className="components-table-demo-control-bar">
					<Search
						placeholder="Search Projects"
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
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={PROJECT_COLUMNS(sort, null, mutation)}
					dataSource={formattedProjects(
						data.data.data.data,
						user.role.key === "admin"
					)}
					onChange={handleTableChange}
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
