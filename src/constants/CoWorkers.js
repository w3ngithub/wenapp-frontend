import React from "react";
import { Divider, Popconfirm } from "antd";
import CustomIcon from "components/Elements/Icons";

const CO_WORKERCOLUMNS = (sortedInfo, openEditPopup, mutation) => [
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
		width: 250,
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
		width: 150,
		render: (text, record) => {
			return (
				<div style={{ display: "flex" }}>
					<span className="gx-link" onClick={() => openEditPopup(record, true)}>
						<CustomIcon name="view" />
					</span>
					<Divider type="vertical" />
					<Popconfirm
						title={`Are you sure to make Co-worker ${
							record.active ? "inactive" : "active"
						} ?`}
						onConfirm={() => {
							mutation.mutate({
								userId: record._id,
								updatedData: { active: !record.active }
							});
						}}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link">
							{record.active ? (
								<CustomIcon name="deactiveUser" />
							) : (
								<CustomIcon name="activeUser" />
							)}
						</span>
					</Popconfirm>

					{record.isAdmin && (
						<>
							{" "}
							<Divider type="vertical" />
							<span
								className="gx-link"
								onClick={() => openEditPopup(record, false)}
							>
								<CustomIcon name="edit" />
							</span>
						</>
					)}
				</div>
			);
		}
	}
];

export { CO_WORKERCOLUMNS };
