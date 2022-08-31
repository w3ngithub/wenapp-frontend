interface LeaveReport {
	title: string;
	dataIndex: string;
	key: any;
	sorter: (a: any, b: any) => string;
	sortOrder: string;
}

const LEAVE_REPORT_COLUMNS = (sortedInfo: any): LeaveReport[] => [
	{
		title: "Co-workers",
		dataIndex: "name",
		key: "name",
		sorter: (a, b) => {
			return a.name.toString().localeCompare(b.name.toString());
		},
		sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
	},
	{
		title: "Allocated Leaves",
		dataIndex: "leavesTaken",
		key: "leavesTaken",
		sorter: (a, b) =>
			a.leavesTaken?.toString().localeCompare(b.leavesTaken?.toString()),
		sortOrder: sortedInfo.columnKey === "leavesTaken" && sortedInfo.order
	},
	{
		title: "Days Remaining",
		dataIndex: "leavesRemaining",
		key: "leavesRemaining",
		sorter: (a, b) =>
			a.leavesRemaining
				?.toString()
				.localeCompare(b.leavesRemaining?.toString()),

		sortOrder: sortedInfo.columnKey === "leavesRemaining" && sortedInfo.order
	}
];

export { LEAVE_REPORT_COLUMNS };
