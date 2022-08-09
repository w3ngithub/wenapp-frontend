import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import LogModal from "components/Modules/LogtimeModal";
import { LOGTIMES_COLUMNS } from "constants/logTimes";
import { changeDate, getLocalStorageData } from "helpers/utils";
import moment from "moment";
import React, { useState } from "react";
import {
	addUserTimeLog,
	deleteTimeLog,
	getAllTimeLogs,
	getLogTypes,
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
	const [openModal, setOpenModal] = useState(false);

	const [timeLogToUpdate, setTimelogToUpdate] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);
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
	const addLogTimeMutation = useMutation(details => addUserTimeLog(details), {
		onSuccess: () => {
			queryClient.invalidateQueries(["UsertimeLogs"]);
			queryClient.invalidateQueries(["userTodayTimeSpent"]);
			queryClient.invalidateQueries(["userweeklyTimeSpent"]);
			handleCloseTimelogModal();
		}
	});

	const { data: logTypes } = useQuery(["logTypes"], () => getLogTypes());

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

	const handleLogTypeSubmit = (newLogtime, reset) => {
		const formattedNewLogtime = {
			...newLogtime,
			hours: +newLogtime.hours,
			logDate: moment.utc(newLogtime.logDate).format(),
			minutes: +newLogtime.minutes,
			user: getLocalStorageData("user_id").user._id
		};
		console.log(formattedNewLogtime);
		addLogTimeMutation.mutate(formattedNewLogtime);

		// if (isEditMode)
		// 	UpdateLogTimeMutation.mutate({
		// 		id: formattedNewLogtime.id,
		// 		details: {
		// 			...formattedNewLogtime,

		// 			user: newLogtime.user._id
		// 		}
		// 	});
		// else
		// addLogTimeMutation.mutate(formattedNewLogtime);

		reset.form.resetFields();
	};

	if (timelogLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<LogModal
				toggle={openModal}
				onClose={handleCloseTimelogModal}
				onSubmit={handleLogTypeSubmit}
				// loading={
				// 	addLogTimeMutation.isLoading || UpdateLogTimeMutation.isLoading
				// }
				logTypes={logTypes}
				initialValues={timeLogToUpdate}
				isEditMode={isEditMode}
				isUserLogtime={true}
			/>
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
							onClick={handleOpenAddModal}
						>
							Add New Log Time
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={LOGTIMES_COLUMNS(
						sort,
						handleOpenEditModal,
						confirmDelete,
						true
					)}
					dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
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
