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

const NOTICE_COLUMNS = (
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
		title: "Category",
		dataIndex: "category",
		key: "category",
		sorter: (a, b) =>
			a.category?.toString().localeCompare(b.category?.toString()),
		sortOrder: sortedInfo.columnKey === "category" && sortedInfo.order
	},
	{
		title: "Start Date",
		dataIndex: "startDate",
		key: "startDate",
		sorter: (a, b) =>
			a.startDate?.toString().localeCompare(b.startDate?.toString()),
		sortOrder: sortedInfo.columnKey === "startDate" && sortedInfo.order
	},
	{
		title: "End Date",
		dataIndex: "endDate",
		key: "endDate",
		sorter: (a, b) =>
			a.endDate?.toString().localeCompare(b.endDate?.toString()),
		sortOrder: sortedInfo.columnKey === "endDate" && sortedInfo.order
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			return (
				<span>
					<span className="gx-link" onClick={() => openModal(record, true)}>
						View
					</span>

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

export { NOTICE_COLUMNS };
