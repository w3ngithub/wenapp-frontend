import React from "react";
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	UserAddOutlined,
	UserDeleteOutlined,
	MinusSquareOutlined
} from "@ant-design/icons";

function CustomIcon({ name }: { name: string }) {
	const style = { fontSize: "18px" };
	switch (name) {
		case "view":
			return <EyeOutlined style={style} />;

		case "edit":
			return <EditOutlined style={style} />;

		case "delete":
			return <DeleteOutlined style={style} />;

		case "activeUser":
			return <UserAddOutlined style={style} />;
		case "deactiveUser":
			return (
				<UserDeleteOutlined style={style} className="gx-link gx-text-danger" />
			);

		case "leaveCut":
			return (
				<MinusSquareOutlined style={style} className="gx-link gx-text-danger" />
			);

		default:
			return <EyeOutlined style={{ fontSize: "18px" }} />;
	}
}

export default CustomIcon;
