import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Select, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { LOGTIMES_COLUMNS } from "constants/logTimes";
import { changeDate } from "helpers/utils";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "services/projects";
import { deleteTimeLog, getAllTimeLogs, getLogTypes } from "services/timeLogs";
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

	// init states
	const [sort, setSort] = useState({});
	const [logType, setLogType] = useState(undefined);
	const [author, setAuthor] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });

	const [projectSlug, projectId] = slug.split("-");

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

	const deleteLogMutation = useMutation(logId => deleteTimeLog(logId), {
		onSuccess: () => {
			queryClient.invalidateQueries(["logTypes"]);
		}
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

	const confirmDelete = log => {
		deleteLogMutation.mutate(log._id);
	};

	const {
		designers,
		devOps,
		developers,
		qa,
		weeklyTimeSpent,
		estimatedHours,
		totalTimeSpent
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
			<LogsBreadCumb slug={projectSlug} />
			<div style={{ marginTop: 20 }}></div>
			<Card title={projectSlug + " Time Summary"}>
				<TimeSummary
					est={estimatedHours}
					ts={totalTimeSpent}
					tsw={weeklyTimeSpent}
				/>
			</Card>
			<Card title={projectSlug + " Logs"}>
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline">
							<FormItem>
								<Select
									placeholder="Select Log Type"
									style={{ width: 200 }}
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
							<FormItem>
								<Select
									placeholder="Select Log Author"
									style={{ width: 200 }}
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
							className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
							onClick={() => {}}
						>
							Add New TimeLog
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={LOGTIMES_COLUMNS(sort, confirmDelete)}
					dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
					onChange={handleTableChange}
					pagination={{
						current: page.page,
						pageSize: page.limit,
						pageSizeOptions: ["5", "10", "20", "50"],
						showSizeChanger: true,
						total: 11,
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
