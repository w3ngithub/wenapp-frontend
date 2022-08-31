import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Form, DatePicker, Divider } from "antd";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
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
	sortFromDate
} from "helpers/utils";
import ViewDetailModel from "../ViewDetailModel";
import { notification } from "helpers/notification";
import Select from "components/Elements/Select";
import { getAllUsers } from "services/users/userDetails";
import TmsAdminAttendanceForm from "components/Modules/TmsAdminAttendanceForm";
import TmsAdminAddAttendanceForm from "components/Modules/TmsAdminAttendanceForm/Add";
import CustomIcon from "components/Elements/Icons";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const formattedAttendances = attendances => {
	return attendances?.map(att => ({
		...att,
		key: att._id.attendanceDate + att._id.user,
		user: att._id.user,
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

function AdminAttendance() {
	//init hooks
	const [sort, setSort] = useState({});
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openView, setOpenView] = useState(false);
	const [attToView, setAttToView] = useState({});
	const [date, setDate] = useState(intialDate);
	const [user, setUser] = useState(undefined);
	const [attFilter, setAttFilter] = useState({ id: "1", value: "Daily" });
	const [toggleAdd, setToggleAdd] = useState(false);
	const [toggleEdit, setToggleEdit] = useState(false);

	const [AttToEdit, setAttToEdit] = useState({});

	const { data: users } = useQuery(["userForAttendances"], () =>
		getAllUsers({ fields: "name" })
	);

	const { data, isLoading, isFetching } = useQuery(
		["adminAttendance", user, date, page, user],
		() =>
			searchAttendacentOfUser({
				page: page.page + "",
				limit: page.limit + "",
				userId: user || "",
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
		setAttToView({
			...record,
			attendanceDate: moment(record?.attendanceDate).format("LL"),
			attendanceDay: moment(record?.attendanceDate).format("dddd"),
			punchInTime: record?.punchInTime,
			punchOutTime: record?.punchOutTime ? record?.punchOutTime : "",
			officeHour: record?.officeHour ? record?.officeHour : ""
		});
	};

	const handleEdit = record => {
		setToggleEdit(true);
		setAttToEdit(record);
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
	const handleUserChange = id => {
		setUser(id);
	};

	const handleReset = () => {
		setUser(undefined);
		setAttFilter(1);
		setDate(intialDate);
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
							</span>{" "}
							<Divider type="vertical"></Divider>
							<span className="gx-link" onClick={() => handleEdit(record)}>
								<CustomIcon name="edit" />
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

	return (
		<div>
			<TmsAdminAddAttendanceForm
				toogle={toggleAdd}
				handleCancel={() => {
					setToggleAdd(false);
				}}
				users={users?.data?.data?.data}
			/>
			<TmsAdminAttendanceForm
				toogle={toggleEdit}
				handleCancel={() => {
					setToggleEdit(false);
					setAttToEdit({});
				}}
				users={users?.data?.data?.data}
				AttToEdit={AttToEdit}
			/>
			<ViewDetailModel
				toogle={openView}
				title={attToView.user ? attToView.user : "Attendance Details"}
				handleCancel={() => {
					setOpenView(false);
					setAttToEdit({});
				}}
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
						<FormItem>
							<Select
								placeholder="Select Co-worker"
								onChange={handleUserChange}
								value={user}
								options={users?.data?.data?.data?.map(x => ({
									id: x._id,
									value: x.name
								}))}
							/>
						</FormItem>

						<FormItem>
							<Button
								className="gx-btn gx-btn-primary gx-text-white "
								onClick={() => handleReset()}
							>
								Reset
							</Button>
						</FormItem>
					</Form>
					<Button
						className="gx-btn gx-btn-primary gx-text-white "
						onClick={() => setToggleAdd(true)}
					>
						Add
					</Button>
				</div>
			</div>
			<Table
				className="gx-table-responsive"
				columns={ATTENDANCE_COLUMNS(sort, handleView, true)}
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

export default AdminAttendance;
