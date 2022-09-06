import React, { useState } from "react";
import { Card, Table } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { OVERVIEW_CHECKEDIN } from "constants/Overview";
import moment from "moment";
import LocationMap from "./LocationMap";

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
		checkInLocation: "Show On Map",
		punchInLocation: user?.data?.[0]?.punchInLocation,
		punchOutLocation: user?.data?.[user?.data.length - 1]?.punchOutLocation
	}));
};

function CheckedInEmployee({ checkIn }: { checkIn: any[] }) {
	const [openMap, setOpenMap] = useState(false);
	const [sort, setSort] = useState({});
	const [selectedCheckedInUser, setSelectedCheckedInUser] = useState([]);

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		setSort(sorter);
	};

	const handleShowMap = (record: any, PunchOut: string | undefined) => {
		if (PunchOut) {
			if (
				Array.isArray(record?.punchOutLocation) &&
				record?.punchOutLocation?.length === 2
			) {
				setOpenMap(true);
				setSelectedCheckedInUser(record?.punchOutLocation || undefined);
			} else {
				return;
			}
		} else {
			setOpenMap(true);
			setSelectedCheckedInUser(record?.punchInLocation || undefined);
		}
	};
	return (
		<>
			<LocationMap
				title="Ashok Ganika"
				open={openMap}
				onClose={() => {
					setOpenMap(false);
				}}
				location={selectedCheckedInUser}
			/>
			<Card
				title={
					<h3>
						<WalletOutlined />
						<span className="gx-ml-3">Co-workers who already punched in</span>
					</h3>
				}
			>
				<Table
					className="gx-table-responsive"
					columns={OVERVIEW_CHECKEDIN(sort, handleShowMap)}
					dataSource={formattedUsers(checkIn)}
					onChange={handleTableChange}
					pagination={false}
				/>
			</Card>
		</>
	);
}

export default CheckedInEmployee;
