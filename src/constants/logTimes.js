import React from "react";
import { Divider, Popconfirm } from "antd";
import { roundedToFixed } from "helpers/utils";
import CustomIcon from "components/Elements/Icons";

const LOGTIMES_COLUMNS = (
	sortedInfo,
	onOpenEditModal,
	confirmDelete,
	hideAdminFeature
) =>
	hideAdminFeature
		? [
				{
					title: "Project",
					dataIndex: "project",
					key: "project",
					// width: 120,
					sorter: (a, b) => {
						return a.project.toString().localeCompare(b.project.toString());
					},
					sortOrder: sortedInfo.columnKey === "project" && sortedInfo.order
				},
				{
					title: "Date",
					dataIndex: "logDate",
					key: "logDate",
					// width: 120,
					sorter: (a, b) => {
						return a.logDate.toString().localeCompare(b.logDate.toString());
					},
					sortOrder: sortedInfo.columnKey === "logDate" && sortedInfo.order
				},
				{
					title: "Hours",
					dataIndex: "totalHours",
					key: "totalHours",
					// width: 70,
					sorter: (a, b) =>
						a.totalHours?.toString().localeCompare(b.totalHours?.toString()),
					sortOrder: sortedInfo.columnKey === "totalHours" && sortedInfo.order,
					render: value => roundedToFixed(value || 0, 2)
				},

				{
					title: "Type",
					dataIndex: "logType",
					// width: 100,
					key: "logType",
					sorter: (a, b) =>
						a.logType?.toString().localeCompare(b.logType?.toString()),
					sortOrder: sortedInfo.columnKey === "logType" && sortedInfo.order
				},
				{
					title: "Remarks",
					dataIndex: "remarks",
					// width: 400,
					key: "remarks",
					sorter: (a, b) =>
						a.remarks?.toString().localeCompare(b.remarks?.toString()),
					sortOrder: sortedInfo.columnKey === "remarks" && sortedInfo.order
				},
				{
					title: "Author By",
					dataIndex: "user",
					// width: 150,
					key: "user",
					sorter: (a, b) =>
						a.user?.toString().localeCompare(b.user?.toString()),
					sortOrder: sortedInfo.columnKey === "user" && sortedInfo.order
				},

				{
					title: "Action",
					key: "action",
					// width: 360,
					render: (text, record) => {
						return (
							<span>
								<span
									className="gx-link"
									onClick={() => onOpenEditModal(record)}
								>
									<CustomIcon name="edit" />
								</span>
							</span>
						);
					}
				}
		  ]
		: [
				{
					title: "Date",
					dataIndex: "logDate",
					key: "logDate",
					// width: 120,
					sorter: (a, b) => {
						return a.logDate.toString().localeCompare(b.logDate.toString());
					},
					sortOrder: sortedInfo.columnKey === "logDate" && sortedInfo.order
				},
				{
					title: "Hours",
					dataIndex: "totalHours",
					key: "totalHours",
					// width: 70,
					sorter: (a, b) =>
						a.totalHours?.toString().localeCompare(b.totalHours?.toString()),
					sortOrder: sortedInfo.columnKey === "totalHours" && sortedInfo.order,
					render: value => roundedToFixed(value || 0, 2)
				},

				{
					title: "Type",
					dataIndex: "logType",
					// width: 100,
					key: "logType",
					sorter: (a, b) =>
						a.logType?.toString().localeCompare(b.logType?.toString()),
					sortOrder: sortedInfo.columnKey === "logType" && sortedInfo.order
				},
				{
					title: "Remarks",
					dataIndex: "remarks",
					// width: 400,
					key: "remarks",
					sorter: (a, b) =>
						a.remarks?.toString().localeCompare(b.remarks?.toString()),
					sortOrder: sortedInfo.columnKey === "remarks" && sortedInfo.order
				},
				{
					title: "Author By",
					dataIndex: "user",
					// width: 150,
					key: "user",
					sorter: (a, b) =>
						a.user?.toString().localeCompare(b.user?.toString()),
					sortOrder: sortedInfo.columnKey === "user" && sortedInfo.order
				},

				{
					title: "Action",
					key: "action",
					// width: 360,
					render: (text, record) => {
						return (
							<span>
								<span
									className="gx-link"
									onClick={() => onOpenEditModal(record)}
								>
									<CustomIcon name="edit" />
								</span>
								<Divider type="vertical" />
								<Popconfirm
									title="Are you sure to delete this Log?"
									onConfirm={() => confirmDelete(record)}
									okText="Yes"
									cancelText="No"
								>
									<span className="gx-link gx-text-danger">
										<CustomIcon name="delete" />
									</span>
								</Popconfirm>
							</span>
						);
					}
				}
		  ];

export { LOGTIMES_COLUMNS };
