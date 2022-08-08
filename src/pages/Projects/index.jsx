import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Select, Input, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { changeDate } from "helpers/utils";
import {
	addProject,
	deleteProject,
	getAllProjects,
	getProjectClients,
	getProjectStatus,
	getProjectTypes,
	updateProject
} from "services/projects";
import { PROJECT_COLUMNS } from "constants/Projects";
import ProjectModal from "components/Modules/ProjectModal";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

const formattedProjects = projects => {
	return projects?.map(project => ({
		...project,
		key: project._id,
		projectStatus: project.projectStatus.name,
		projectTypes: project.projectTypes[0].name,
		startDate: changeDate(project.startDate),
		endDate: project?.endDate ? changeDate(project?.endDate) : ""
	}));
};

function ProjectsPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [project, setProject] = useState("");
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [projectStatus, setProjectStatus] = useState(undefined);
	const [projectType, setProjectType] = useState(undefined);
	const [projectClient, setprojectClient] = useState(undefined);
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [userRecord, setUserRecord] = useState({});
	const [readOnly, setReadOnly] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const projectRef = useRef("");

	const { data: projectTypesData } = useQuery(
		["projectTypes"],
		getProjectTypes
	);
	const { data: projectStatusData } = useQuery(
		["projectStatus"],
		getProjectStatus
	);
	const { data: projectClientsData } = useQuery(
		["projectClients"],
		getProjectClients
	);
	const { data, isLoading, isError, isFetching } = useQuery(
		["projects", page, projectType, projectStatus, projectClient, project],
		() =>
			getAllProjects({
				...page,
				projectType,
				projectStatus,
				projectClient,
				project
			}),
		{ keepPreviousData: true }
	);

	const addProjectMutation = useMutation(project => addProject(project), {
		onSuccess: () => {
			queryClient.invalidateQueries(["projects"]);
			handleCloseModal();
		}
	});
	const updateProjectMutation = useMutation(
		project => updateProject(project.id, project.details),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["projects"]);
				handleCloseModal();
			}
		}
	);

	const deleteProjectMutation = useMutation(
		projectId => deleteProject(projectId),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["projects"]);
			}
		}
	);

	const handleUserDetailSubmit = (project, reset) => {
		const updatedProject = {
			...project,
			estimatedHours: project.estimatedHours
				? +project.estimatedHours
				: undefined,
			startDate: project.startDate
				? moment.utc(project.startDate).format()
				: undefined,
			endDate: project.endDate
				? moment.utc(project.endDate).format()
				: undefined
		};
		if (isEditMode)
			updateProjectMutation.mutate({
				id: userRecord.id,
				details: updatedProject
			});
		else addProjectMutation.mutate(updatedProject);
		reset.form.resetFields();
	};

	const handleOpenEditModal = (projectToUpdate, mode) => {
		const originalProject = data?.data?.data?.data.find(
			project => project.id === projectToUpdate.id
		);
		setOpenUserDetailModal(prev => !prev);
		setUserRecord({
			id: projectToUpdate.id,
			project: {
				...projectToUpdate,
				projectStatus: originalProject.projectStatus,
				projectTypes: originalProject.projectTypes,
				startDate: originalProject.startDate ?? null,
				endDate: originalProject.endDate ?? null
			}
		});
		setReadOnly(mode);
		setIsEditMode(true);
	};

	const handleOpenAddModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleCloseModal = () => {
		setOpenUserDetailModal(prev => !prev);
		setUserRecord({});
		setIsEditMode(false);
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

	const handleProjectTypeChange = typeId => {
		setProjectType(typeId);
	};

	const handleProjectStatusChange = statusId => {
		setProjectStatus(statusId);
	};

	const handleClientChange = clientId => {
		setprojectClient(clientId);
	};

	const handleResetFilter = () => {
		setProject("");
		setProjectType(undefined);
		setProjectStatus(undefined);
		setprojectClient(undefined);
		projectRef.current.input.state.value = "";
	};

	const confirmDeleteProject = project => {
		deleteProjectMutation.mutate(project._id);
	};

	const navigateToProjectLogs = projectSlug => {
		navigate(`${projectSlug}`);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<ProjectModal
				toggle={openUserDetailModal}
				onClose={handleCloseModal}
				onSubmit={handleUserDetailSubmit}
				loading={
					addProjectMutation.isLoading || updateProjectMutation.isLoading
				}
				types={projectTypesData}
				statuses={projectStatusData}
				// developer={developer}
				// designer={designer}
				// qa={qa}
				initialValues={userRecord.project}
				readOnly={readOnly}
				isEditMode={isEditMode}
			/>
			<Card title="Projects">
				<div className="components-table-demo-control-bar">
					<Search
						placeholder="Search Projects"
						onSearch={value => setProject(value)}
						style={{ width: 200 }}
						enterButton
						ref={projectRef}
					/>
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline">
							<FormItem>
								<Select
									placeholder="Select Project Type"
									style={{ width: 200 }}
									onChange={handleProjectTypeChange}
									value={projectType}
								>
									{projectTypesData &&
										projectTypesData.data?.data?.data?.map(type => (
											<Option value={type._id} key={type._id}>
												{type.name}
											</Option>
										))}
								</Select>
							</FormItem>
							<FormItem>
								<Select
									placeholder="Select Project Status"
									style={{ width: 200 }}
									onChange={handleProjectStatusChange}
									value={projectStatus}
								>
									{projectStatusData &&
										projectStatusData.data.data?.data?.map(status => (
											<Option value={status._id} key={status._id}>
												{status.name}
											</Option>
										))}
								</Select>
							</FormItem>
							<FormItem>
								<Select
									placeholder="Select Client"
									style={{ width: 200 }}
									onChange={handleClientChange}
									value={projectClient}
								>
									{projectClientsData &&
										projectClientsData.data?.data?.data?.map(client => (
											<Option value={client._id} key={client._id}>
												{client.name}
											</Option>
										))}
								</Select>
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
						<Button
							className="gx-btn gx-btn-primary gx-text-white "
							onClick={handleOpenAddModal}
						>
							Add New Project
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={PROJECT_COLUMNS(
						sort,
						handleOpenEditModal,
						confirmDeleteProject,
						navigateToProjectLogs
					)}
					dataSource={formattedProjects(data?.data?.data?.data)}
					onChange={handleTableChange}
					pagination={{
						current: page.page,
						pageSize: page.limit,
						pageSizeOptions: ["5", "10", "20", "50"],
						showSizeChanger: true,
						total: 15,
						onShowSizeChange,
						hideOnSinglePage: true,
						onChange: handlePageChange
					}}
					loading={isLoading || isFetching || deleteProjectMutation.isLoading}
				/>
			</Card>
		</div>
	);
}

export default ProjectsPage;
