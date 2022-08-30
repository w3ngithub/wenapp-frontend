import React, { useState } from "react";
import { Card, Table } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { OVERVIEW_CHECKEDIN } from "constants/Overview";
import moment from "moment";

const formattedUsers = (users: any[]) => {
	return users?.map(user => ({
		...user,
		key: user._id.attendanceDate + user._id.user,
		name: user._id.user,
		checkIn: moment(user?.data?.[0]?.punchInTime).format("LTS"),
		checkOut: user?.data?.[user?.data.length - 1]?.punchOutTime
			? moment(user?.data?.[user?.data.length - 1]?.punchOutTime).format("LTS")
			: "N/A",
		checkOutLocation: "Show On Map",
		checkInLocation: "Show On Map"
	}));
};

function CheckedInEmployee({ checkIn }: { checkIn: any[] }) {
	const [sort, setSort] = useState({});

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		setSort(sorter);
	};
	return (
		<Card
			title={
				<h3>
					<WalletOutlined />
					<span className="gx-ml-3">Coworkers Who already punched in</span>
				</h3>
			}
		>
			<Table
				className="gx-table-responsive"
				columns={OVERVIEW_CHECKEDIN(sort)}
				dataSource={formattedUsers(checkIn)}
				onChange={handleTableChange}
				pagination={false}
			/>
		</Card>
	);
}

export default CheckedInEmployee;
