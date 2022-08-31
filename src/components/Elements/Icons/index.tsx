import React from "react";
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	UserAddOutlined,
	UserDeleteOutlined
} from "@ant-design/icons";

function CustomIcon({ name }: { name: string }) {
	switch (name) {
		case "view":
			return <EyeOutlined style={{ fontSize: "18px" }} />;

		case "edit":
			return <EditOutlined style={{ fontSize: "18px" }} />;

		case "delete":
			return <DeleteOutlined style={{ fontSize: "18px" }} />;

		case "activeUser":
			return <UserAddOutlined style={{ fontSize: "18px" }} />;
		case "deactiveUser":
			return (
				<UserDeleteOutlined
					style={{ fontSize: "18px" }}
					className="gx-link gx-text-danger"
				/>
			);

		default:
			return <EyeOutlined style={{ fontSize: "18px" }} />;
	}
}

export default CustomIcon;
