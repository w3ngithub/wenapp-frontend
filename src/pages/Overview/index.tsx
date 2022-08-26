import React from "react";
import { Card } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getLeavesOfAllUsers } from "services/leaves";
import moment from "moment";
import { formatToUtc, sortFromDate } from "helpers/utils";
import { notification } from "helpers/notification";
import LeaveEmployee from "./LeaveEmployee";
import CheckedInEmployee from "./CheckInEmployee";
import { intialDate } from "constants/Attendance";
import { searchAttendacentOfUser } from "services/attendances";
import CircularProgress from "components/Elements/CircularProgress";

const Overview = () => {
	const { data: leaves, isLoading: leaveLoading } = useQuery(
		["leavesOverview"],
		() =>
			getLeavesOfAllUsers(
				"approved",
				"",
				moment.utc(formatToUtc(moment().startOf("day"))).format()
			),
		{
			onError: error => {
				notification({ message: "Could not approve leave", type: "error" });
			}
		}
	);

	const { data: CheckedIn, isLoading: checkInLoading } = useQuery(
		["checkInOverview"],
		() =>
			searchAttendacentOfUser({
				// page: page.page + "",
				// limit: page.limit + "",
				fromDate: moment.utc(intialDate[0]).format(),
				toDate: moment.utc(intialDate[1]).format()
			})
	);

	const leavesSection = leaves?.data?.data?.data || [];
	const checkInSecition =
		CheckedIn?.data?.data?.attendances?.[0]?.data?.map((d: any) => ({
			...d,
			data: sortFromDate(d?.data, "punchInTime")
		})) || [];

	if (leaveLoading || checkInLoading) {
		return <CircularProgress className="" />;
	}

	return (
		<div>
			<LeaveEmployee leaves={leavesSection} />
			<CheckedInEmployee checkIn={checkInSecition} />
			<Card
				title={
					<h3>
						<WalletOutlined />
						<span className="gx-ml-3">Employee who have not checked in</span>
					</h3>
				}
			></Card>
		</div>
	);
};

export default Overview;
