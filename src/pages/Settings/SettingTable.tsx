import { Button, Table } from "antd";
import React from "react";

function SettingTable({
	data,
	columns,
	isLoading
}: {
	data: any;
	columns: any;
	isLoading?: boolean;
}) {
	return (
		<>
			<div className="gx-d-flex gx-justify-content-between gx-flex-row">
				<div></div>
				<Button
					className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
					// onClick={handleOpenModal}
				>
					Add
				</Button>
			</div>
			<Table
				className="gx-table-responsive"
				columns={columns}
				dataSource={data}
				// pagination={{
				// 	current: page.page,
				// 	pageSize: page.limit,
				// 	pageSizeOptions: ["5", "10", "20", "50"],
				// 	showSizeChanger: true,
				// 	total: userLeavesQuery?.data?.data?.data?.count || 1,
				// 	onShowSizeChange,
				// 	hideOnSinglePage: true,
				// 	onChange: handlePageChange
				// }}
				loading={isLoading}
			/>
		</>
	);
}

export default SettingTable;
