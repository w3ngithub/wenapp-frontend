import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import '@ant-design/compatible/assets/index.css';
import { Card, Table, Select, Button, Form } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import LogTimeModal from "components/Modules/LogtimeModal";
import { LOGTIMES_COLUMNS } from "constants/logTimes";
import {
	changeDate,
	filterOptions,
	roundedToFixed,
	handleResponse
} from "helpers/utils";
import { notification } from "helpers/notification";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "services/projects";
import {
	addLogTime,
	deleteTimeLog,
	getAllTimeLogs,
	getLogTypes,
	updateTimeLog
} from "services/timeLogs";
import LogsBreadCumb from "./LogsBreadCumb";
import TimeSummary from "./TimeSummary";

const Option = Select.Option;
const FormItem = Form.Item;

const formattedLogs = logs => {
	return logs?.map(log => ({
		...log,
		key: log?._id,
		logType: log?.logType?.name,
		logDate: changeDate(log?.logDate),
		user: log?.user?.name
	}));
};

function ProjectLogs() {
	// init hooks
	const { slug } = useParams();
	const queryClient = useQueryClient();
	const [form] = Form.useForm()

	// init states
	const [sort, setSort] = useState({});
	const [logType, setLogType] = useState(undefined);
	const [author, setAuthor] = useState(undefined);
	const [openModal, setOpenModal] = useState(false);
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [timeLogToUpdate, setTimelogToUpdate] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);

	const [projectId] = slug.split("-");

	const { data: projectDetail } = useQuery(["singleProject", projectId], () =>
		getProject(projectId)
	);

	const { data: logTypes } = useQuery(["logTypes", projectId], () =>
		getLogTypes()
	);

	const {
		data: logTimeDetails,
		isLoading: timelogLoading,
		isFetching: timeLogFetching
	} = useQuery(
		["timeLogs", page, projectId, logType, author],
		() =>
			getAllTimeLogs({
				...page,
				logType,
				project: projectId,
				user: author
			}),
		{ keepPreviousData: true }
	);

	const addLogTimeMutation = useMutation(details => addLogTime(details), {
		onSuccess: response =>
			handleResponse(
				response,
				"Added time log successfully",
				"Could not add time log",
				[
					() => queryClient.invalidateQueries(["timeLogs"]),
					() => queryClient.invalidateQueries(["singleProject"]),
					() => handleCloseTimelogModal()
				]
			),

		onError: () =>
			notification({
				message: "Could not add time log!",
				type: "error"
			})
	});

	const UpdateLogTimeMutation = useMutation(details => updateTimeLog(details), {
		onSuccess: response =>
			handleResponse(
				response,
				"Updated time log successfully",
				"Could not update time log",
				[
					() => queryClient.invalidateQueries(["timeLogs"]),
					() => queryClient.invalidateQueries(["singleProject"]),
					() => handleCloseTimelogModal()
				]
			),

		onError: () =>
			notification({
				message: "Could not update time log!",
				type: "error"
			})
	});

	const deleteLogMutation = useMutation(logId => deleteTimeLog(logId), {
		onSuccess: response =>
			handleResponse(
				response,
				"Deleted successfully",
				"Could not delete time log",
				[
					() => queryClient.invalidateQueries(["timeLogs"]),
					() => queryClient.invalidateQueries(["singleProject"])
				]
			),

		onError: () =>
			notification({
				message: "Could not delete time log!",
				type: "error"
			})
	});

	const handleTableChange = (pagination, filters, sorter) => {
		setSort(sorter);
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handlelogTypeChange = log => {
		setLogType(log);
	};

	const handleAuthorChange = logAuthor => {
		setAuthor(logAuthor);
	};

	const handleResetFilter = () => {
		setLogType(undefined);
		setAuthor(undefined);
	};

	const handleOpenAddModal = () => {
		setOpenModal(true);
	};

	const handleOpenEditModal = log => {
		const originalTimelog = logTimeDetails?.data?.data?.data.find(
			project => project.id === log.id
		);
		setTimelogToUpdate({
			...log,
			logDate: originalTimelog?.logDate,
			logType: originalTimelog?.logType,
			user: originalTimelog?.user
		});
		setOpenModal(true);
		setIsEditMode(true);
	};

	const handleCloseTimelogModal = () => {
		setOpenModal(false);
		setTimelogToUpdate({});
		setIsEditMode(false);
	};

	const confirmDelete = log => {
		deleteLogMutation.mutate(log._id);
	};

	const handleLogTypeSubmit = (newLogtime, reset) => {
		const formattedNewLogtime = {
			...newLogtime,
			hours: +newLogtime.hours,
			logDate: moment.utc(newLogtime.logDate).format(),
			minutes: +newLogtime.minutes
		};
		if (isEditMode)
			UpdateLogTimeMutation.mutate({
				id: formattedNewLogtime.id,
				details: {
					...formattedNewLogtime,
					project: newLogtime.project._id,
					user: newLogtime.user
				}
			});
		else
			addLogTimeMutation.mutate({
				id: projectId,
				details: formattedNewLogtime
			});
	};
	const {
		designers,
		devOps,
		developers,
		qa,
		weeklyTimeSpent,
		estimatedHours,
		totalTimeSpent,
		name: projectSlug
	} = projectDetail?.data?.data?.data?.[0] || {};
	const LogAuthors = [
		...(designers ?? []),
		...(devOps ?? []),
		...(developers ?? []),
		...(qa ?? [])
	];

	if (timelogLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<LogTimeModal
				toggle={openModal}
				onClose={handleCloseTimelogModal}
				onSubmit={handleLogTypeSubmit}
				loading={
					addLogTimeMutation.isLoading || UpdateLogTimeMutation.isLoading
				}
				logTypes={logTypes}
				initialValues={timeLogToUpdate}
				isEditMode={isEditMode}
			/>
			<LogsBreadCumb slug={projectSlug} />
			<div style={{ marginTop: 20 }}></div>
			<Card title={projectSlug + " Time Summary"}>
				<TimeSummary
					est={roundedToFixed(estimatedHours || 0, 2)}
					ts={roundedToFixed(totalTimeSpent || 0, 2)}
					tsw={roundedToFixed(weeklyTimeSpent || 0, 2)}
				/>
			</Card>
			<Card title={projectSlug + " Logs"}>
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline" form={form}>
							<FormItem className="direct-form-item">
								<Select
									showSearch
									filterOption={filterOptions}
									placeholder="Select Log Type"
									onChange={handlelogTypeChange}
									value={logType}
								>
									{logTypes &&
										logTypes.data?.data?.data?.map(type => (
											<Option value={type._id} key={type._id}>
												{type.name}
											</Option>
										))}
								</Select>
							</FormItem>
							<FormItem className="direct-form-item">
								<Select
									showSearch
									filterOption={filterOptions}
									placeholder="Select Log Author"
									onChange={handleAuthorChange}
									value={author}
								>
									{LogAuthors &&
										LogAuthors?.map(status => (
											<Option value={status._id} key={status._id}>
												{status.name}
											</Option>
										))}
								</Select>
							</FormItem>

							<FormItem style={{marginBottom :  0}}>
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
							Add New TimeLog
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={LOGTIMES_COLUMNS(sort, handleOpenEditModal, confirmDelete)}
					dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
					onChange={handleTableChange}
					pagination={{
						current: page.page,
						pageSize: page.limit,
						pageSizeOptions: ["5", "10", "20", "50"],
						showSizeChanger: true,
						total: logTimeDetails?.data?.data?.count || 1,
						onShowSizeChange,
						hideOnSinglePage: true,
						onChange: handlePageChange
					}}
					loading={timeLogFetching || deleteLogMutation.isLoading}
				/>
			</Card>
		</div>
	);
}

export default ProjectLogs;
