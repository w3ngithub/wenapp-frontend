import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Card, notification } from "antd";

const openNotification = () => {
	notification.open({
		message: "Notification Title",
		description:
			"This is the content of the Notification. This is the content of the Notification. This is the content of the Notification.",
		icon: <SmileOutlined style={{ color: "#108ee9" }} />
	});
};

const CustomizeIcon = () => {
	return (
		<Card title="Customize Icon" className="gx-card">
			<Button type="primary" onClick={openNotification}>
				Open the notification box
			</Button>
		</Card>
	);
};

export default CustomizeIcon;
