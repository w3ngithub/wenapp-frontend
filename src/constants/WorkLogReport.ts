import { ReactElement } from "react";

interface report {
	title: string;
	dataIndex?: string;
	key: any;
	width?: number;
	sorter?: (a: any, b: any) => any;
	sortOrder?: any;
	render?: (text: any, record: any) => ReactElement | null;
}

const WORK_LOG_REPORT_COLUMNS = (sortedInfo: any): report[] => [
	{
		title: "Users",
		dataIndex: "user",
		key: "user",
		sorter: (a, b) => {
			return a.user.toString().localeCompare(b.user.toString());
		},
		sortOrder: sortedInfo.columnKey === "user" && sortedInfo.order
	},
	{
		title: "Details",
		dataIndex: "details",
		key: "details",
		sorter: (a, b) =>
			a.details?.toString().localeCompare(b.details?.toString()),
		sortOrder: sortedInfo.columnKey === "details" && sortedInfo.order
	},
	{
		title: "Time Spent",
		dataIndex: "timeSpent",
		key: "timeSpent",
		sorter: (a, b) =>
			a.timeSpent?.toString().localeCompare(b.timeSpent?.toString()),

		sortOrder: sortedInfo.columnKey === "timeSpent" && sortedInfo.order
	}
];

export { WORK_LOG_REPORT_COLUMNS };
