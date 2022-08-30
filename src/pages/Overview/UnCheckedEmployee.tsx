import React, { useState } from "react";
import { Card, Table } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { OVERVIEW_NOTCHECKEDIN } from "constants/Overview";

const formattedUsers = (users: any[]) => {
	return users?.map(user => ({
		key: user._id,
		name: user.name,
		checkIn: "N/A",
		checkOut: "N/A"
	}));
};

function UnCheckedInEmployee({
	notCheckInSection
}: {
	notCheckInSection: any[];
}) {
	const [sort, setSort] = useState({});

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		setSort(sorter);
	};
	return (
		<Card
			title={
				<h3>
					<WalletOutlined />
					<span className="gx-ml-3">Employee who have not checked in</span>
				</h3>
			}
		>
			<Table
				className="gx-table-responsive"
				columns={OVERVIEW_NOTCHECKEDIN(sort)}
				dataSource={formattedUsers(notCheckInSection)}
				onChange={handleTableChange}
				pagination={false}
			/>
		</Card>
	);
}

export default UnCheckedInEmployee;
