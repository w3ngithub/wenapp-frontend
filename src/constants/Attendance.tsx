import React, { ReactElement } from "react";
import { EyeOutlined } from "@ant-design/icons";

interface notice {
	title: string;
	dataIndex?: string;
	key: any;
	width?: number;
	sorter?: (a: any, b: any) => any;
	sortOrder?: any;
	render?: (text: any, record: any) => ReactElement | null;
}

const ATTENDANCE_COLUMNS = (
	sortedInfo: any,
	openModal: Function,
	admin: boolean
): notice[] =>
	admin
		? [
				{
					title: "User",
					dataIndex: "user",
					key: "user",
					sorter: (a, b) => {
						return a.user.toString().localeCompare(b.user.toString());
					},
					sortOrder: sortedInfo.columnKey === "user" && sortedInfo.order
				},
				{
					title: "Date",
					dataIndex: "attendanceDate",
					key: "attendanceDate",
					sorter: (a, b) => {
						return a.attendanceDate
							.toString()
							.localeCompare(b.attendanceDate.toString());
					},
					sortOrder:
						sortedInfo.columnKey === "attendanceDate" && sortedInfo.order
				},
				{
					title: "Day",
					dataIndex: "attendanceDay",
					key: "attendanceDay",
					sorter: (a, b) =>
						a.attendanceDay
							?.toString()
							.localeCompare(b.attendanceDay?.toString()),
					sortOrder:
						sortedInfo.columnKey === "attendanceDay" && sortedInfo.order
				},
				{
					title: "Punch-in Time",
					dataIndex: "punchInTime",
					key: "punchInTime",
					sorter: (a, b) =>
						a.punchInTime?.toString().localeCompare(b.punchInTime?.toString()),
					sortOrder: sortedInfo.columnKey === "punchInTime" && sortedInfo.order
				},
				{
					title: "Punch-out Time",
					dataIndex: "punchOutTime",
					key: "punchOutTime",
					sorter: (a, b) =>
						a.punchOutTime
							?.toString()
							.localeCompare(b.punchOutTime?.toString()),
					sortOrder: sortedInfo.columnKey === "punchOutTime" && sortedInfo.order
				},
				{
					title: "Office hour",
					dataIndex: "officeHour",
					key: "officeHour",
					sorter: (a, b) =>
						a.officeHour?.toString().localeCompare(b.officeHour?.toString()),
					sortOrder: sortedInfo.columnKey === "officeHour" && sortedInfo.order
				}
		  ]
		: [
				{
					title: "Date",
					dataIndex: "attendanceDate",
					key: "attendanceDate",
					sorter: (a, b) => {
						return a.attendanceDate
							.toString()
							.localeCompare(b.attendanceDate.toString());
					},
					sortOrder:
						sortedInfo.columnKey === "attendanceDate" && sortedInfo.order
				},
				{
					title: "Day",
					dataIndex: "attendanceDay",
					key: "attendanceDay",
					sorter: (a, b) =>
						a.attendanceDay
							?.toString()
							.localeCompare(b.attendanceDay?.toString()),
					sortOrder:
						sortedInfo.columnKey === "attendanceDay" && sortedInfo.order
				},
				{
					title: "Punch-in Time",
					dataIndex: "punchInTime",
					key: "punchInTime",
					sorter: (a, b) =>
						a.punchInTime?.toString().localeCompare(b.punchInTime?.toString()),
					sortOrder: sortedInfo.columnKey === "punchInTime" && sortedInfo.order
				},
				{
					title: "Punch-out Time",
					dataIndex: "punchOutTime",
					key: "punchOutTime",
					sorter: (a, b) =>
						a.punchOutTime
							?.toString()
							.localeCompare(b.punchOutTime?.toString()),
					sortOrder: sortedInfo.columnKey === "punchOutTime" && sortedInfo.order
				},
				{
					title: "Office hour",
					dataIndex: "officeHour",
					key: "officeHour",
					sorter: (a, b) =>
						a.officeHour?.toString().localeCompare(b.officeHour?.toString()),
					sortOrder: sortedInfo.columnKey === "officeHour" && sortedInfo.order
				}
		  ];

const attendanceFilter = [
	{ id: 1, value: "Daily" },
	{ id: 2, value: "Weekly" },
	{ id: 3, value: "Monthly" }
];

export { ATTENDANCE_COLUMNS, attendanceFilter };
