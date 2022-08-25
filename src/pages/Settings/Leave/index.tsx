import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../SettingTable";
import { getLeaveTypes } from "services/settings";
import { LEAVES_COLUMN } from "constants/Settings";

function Leave() {
	const { data: leaveTypes }: { data: any } = useQuery(
		["leaveTypes"],
		getLeaveTypes
	);

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};

	return (
		<>
			<Card title="Leave Type">
				<SettingTable
					data={leaveTypes?.data?.data?.data}
					columns={LEAVES_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Leave;
