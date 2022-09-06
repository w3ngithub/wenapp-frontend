import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Form, DatePicker } from "antd";
import moment from "moment";
import {
	attendanceFilter,
	ATTENDANCE_COLUMNS,
	intialDate,
	monthlyState,
	weeklyState
} from "constants/Attendance";
import { searchAttendacentOfUser } from "services/attendances";
import {
	dateDifference,
	milliSecondIntoHours,
	MuiFormatDate,
	sortFromDate
} from "helpers/utils";
import ViewDetailModel from "../ViewDetailModel";
import { notification } from "helpers/notification";
import Select from "components/Elements/Select";
import TmsMyAttendanceForm from "components/Modules/TmsMyAttendanceForm";
import { useSelector } from "react-redux";
import CustomIcon from "components/Elements/Icons";
import useWindowsSize from "hooks/useWindowsSize";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const formattedAttendances = attendances => {
	return attendances?.map(att => ({
		...att,
		key: att._id.attendanceDate + att._id.user,
		attendanceDate: moment(att?._id.attendanceDate).format("LL"),
		attendanceDay: moment(att?._id.attendanceDate).format("dddd"),
		punchInTime: moment(att?.data?.[0]?.punchInTime).format("LTS"),
		punchOutTime: att?.data?.[att?.data.length - 1]?.punchOutTime
			? moment(att?.data?.[att?.data.length - 1]?.punchOutTime).format("LTS")
			: "",
		officeHour: milliSecondIntoHours(
			att?.data
				?.map(x =>
					x?.punchOutTime
						? new Date(x?.punchOutTime) - new Date(x?.punchInTime)
						: ""
				)
				.filter(Boolean)
				?.reduce((accumulator, value) => {
					return accumulator + value;
				}, 0)
		)
	}));
};

function UserAttendance() {
	//init hooks
	const [sort, setSort] = useState({});
	const {innerWidth} = useWindowsSize();
	const [form] = Form.useForm();
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openView, setOpenView] = useState(false);
	const [attToView, setAttToView] = useState({});
	const [date, setDate] = useState(intialDate);
	const [attFilter, setAttFilter] = useState({ id: "1", value: "Daily" });
	const [toogle, setToogle] = useState(false);

	const { user } = JSON.parse(localStorage.getItem("user_id") || "{}");

	const punchIn = useSelector(state => state.attendance.punchIn);

	const { data, isLoading, isFetching } = useQuery(
		["userAttendance", user, date, page],
		() =>
			searchAttendacentOfUser({
				page: page.page + "",
				limit: page.limit + "",
				userId: user._id,
				fromDate: date?.[0] ? MuiFormatDate(date[0]._d) + "T00:00:00Z" : "",
				toDate: date?.[1] ? MuiFormatDate(date[1]._d) + "T00:00:00Z" : ""
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
		setAttToView({
			...record,
			attendanceDate: moment(record?.attendanceDate).format("LL"),
			attendanceDay: moment(record?.attendanceDate).format("dddd"),
			punchInTime: record?.punchInTime,
			punchOutTime: record?.punchOutTime ? record?.punchOutTime : "",
			officeHour: record?.officeHour ? record?.officeHour : ""
		});
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

	const expandedRowRender = parentRow => {
		const columns = [
			{
				title: "Punch-in Time",
				dataIndex: "punchInTime",
				key: "punchInTime"
			},
			{
				title: "Punch-out Time",
				dataIndex: "punchOutTime",
				key: "punchOutTime"
			},
			{
				title: "Office hour",
				dataIndex: "officeHour",
				key: "officeHour"
			},
			{
				title: "Action",
				key: "action",
				render: (text, record) => {
					return (
						<span>
							<span className="gx-link" onClick={() => handleView(record)}>
								<CustomIcon name="view" />
							</span>
						</span>
					);
				}
			}
		];
		const data = parentRow?.data?.map(att => ({
			...att,
			key: att._id,
			punchInTime: moment(att?.punchInTime).format("LTS"),
			punchOutTime: att?.punchOutTime
				? moment(att?.punchOutTime).format("LTS")
				: "",
			officeHour: att?.punchOutTime
				? dateDifference(att?.punchOutTime, att?.punchInTime)
				: ""
		}));

		return <Table columns={columns} dataSource={data} pagination={false} />;
	};

	const sortedData = useMemo(() => {
		return data?.data?.data?.attendances?.[0]?.data?.map(d => ({
			...d,
			data: sortFromDate(d?.data, "punchInTime")
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.data?.data?.attendances?.[0]?.data]);
	console.log('innerWidth', innerWidth);

	return (
		<div>
			<TmsMyAttendanceForm
				title="Time Attendance"
				toogle={toogle}
				handleCancel={() => setToogle(false)}
			/>
			<ViewDetailModel
				title="Attendance Details"
				toogle={openView}
				handleCancel={() => setOpenView(false)}
				attendanceToview={attToView}
			/>
			<div className="gx-mt-2"></div>
			<div className="components-table-demo-control-bar">
				<div className="gx-d-flex gx-justify-content-between gx-flex-row">
					<Form layout="inline" form={form} >
						<FormItem>
							<RangePicker
								onChange={handleChangeDate}
								value={date} 
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
						onClick={() => {
							setToogle(true);
						}}
					>
						{punchIn ? "Punch In" : "Punch Out"}
					</Button>
				</div>
			</div>
			<Table
				className="gx-table-responsive"
				columns={ATTENDANCE_COLUMNS(sort, handleView)}
				dataSource={formattedAttendances(sortedData)}
				expandable={{ expandedRowRender }}
				onChange={handleTableChange}
				pagination={{
					current: page.page,
					pageSize: page.limit,
					pageSizeOptions: ["5", "10", "20", "50"],
					showSizeChanger: true,
					total: data?.data?.data?.attendances?.[0]?.metadata?.[0]?.total || 1,
					onShowSizeChange,
					onChange: handlePageChange
				}}
				loading={isFetching}
			/>
		</div>
	);
}

export default UserAttendance;
