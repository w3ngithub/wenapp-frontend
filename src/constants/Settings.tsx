import CustomIcon from "components/Elements/Icons";
import { Divider, Popconfirm } from "antd";

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
				<div style={{ display: "flex"}}>
					<span
						className="gx-link gx-text-primary"
						onClick={() => onEditClick(record, true)}
					>
						<CustomIcon name="edit" />
					</span>
					<Divider type="vertical"/>
					<Popconfirm
						title="Are you sure you want to delete?"
						onConfirm={() => onDeleteClick(record)}
						okText="Yes"
						cancelText="No"
					>
						<span className="gx-link gx-text-danger">
							<CustomIcon name="delete" />
						</span>
					</Popconfirm>
				</div>
			);
		}
	}
];

export const INVITED_EMPLOYEES_COLUMN = () => [
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		width: 630
	},
	{
		title: "Status",
		key: "status",
		width: 10,
		render: (text: any, record: any) => {
			return record?.inviteTokenUsed ? <span></span> : <span>pending</span>;
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
				<div className="gx-d-flex">
					<span
						className="gx-link gx-text-primary"
						onClick={() => onEditClick(record, true)}
					>
						<CustomIcon name="edit" />
					</span>
					<Divider type="vertical" style={{color:'blue'}}/>
					<Popconfirm
						title="Are you sure you want to delete?"
						onConfirm={() => onDeleteClick(record)}
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
