import React from "react";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

function CustomIcon({ name }: { name: string }) {
	switch (name) {
		case "view":
			return <EyeOutlined style={{ fontSize: "18px" }} />;

		case "edit":
			return <EditOutlined style={{ fontSize: "18px" }} />;

		case "delete":
			return <DeleteOutlined style={{ fontSize: "18px" }} />;

		default:
			return <EyeOutlined style={{ fontSize: "18px" }} />;
	}
}

export default CustomIcon;
