import React from "react";
import { Divider, Popconfirm } from "antd";

const PROJECT_COLUMNS = (sortedInfo, openModal, confirmDelete) => [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 250,
		sorter: (a, b) => {
			return a.name.toString().localeCompare(b.name.toString());
		},
		sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
	},
	{
		title: "Path",
		dataIndex: "path",
		key: "path",
		width: 150,
		sorter: (a, b) => a.path?.toString().localeCompare(b.path?.toString()),
		sortOrder: sortedInfo.columnKey === "path" && sortedInfo.order
	},
	{
		title: "Start Date",
		dataIndex: "startDate",
		width: 150,
		key: "startDate",
		sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
		sortOrder: sortedInfo.columnKey === "startDate" && sortedInfo.order
	},
	{
		title: "End Date",
		dataIndex: "endDate",
		width: 150,
		key: "endDate",
		sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
		sortOrder: sortedInfo.columnKey === "endDate" && sortedInfo.order
	},
	{
		title: "Project Type",
		dataIndex: "projectTypes",
		width: 150,
		key: "projectTypes",
		sorter: (a, b) =>
			a.projectTypes?.toString().localeCompare(b.projectTypes?.toString()),
		sortOrder: sortedInfo.columnKey === "projectTypes" && sortedInfo.order
	},
	{
		title: "Project Status",
		dataIndex: "projectStatus",
		width: 150,
		key: "projectStatus",
		sorter: (a, b) =>
			a.projectStatus?.toString().localeCompare(b.projectStatus?.toString()),
		sortOrder: sortedInfo.columnKey === "projectStatus" && sortedInfo.order
	},
	{
		title: "Action",
		key: "action",
		width: 360,
		render: (text, record) => {
			return (
				<span>
					<span className="gx-link">Log Time</span>
					<Divider type="vertical" />
					<span className="gx-link">Detail</span>
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

export { PROJECT_COLUMNS };
