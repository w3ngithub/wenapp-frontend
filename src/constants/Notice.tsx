import React, { ReactElement } from "react";
import { Divider, Popconfirm } from "antd";
import CustomIcon from "components/Elements/Icons";

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
				<div style={{ display: "flex" }}>
					<span className="gx-link" onClick={() => openModal(record, true)}>
						<CustomIcon name="view" />
					</span>
					<Divider type="vertical" />
					<span className="gx-link" onClick={() => openModal(record, false)}>
						<CustomIcon name="edit" />
					</span>
					<Divider type="vertical" />
					<Popconfirm
						title="Are you sure to delete this notice?"
						onConfirm={() => confirmDelete(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">
							{" "}
							<CustomIcon name="delete" />
						</span>
					</Popconfirm>
				</div>
			);
		}
	}
];

export { NOTICE_COLUMNS };
