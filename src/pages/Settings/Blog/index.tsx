import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../SettingTable";
import { getBlogCategories } from "services/settings";
import { POSITION_COLUMN } from "constants/Settings";

function Blog() {
	const { data: blogCategories }: { data: any } = useQuery(
		["blogCategories"],
		getBlogCategories
	);

	const handleDeleteClick = () => {};

	const handleEditClick = () => {};

	return (
		<>
			<Card title="Category">
				<SettingTable
					data={blogCategories?.data?.data?.data}
					columns={POSITION_COLUMN(handleDeleteClick, handleEditClick)}
				/>
			</Card>
		</>
	);
}

export default Blog;
