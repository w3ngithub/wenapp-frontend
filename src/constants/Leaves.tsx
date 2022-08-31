import { Popconfirm } from "antd";
import CustomIcon from "components/Elements/Icons";
import React from "react";

const LEAVES_COLUMN = (
	onCancelClick: (param: any) => void,
	onApproveClick: (param: any) => void,
	onEditClick: (param: any, param2: any) => void,
	isAdmin: boolean = false
) => [
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
		key: "reason",
		render: (text: any, record: any) => {
			return (
				<div className="max-two-lines">
					<span>{record.reason}</span>
				</div>
			);
		}
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
			if (isAdmin)
				return (
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<span
							className="gx-link gx-text-primary"
							onClick={() => onEditClick(record, true)}
						>
							<CustomIcon name="view" />
						</span>
						{!["approved", "cancelled"].includes(record.status) && (
							<>
								<Popconfirm
									title="Are you sure you want to approve?"
									onConfirm={() => onApproveClick(record)}
									okText="Yes"
									cancelText="No"
								>
									<span className="gx-link gx-text-green">Approve</span>
								</Popconfirm>
								<i
									className="icon icon-edit gx-link"
									onClick={() => onEditClick(record, false)}
								/>
							</>
						)}
					</div>
				);
			return record.status === "pending" ? (
				<Popconfirm
					title="Are you sure you want to cancel?"
					onConfirm={() => onCancelClick(record)}
					okText="Yes"
					cancelText="No"
				>
					<span className="gx-link gx-text-danger">Cancel</span>
				</Popconfirm>
			) : null;
		}
	}
];

const STATUS_TYPES = [
	{ id: "approved", value: "Approved" },
	{ id: "pending", value: "Pending" },
	{ id: "cancelled", value: "Cancelled" }
];

export { LEAVES_COLUMN, STATUS_TYPES };
