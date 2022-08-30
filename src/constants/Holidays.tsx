import React, { ReactElement } from "react";
import { Divider, Popconfirm } from "antd";

interface notice {
	title: string;
	dataIndex?: string;
	key: any;
	width?: number;
	sorter?: (a: any, b: any) => any;
	sortOrder?: any;
	render?: (text: any, record: any) => ReactElement | null;
}

const HOLIDAY_COLUMNS = (
	sortedInfo: any,
	openModal: Function,
	confirmDelete: Function
): notice[] => [
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
		sorter: (a, b) => {
			return a.title.toString().localeCompare(b.title.toString());
		},
		sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order
	},
	{
		title: "Date",
		dataIndex: "date",
		key: "date",
		sorter: (a, b) => a.date?.toString().localeCompare(b.date?.toString()),
		sortOrder: sortedInfo.columnKey === "date" && sortedInfo.order
	},
	{
		title: "Remarks",
		dataIndex: "remarks",
		key: "remarks",
		sorter: (a, b) =>
			a.remarks?.toString().localeCompare(b.remarks?.toString()),
		sortOrder: sortedInfo.columnKey === "remarks" && sortedInfo.order
	},

	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			return (
				<span>
					<Divider type="vertical" />
					<span className="gx-link" onClick={() => openModal(record, false)}>
						Edit
					</span>
					<Divider type="vertical" />
					<Popconfirm
						title="Are you sure to delete this project?"
						onConfirm={() => confirmDelete(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">Delete</span>
					</Popconfirm>
				</span>
			);
		}
	}
];

export { HOLIDAY_COLUMNS };
