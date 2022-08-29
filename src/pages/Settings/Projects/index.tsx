import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { POSITION_COLUMN } from "constants/Settings";
import React from "react";
import {
	getClients,
	getProjectStatus,
	getProjectTags,
	getProjectTypes
} from "services/settings";
import SettingTable from "../CommonTable";

function Projects() {
	const { data: projectTypes }: { data: any } = useQuery(
		["projectTypes"],
		getProjectTypes
	);
	const { data: projectStatuses }: { data: any } = useQuery(
		["projectStatuses"],
		getProjectStatus
	);
	const { data: projectTags }: { data: any } = useQuery(
		["projectTags"],
		getProjectTags
	);
	const { data: clients }: { data: any } = useQuery(["clients"], getClients);

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};
	return (
		<>
			<Card title="Project Type">
				<SettingTable
					data={projectTypes?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
			<Card title="Project Status">
				<SettingTable
					data={projectStatuses?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
			<Card title="Project Tag">
				<SettingTable
					data={projectTags?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
			<Card title="Clients">
				<SettingTable
					data={clients?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Projects;
