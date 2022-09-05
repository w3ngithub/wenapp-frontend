import React, { useState } from "react";
import { Button, Card, Form, Table } from "antd";
import RangePicker from "components/Elements/RangePicker";
import { intialDate } from "constants/Attendance";
import Select from "components/Elements/Select";
import { useQuery } from "@tanstack/react-query";
import { getLogTypes } from "services/timeLogs";
import { getAllProjects } from "services/projects";
import { getAllUsers } from "services/users/userDetails";
import { WORK_LOG_REPORT_COLUMNS } from "constants/WorkLogReport";

const FormItem = Form.Item;

function WorkLogReport() {
	//init state
	const [sort, setSort] = useState({});
	const [date, setDate] = useState(intialDate);
	const [logType, setLogType] = useState<string | undefined>(undefined);
	const [project, setProject] = useState<string | undefined>(undefined);
	const [user, setUser] = useState<string | undefined>(undefined);

	//init hooks
	const { data: logTypesData } = useQuery(["logTypes"], getLogTypes);

	const { data: projectData } = useQuery(["WorkLogProjects"], () =>
		getAllProjects({
			fields:
				"_id,name,-devOps,-createdBy,-designers,-developers,-projectStatus,-projectTags,-projectTypes,-qa,-updatedBy"
		})
	);

	const { data: usersData } = useQuery(["WorkLogusers"], () =>
		getAllUsers({
			active: "true",
			fields: "_id,name"
		})
	);

	const handleChangeDate = (date: any[]) => {
		setDate(date);
	};

	const handleLogTypeChange = (typeId: string) => {
		setLogType(typeId);
	};

	const handleProjectChange = (ProjectId: string) => {
		setProject(ProjectId);
	};

	const handleUserChange = (userId: string) => {
		setUser(userId);
	};

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		setSort(sorter);
	};

	const handleResetFilter = () => {
		setDate(intialDate);
		setLogType(undefined);
		setProject(undefined);
		setUser(undefined);
	};

	return (
		<Card title="Work Log repoprt">
			<div className="components-table-demo-control-bar">
				<div className="gx-d-flex gx-justify-content-between gx-flex-row">
					<Form layout="inline">
						<FormItem>
							<RangePicker handleChangeDate={handleChangeDate} date={date} />
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select Project"
								onChange={handleProjectChange}
								value={project}
								options={projectData?.data?.data?.data?.map((x: any) => ({
									...x,
									id: x._id,
									value: x.name
								}))}
								inputSelect
							/>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select Co-worker"
								onChange={handleUserChange}
								value={user}
								options={usersData?.data?.data?.data?.map((x: any) => ({
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
								options={logTypesData?.data?.data?.data?.map((x: any) => ({
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
				columns={WORK_LOG_REPORT_COLUMNS(sort)}
				// dataSource={formattedWeeklyReports(data?.data?.data?.report, clients)}
				onChange={handleTableChange}
				// pagination={{
				// 	current: page.page,
				// 	pageSize: page.limit,
				// 	pageSizeOptions: ["5", "10", "20", "50"],
				// 	showSizeChanger: true,
				// 	total: data?.data?.data?.count || 1,
				// 	onShowSizeChange,
				// 	hideOnSinglePage: true,
				// 	onChange: handlePageChange
				// }}
				// loading={isLoading || isFetching}
			/>
		</Card>
	);
}

export default WorkLogReport;
