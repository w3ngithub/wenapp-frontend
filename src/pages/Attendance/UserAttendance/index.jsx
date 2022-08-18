import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Form, DatePicker } from "antd";
import moment from "moment";
import { attendanceFilter, ATTENDANCE_COLUMNS } from "constants/Attendance";
import { searchAttendacentOfUser } from "services/attendances";
import { dateDifference } from "helpers/utils";
import ViewDetailModel from "../ViewDetailModel";
import { notification } from "helpers/notification";
import Select from "components/Elements/Select";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const formattedAttendances = attendances => {
	return attendances?.map(att => ({
		...att,
		key: att._id,
		attendanceDate: moment(att?.attendanceDate).format("LL"),
		attendanceDay: moment(att?.attendanceDate).format("dddd"),
		punchInTime: moment(att?.punchInTime).format("LTS"),
		punchOutTime: att?.punchOutTime
			? moment(att?.punchOutTime).format("LTS")
			: "",
		officeHour: att?.punchOutTime
			? dateDifference(att?.punchOutTime, att?.punchInTime)
			: ""
	}));
};
const intialDate = [moment().startOf("day"), moment().endOf("day")];
const weeklyState = [moment().startOf("week"), moment().endOf("day")];
const monthlyState = [moment().startOf("month"), moment().endOf("day")];

function UserAttendance() {
	//init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openView, setOpenView] = useState(false);
	const [attToView, setAttToView] = useState({});
	const [date, setDate] = useState(intialDate);
	const [attFilter, setAttFilter] = useState({ id: "1", value: "Daily" });

	const { user } = JSON.parse(localStorage.getItem("user_id") || "{}");

	const { data, isLoading, isFetching } = useQuery(
		["userAttendance", user, date, page],
		() =>
			searchAttendacentOfUser({
				page: page.page + "",
				limit: page.limit + "",
				userId: user._id,
				fromDate: date?.[0] ? moment.utc(date[0]).format() : "",
				toDate: date?.[1] ? moment.utc(date[1]).format() : ""
			})
	);

	const handleChangeDate = date => {
		setDate(date ? date : intialDate);
		if (date === null) {
			setAttFilter(1);
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

	const handleView = record => {
		setOpenView(true);
		setAttToView(record);
	};

	const handleAttChnageChange = val => {
		setAttFilter(val);
		switch (val) {
			case 1:
				setDate(intialDate);
				break;
			case 2:
				setDate(weeklyState);
				break;
			case 3:
				setDate(monthlyState);
				break;

			default:
				break;
		}
	};

	useEffect(() => {
		if (isLoading === false && !data?.status) {
			notification({ message: "Failed To load Attendances", type: "error" });
		}
	}, [isLoading, data?.status]);

	return (
		<div>
			<ViewDetailModel
				toogle={openView}
				handleCancel={() => setOpenView(false)}
				attendanceToview={attToView}
			/>
			<div className="gx-mt-2"></div>
			<div className="components-table-demo-control-bar">
				<div className="gx-d-flex gx-justify-content-between gx-flex-row">
					<Form layout="inline">
						<FormItem>
							<RangePicker
								onChange={handleChangeDate}
								value={date}
								style={{ width: "240px" }}
							/>
						</FormItem>
						<FormItem>
							<Select
								onChange={handleAttChnageChange}
								value={attFilter}
								options={attendanceFilter}
							/>
						</FormItem>
					</Form>
					<Button
						className="gx-btn gx-btn-primary gx-text-white "
						onClick={() => {}}
					>
						Add
					</Button>
				</div>
			</div>
			<Table
				className="gx-table-responsive"
				columns={ATTENDANCE_COLUMNS(sort, handleView)}
				dataSource={formattedAttendances(data?.data?.data?.attendances)}
				onChange={handleTableChange}
				pagination={{
					current: page.page,
					pageSize: page.limit,
					pageSizeOptions: ["5", "10", "20", "50"],
					showSizeChanger: true,
					total: data?.data?.data?.count || 1,
					onShowSizeChange,
					onChange: handlePageChange
				}}
				loading={isFetching}
			/>
		</div>
	);
}

export default UserAttendance;
