import { Button } from "antd";
import React from "react";

const LEAVES_COLUMN = (mutation: any, isAdmin: boolean = false) => [
	{
		title: "Dates",
		dataIndex: "dates",
		key: "dates",
		width: 10
	},
	{
		title: "Type",
		dataIndex: "type",
		key: "type",
		width: 10
	},
	{
		title: "Reason",
		dataIndex: "reason",
		width: 10,
		key: "reason"
	},
	{
		title: "Status",
		dataIndex: "status",
		width: 10,
		key: "status"
	},

	{
		title: "Action",
		key: "action",
		width: 10,
		render: (text: any, record: any) => {
			if (isAdmin) return <i className="icon icon-edit gx-link" />;
			return record.status === "pending" ? (
				<Button
					type="danger"
					onClick={() => mutation.mutate({ id: record._id, type: "cancel" })}
				>
					Cancel
				</Button>
			) : null;
		}
	}
];

const STATUS_TYPES = [
	{ id: 1, value: "Approved" },
	{ id: 2, value: "Pending" },
	{ id: 3, value: "Cancelled" }
];

export { LEAVES_COLUMN, STATUS_TYPES };
