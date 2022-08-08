import { notification as antdNotification } from "antd";

export const notification = ({
	type = "warning",
	message = "",
	description = ""
}) => {
	antdNotification[type]({
		message,
		description
	});
};
