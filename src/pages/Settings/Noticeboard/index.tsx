import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../CommonTable";
import { getNoticeboardTypes } from "services/settings";
import { POSITION_COLUMN } from "constants/Settings";

function Noticeboard() {
	const { data: noticeBoardTypes }: { data: any } = useQuery(
		["noticeBoardTypes"],
		getNoticeboardTypes
	);

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};

	return (
		<>
			<Card title="Category">
				<SettingTable
					data={noticeBoardTypes?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Noticeboard;
