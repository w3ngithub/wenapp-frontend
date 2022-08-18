import React, { useState } from "react";
import { ScheduleOutlined } from "@ant-design/icons";
import moment from "moment";
import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LiveTime from "./../LiveTime/index";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import { addAttendance } from "services/attendances";

function PunchInOut() {
	const [punch, setPunch] = useState<string>("Punch In  ");

	const queryClient = useQueryClient();

	const addAttendances: any = useMutation(payload => addAttendance(payload), {
		onSuccess: response =>
			handleResponse(response, "Punched Successfully", "Punch  failed", [
				() => queryClient.invalidateQueries(["userAttendance"])
			]),
		onError: error => {
			notification({ message: "Notice update failed", type: "error" });
		}
	});

	const handlePunch = (): void => {
		addAttendances.mutate({
			attendanceDate: moment.utc().format(),
			punchInTime: moment.utc().format()
		});
		setPunch(prev =>
			prev === "Punch In  " ? "Punch Out    " : "Office Hour 9Hr"
		);
	};
	return (
		<>
			<Button
				onClick={handlePunch}
				className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
				icon={<ScheduleOutlined />}
			>
				{punch} {punch !== "Office Hour 9Hr" && <LiveTime />}
			</Button>
		</>
	);
}

export default PunchInOut;
