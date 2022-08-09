import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { LOGTIMES_COLUMNS } from "constants/logTimes";
import { changeDate } from "helpers/utils";
import React, { useState } from "react";
import {
	deleteTimeLog,
	getAllTimeLogs,
	getTodayTimeLogSummary,
	getWeeklyTimeLogSummary
} from "services/timeLogs";
import TimeSummary from "./TimeSummary";

const formattedLogs = logs => {
	return logs?.map(log => ({
		...log,
		key: log?._id,
		logType: log?.logType?.name,
		logDate: changeDate(log?.logDate),
		user: log?.user?.name,
		project: log?.project?.name
	}));
};

function LogTime() {
	// init hooks
	const queryClient = useQueryClient();

	// init states
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });

	const {
		user: { _id }
	} = JSON.parse(localStorage.getItem("user_id") || "{}");

	const {
		data: logTimeDetails,
		isLoading: timelogLoading,
		isFetching: timeLogFetching
	} = useQuery(
		["UsertimeLogs", page, _id],
		() =>
			getAllTimeLogs({
				...page,
				user: _id,
				sort: "-logDate"
			}),
		{ keepPreviousData: true }
	);

	const { data: todayTimeSpent, isLoading: todayLoading } = useQuery(
		["userTodayTimeSpent"],
		getTodayTimeLogSummary
	);
	const { data: weeklyTimeSpent, isLoading: weeklyLoading } = useQuery(
		["userweeklyTimeSpent"],
		getWeeklyTimeLogSummary
	);

	const deleteLogMutation = useMutation(logId => deleteTimeLog(logId), {
		onSuccess: () => {
			queryClient.invalidateQueries(["UsertimeLogs"]);
			queryClient.invalidateQueries(["userweeklyTimeSpent"]);
			queryClient.invalidateQueries(["userTodayTimeSpent"]);
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

	const confirmDelete = log => {
		deleteLogMutation.mutate(log._id);
	};

	if (timelogLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<div style={{ marginTop: 20 }}></div>
			<Card title={" Time Summary"}>
				<TimeSummary
					tst={
						todayTimeSpent?.data?.data?.timeSpentToday?.[0]?.timeSpentToday || 0
					}
					tsw={
						weeklyTimeSpent?.data?.data?.weeklySummary?.[0]
							?.timeSpentThisWeek || 0
					}
				/>
			</Card>
			<Card title={"Time Logs"}>
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Button
							className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
							onClick={() => {}}
						>
							Add New Log Time
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={LOGTIMES_COLUMNS(sort, confirmDelete, true)}
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
					loading={
						timeLogFetching ||
						deleteLogMutation.isLoading ||
						todayLoading ||
						weeklyLoading
					}
				/>
			</Card>
		</div>
	);
}

export default LogTime;
