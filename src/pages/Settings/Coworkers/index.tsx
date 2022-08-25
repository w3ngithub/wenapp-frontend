import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../SettingTable";
import { getPosition, getPositionTypes, getRoles } from "services/settings";
import { POSITION_COLUMN, POSITION_TYPES_COLUMN } from "constants/Settings";

function Coworkers() {
	const { data: positions }: { data: any } = useQuery(
		["positions"],
		getPosition
	);
	const { data: positionTypes }: { data: any } = useQuery(
		["positionTypes"],
		getPositionTypes
	);
	const { data: roles }: { data: any } = useQuery(["roles"], getRoles, {
		onError: err => console.log(err),
		select: res =>
			res?.data?.data?.data?.map(
				(role: { key: string; value: string; _id: string }) => ({
					...role,
					key: role._id,
					name: role?.value
				})
			)
	});

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};

	return (
		<>
			<Card title="Position">
				<SettingTable
					data={positions?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
			<Card title="Position Type">
				<SettingTable
					data={positionTypes?.data?.data?.data}
					columns={POSITION_TYPES_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
			<Card title="Role">
				<SettingTable
					data={roles}
					columns={POSITION_TYPES_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Coworkers;
