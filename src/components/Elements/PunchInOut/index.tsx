import React, { useEffect, useState } from "react";
import { ScheduleOutlined } from "@ant-design/icons";
import moment from "moment";
import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LiveTime from "./../LiveTime/index";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import { addAttendance, updatePunchout } from "services/attendances";

function PunchInOut() {
	const [punch, setPunch] = useState<string>("Punch In  ");

	const punchTime = JSON.parse(localStorage.getItem("punch") || "{}");

	const queryClient = useQueryClient();

	useEffect(() => {
		if (punchTime._id) {
			setPunch(prev => "Punch Out");
		}
	}, [punchTime]);

	const addAttendances: any = useMutation(payload => addAttendance(payload), {
		onSuccess: response => {
			if (response.status) {
				localStorage.setItem("punch", JSON.stringify(response.data.data.data));
			}
			setPunch(prev =>
				prev === "Punch In  " ? "Punch Out    " : "Punch In  "
			);

			handleResponse(response, "Punched Successfully", "Punch  failed", [
				() => queryClient.invalidateQueries(["adminAttendance"]),
				() => queryClient.invalidateQueries(["userAttendance"])
			]);
		},
		onError: error => {
			notification({ message: "Punch  failed", type: "error" });
		}
	});

	const punchOutAttendances: any = useMutation(
		(payload: any) => updatePunchout(payload?.userId, payload.payload),
		{
			onSuccess: response => {
				if (response.status) {
					localStorage.removeItem("punch");
				}
				setPunch(prev =>
					prev === "Punch In  " ? "Punch Out    " : "Punch In  "
				);

				handleResponse(response, "Punched Successfully", "Punch  failed", [
					() => queryClient.invalidateQueries(["userAttendance"]),
					() => queryClient.invalidateQueries(["adminAttendance"])
				]);
			},
			onError: error => {
				notification({ message: "Punch  failed", type: "error" });
			}
		}
	);

	const handlePunch = (): void => {
		if (punchTime?._id) {
			punchOutAttendances.mutate({
				userId: punchTime._id,
				payload: {
					punchOutNote: "",
					midDayExit: false
				}
			});
		} else {
			addAttendances.mutate({
				attendanceDate: moment()
					.startOf("day")
					.format(),
				punchInTime: moment.utc().format()
			});
		}
	};
	return (
		<>
			<Button
				onClick={handlePunch}
				className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
				icon={<ScheduleOutlined />}
				disabled={addAttendances.isLoading || punchOutAttendances.isLoading}
			>
				{punch} {punch !== "Office Hour 9Hr" && <LiveTime />}
			</Button>
		</>
	);
}

export default PunchInOut;
