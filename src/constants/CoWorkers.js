import React from "react";
import { Divider } from "antd";

const CO_WORKERCOLUMNS = (sortedInfo, openEditPopup) => [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 150,
		sorter: (a, b) => {
			return a.name.toString().localeCompare(b.name.toString());
		},
		sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		width: 150,
		sorter: (a, b) => a.email.toString().localeCompare(b.email.toString()),
		sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order
	},
	{
		title: "Primary Phone",
		dataIndex: "primaryPhone",
		width: 150,
		key: "primaryPhone"
	},
	{
		title: "DOB",
		dataIndex: "dob",
		width: 150,
		key: "dob",
		sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
		sortOrder: sortedInfo.columnKey === "dob" && sortedInfo.order
	},
	{
		title: "Join Date",
		dataIndex: "joinDate",
		width: 150,
		key: "joinDate",
		sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
		sortOrder: sortedInfo.columnKey === "joinDate" && sortedInfo.order
	},
	{
		title: "Action",
		key: "action",
		width: 360,
		render: (text, record) => {
			return (
				<span>
					<span className="gx-link">View Details</span>
					<Divider type="vertical" />
					<span className="gx-link">Make User Inactive</span>
					{record.isAdmin && (
						<>
							{" "}
							<Divider type="vertical" />
							<span className="gx-link" onClick={openEditPopup}>
								Edit
							</span>
						</>
					)}
				</span>
			);
		}
	}
];

export { CO_WORKERCOLUMNS };
