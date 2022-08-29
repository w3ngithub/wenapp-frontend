import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../CommonTable";
import { getLogtypes } from "services/settings";
import { POSITION_COLUMN } from "constants/Settings";

function Logtime() {
	const { data: logTypes }: { data: any } = useQuery(["logTypes"], getLogtypes);

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};

	return (
		<>
			<Card title="Log Type">
				<SettingTable
					data={logTypes?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Logtime;
