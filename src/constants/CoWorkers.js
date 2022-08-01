import React from "react";
import { Divider } from "antd";

const CO_WORKERCOLUMNS = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 150
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		width: 150
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
		key: "dob"
	},
	{
		title: "Join Date",
		dataIndex: "joinDate",
		width: 150,
		key: "joinDate"
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
							<span className="gx-link">Edit</span>
						</>
					)}
				</span>
			);
		}
	}
];

export { CO_WORKERCOLUMNS };
