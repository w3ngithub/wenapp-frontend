import { Popconfirm } from "antd";

export const POSITION_COLUMN = (
	onDeleteClick: (param: any) => void,
	onEditClick: (param: any, param2: any) => void
) => [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 630
	},

	{
		title: "Action",
		key: "action",
		width: 10,
		render: (text: any, record: any) => {
			return (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span
						className="gx-link gx-text-primary"
						onClick={() => onEditClick(record, true)}
					>
						Edit
					</span>
					<Popconfirm
						title="Are you sure you want to cancel?"
						onConfirm={() => onDeleteClick(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">Delete</span>
					</Popconfirm>
				</div>
			);
		}
	}
];

export const POSITION_TYPES_COLUMN = (
	onDeleteClick: (param: any) => void,
	onEditClick: (param: any, param2: any) => void
) => [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 630
	},

	{
		title: "Action",
		key: "action",
		width: 10,
		render: (text: any, record: any) => {
			return (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span
						className="gx-link gx-text-primary"
						onClick={() => onEditClick(record, true)}
					>
						Edit
					</span>
					<Popconfirm
						title="Are you sure you want to cancel?"
						onConfirm={() => onDeleteClick(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">Delete</span>
					</Popconfirm>
				</div>
			);
		}
	}
];

export const LEAVES_COLUMN = (
	onDeleteClick: (param: any) => void,
	onEditClick: (param: any, param2: any) => void
) => [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		width: 315
	},
	{
		title: "Leave Days",
		dataIndex: "leaveDays",
		key: "leaveDays",
		width: 315
	},

	{
		title: "Action",
		key: "action",
		width: 10,
		render: (text: any, record: any) => {
			return (
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<span
						className="gx-link gx-text-primary"
						onClick={() => onEditClick(record, true)}
					>
						Edit
					</span>
					<Popconfirm
						title="Are you sure you want to cancel?"
						onConfirm={() => onDeleteClick(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">Delete</span>
					</Popconfirm>
				</div>
			);
		}
	}
];
