import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Card, Table, Select, Input, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { changeDate, filterOptions, handleResponse } from "helpers/utils";
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
import { notification } from "helpers/notification";
import { getAllUsers } from "services/users/userDetails";

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

const formattedProjects = projects => {
	return projects?.map(project => ({
		...project,
		key: project._id,
		projectStatus: project.projectStatus?.name,
		projectTypes: project.projectTypes?.[0]?.name,
		startDate: changeDate(project?.startDate),
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
	const [developer, setDeveloper] = useState(undefined);
	const [designer, setDesigner] = useState(undefined);
	const [qa, setQa] = useState(undefined);
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [userRecord, setUserRecord] = useState({});
	const [readOnly, setReadOnly] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

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
	const { data: developers } = useQuery(["developers"], () =>
		getAllUsers({ positionType: "62ff3e6b7582860104c727f3" })
	);
	const { data: designers } = useQuery(["designers"], () =>
		getAllUsers({ positionType: "62ff3c816275a483c8e69048" })
	);
	const { data: QAs } = useQuery(["QA"], () =>
		getAllUsers({ positionType: "62ff3c796275a483c8e69042" })
	);
	const { data: devops } = useQuery(["DevOps"], () =>
		getAllUsers({ positionType: "62ff3cb46275a483c8e69050" })
	);
	const { data, isLoading, isError, isFetching } = useQuery(
		[
			"projects",
			page,
			projectType,
			projectStatus,
			projectClient,
			project,
			developer,
			designer,
			qa
		],
		() =>
			getAllProjects({
				...page,
				projectType,
				projectStatus,
				projectClient,
				project,
				developer,
				designer,
				qa
			}),
		{ keepPreviousData: true }
	);

	const addProjectMutation = useMutation(project => addProject(project), {
		onSuccess: response =>
			handleResponse(
				response,
				"Project Added Successfully",
				"Project addition failed",
				[
					() => queryClient.invalidateQueries(["projects"]),
					() => handleCloseModal()
				]
			),
		onError: error => {
			notification({ message: "Project addition failed!", type: "error" });
		}
	});
	const updateProjectMutation = useMutation(
		project => updateProject(project.id, project.details),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Project Updated Successfully",
					"Project update failed",
					[
						() => queryClient.invalidateQueries(["projects"]),
						() => handleCloseModal()
					]
				),
			onError: error => {
				notification({ message: "Project update failed", type: "error" });
			}
		}
	);

	const deleteProjectMutation = useMutation(
		projectId => deleteProject(projectId),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Project removed Successfully",
					"Project deletion failed",
					[() => queryClient.invalidateQueries(["projects"])]
				),
			onError: error => {
				notification({ message: "Project deletion failed", type: "error" });
			}
		}
	);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Projects!", type: "error" });
		}
	}, [isError]);

	const handleUserDetailSubmit = project => {
		try {
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
					: undefined,
				maintenance: [
					{
						monthly: project.monthly,
						selectMonths: project.selectMonth,
						emailDay: +project.emailDay,
						sendEmailTo: project.sendEmailTo
					}
				]
			};
			if (isEditMode) console.log(updatedProject);
			// updateProjectMutation.mutate({
			// 	id: userRecord.id,
			// 	details: updatedProject
			// });
			else addProjectMutation.mutate(updatedProject);
		} catch (error) {
			notification({ message: "Project Addition Failed", type: "error" });
		}
	};

	const handleOpenEditModal = (projectToUpdate, mode) => {
		const originalProject = data?.data?.data?.data?.find(
			project => project.id === projectToUpdate.id
		);
		setOpenUserDetailModal(prev => !prev);
		setUserRecord({
			id: projectToUpdate.id,
			project: {
				...projectToUpdate,
				projectStatus: originalProject?.projectStatus,
				projectTypes: originalProject?.projectTypes,
				startDate: originalProject.startDate ?? null,
				endDate: originalProject.endDate ?? null
			}
		});
		setReadOnly(mode);
		setIsEditMode(true);
	};

	const handleOpenAddModal = () => {
		setOpenUserDetailModal(prev => !prev);
		setReadOnly(false);
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
	const handleDeveloperChange = developerId => {
		setDeveloper(developerId);
	};
	const handleDesignerChange = designerId => {
		setDesigner(designerId);
	};
	const handleQaChange = qaId => {
		setQa(qaId);
	};

	const handleResetFilter = () => {
		setProject("");
		setProjectType(undefined);
		setProjectStatus(undefined);
		setprojectClient(undefined);
		setDeveloper(undefined);
		setDesigner(undefined);
		setQa(undefined);
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
				developers={developers}
				designers={designers}
				qas={QAs}
				devops={devops}
				initialValues={userRecord.project}
				readOnly={readOnly}
				isEditMode={isEditMode}
			/>

			<Card title="Projects">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Search
							placeholder="Search Projects"
							onSearch={value => {
								setPage(prev => ({ ...prev, page: 1 }));
								setProject(value);
							}}
							style={{ width: 200 }}
							enterButton
						/>
						<Button
							className="gx-btn gx-btn-primary gx-text-white "
							onClick={handleOpenAddModal}
						>
							Add New Project
						</Button>
					</div>
					<Form layout="inline" className="gx-d-flex gx-flex-row gx-row-gap-10">
						<FormItem>
							<Select
								placeholder="Select Project Type"
								style={{ width: 200 }}
								onChange={handleProjectTypeChange}
								value={projectType}
								showSearch
								filterOption={filterOptions}
							>
								{projectTypesData &&
									projectTypesData?.data?.data?.data?.map(type => (
										<Option value={type._id} key={type._id}>
											{type?.name}
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
								showSearch
								filterOption={filterOptions}
							>
								{projectStatusData &&
									projectStatusData?.data?.data?.data?.map(status => (
										<Option value={status._id} key={status._id}>
											{status?.name}
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
								showSearch
								filterOption={filterOptions}
							>
								{projectClientsData &&
									projectClientsData?.data?.data?.data?.map(client => (
										<Option value={client._id} key={client._id}>
											{client?.name}
										</Option>
									))}
							</Select>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select Developer"
								style={{ width: 200 }}
								onChange={handleDeveloperChange}
								value={developer}
								showSearch
								filterOption={filterOptions}
							>
								{developers &&
									developers?.data?.data?.data?.map(developer => (
										<Option value={developer._id} key={developer._id}>
											{developer?.name}
										</Option>
									))}
							</Select>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select Designer"
								style={{ width: 200 }}
								onChange={handleDesignerChange}
								value={designer}
								showSearch
								filterOption={filterOptions}
							>
								{designers &&
									designers?.data?.data?.data?.map(developer => (
										<Option value={developer._id} key={developer._id}>
											{developer?.name}
										</Option>
									))}
							</Select>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select QA"
								style={{ width: 200 }}
								onChange={handleQaChange}
								value={qa}
								showSearch
								filterOption={filterOptions}
							>
								{QAs &&
									QAs?.data?.data?.data?.map(developer => (
										<Option value={developer._id} key={developer._id}>
											{developer?.name}
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
						total: data?.data?.data?.count || 1,
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
