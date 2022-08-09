import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Table, Form, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { getProjectClients, getProjectStatus } from "services/projects";
import { useNavigate } from "react-router-dom";
import { notification } from "helpers/notification";
import { getLogTypes, getWeeklyReport } from "services/timeLogs";
import Select from "components/Elements/Select";
import { WEEKLY_REPORT_COLUMNS } from "constants/weeklyReport";

const FormItem = Form.Item;

const formattedProjects = (reports, clients) => {
	return reports?.map(report => ({
		key: report?.project?.[0]?._id,
		name: report?.project?.[0]?.name,
		client: clients[report?.project?.[0]?.client] || "",
		timeSpent: report?.timeSpent
	}));
};

function ProjectsPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [projectStatus, setProjectStatus] = useState(undefined);
	const [logType, setLogType] = useState(undefined);
	const [projectClient, setprojectClient] = useState(undefined);

	const navigate = useNavigate();

	const { data: logTypesData } = useQuery(["logTypes"], getLogTypes);
	const { data: projectStatusData } = useQuery(
		["projectStatus"],
		getProjectStatus
	);
	const { data: projectClientsData } = useQuery(
		["projectClients"],
		getProjectClients
	);
	const { data, isLoading, isError, isFetching } = useQuery(
		["projects", page, logType, projectStatus, projectClient],
		() =>
			getWeeklyReport({
				...page,
				logType,
				projectStatus,
				client: projectClient
			}),
		{ keepPreviousData: true }
	);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Weekly Report!", type: "error" });
		}
	}, [isError]);

	const handleTableChange = (pagination, filters, sorter) => {
		setSort(sorter);
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handleLogTypeChange = typeId => {
		setLogType(typeId);
	};

	const handleProjectStatusChange = statusId => {
		setProjectStatus(statusId);
	};

	const handleClientChange = clientId => {
		setprojectClient(clientId);
	};

	const handleResetFilter = () => {
		setLogType(undefined);
		setProjectStatus(undefined);
		setprojectClient(undefined);
	};

	const navigateToProjectLogs = projectSlug => {
		navigate(`${projectSlug}`);
	};

	const clients = useMemo(() => {
		return projectClientsData?.data?.data?.data?.reduce((obj, client) => {
			obj[client._id] = client.name;
			return obj;
		}, {});
	}, [projectClientsData]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<Card title="Weekly Report">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline">
							<FormItem>
								<Select
									placeholder="Select Project Status"
									onChange={handleProjectStatusChange}
									value={projectStatus}
									options={projectStatusData?.data?.data?.data?.map(x => ({
										...x,
										id: x._id,
										value: x.name
									}))}
								/>
							</FormItem>
							<FormItem>
								<Select
									placeholder="Select Log Type"
									onChange={handleLogTypeChange}
									value={logType}
									options={logTypesData?.data?.data?.data?.map(x => ({
										...x,
										id: x._id,
										value: x.name
									}))}
								/>
							</FormItem>
							<FormItem>
								<Select
									placeholder="Select Client"
									onChange={handleClientChange}
									value={projectClient}
									options={projectClientsData?.data?.data?.data?.map(x => ({
										...x,
										id: x._id,
										value: x.name
									}))}
								/>
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
					columns={WEEKLY_REPORT_COLUMNS(
						sort,

						navigateToProjectLogs
					)}
					dataSource={formattedProjects(data?.data?.data?.report, clients)}
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
					loading={isLoading || isFetching}
				/>
			</Card>
		</div>
	);
}

export default ProjectsPage;
