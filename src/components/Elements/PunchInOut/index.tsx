import React, { useEffect, useState } from "react";
import { ScheduleOutlined } from "@ant-design/icons";
import moment from "moment";
import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LiveTime from "../LiveTime/index";
import {
	checkIfTimeISBetweenOfficeHour,
	handleResponse,
	sortFromDate
} from "helpers/utils";
import { notification } from "helpers/notification";
import { addAttendance, updatePunchout } from "services/attendances";
import { useDispatch, useSelector } from "react-redux";
import { PUNCH_IN, PUNCH_OUT } from "constants/ActionTypes";
import { fetchLoggedInUserAttendance } from "appRedux/actions/Attendance";
import { Dispatch } from "redux";
import TmsMyAttendanceForm from "components/Modules/TmsMyAttendanceForm";

function PunchInOut() {
	const { user } = JSON.parse(localStorage.getItem("user_id") || "{}");

	const [toogle, setToogle] = useState(false);

	const queryClient = useQueryClient();
	const dispatch: Dispatch<any> = useDispatch();
	const reduxuserAttendance = useSelector((state: any) => state.attendance);

	const { punchIn, latestAttendance } = reduxuserAttendance;

	useEffect(() => {
		if (
			latestAttendance?.length === 0 ||
			typeof latestAttendance === "undefined"
		) {
			dispatch({ type: PUNCH_IN });
		} else {
			const lastattendace = sortFromDate(latestAttendance, "punchInTime").at(
				-1
			);
			lastattendace?.punchOutTime
				? dispatch({ type: PUNCH_IN })
				: dispatch({ type: PUNCH_OUT });
		}
	}, [latestAttendance, dispatch]);

	const addAttendances = useMutation((payload: any) => addAttendance(payload), {
		onSuccess: response => {
			handleResponse(response, "Punched Successfully", "Punch  failed", [
				() => queryClient.invalidateQueries(["adminAttendance"]),
				() => queryClient.invalidateQueries(["userAttendance"]),
				() => {
					dispatch(fetchLoggedInUserAttendance(user._id));
				},
				() => {
					dispatch({ type: PUNCH_OUT });
				}
			]);
		},
		onError: error => {
			notification({ message: "Punch  failed", type: "error" });
		}
	});

	const punchOutAttendances = useMutation(
		(payload: { userId: string; payload: any }) =>
			updatePunchout(payload?.userId, payload.payload),
		{
			onSuccess: response => {
				handleResponse(response, "Punched Successfully", "Punch  failed", [
					() => {
						dispatch(fetchLoggedInUserAttendance(user._id));
					},
					() => {
						dispatch({ type: PUNCH_IN });
					},
					() => queryClient.invalidateQueries(["userAttendance"]),
					() => queryClient.invalidateQueries(["adminAttendance"])
				]);
			},
			onError: error => {
				notification({ message: "Punch  failed", type: "error" });
			}
		}
	);

	const handlePunch = () => {
		if (checkIfTimeISBetweenOfficeHour()) {
			setToogle(true);
			return;
		}
		if (!punchIn) {
			const lastattendace = sortFromDate(latestAttendance, "punchInTime").at(
				-1
			);
			punchOutAttendances.mutate({
				userId: lastattendace?._id,
				payload: {
					punchOutNote: "",
					midDayExit: false,
					punchOutTime: moment.utc().format()
				}
			});
		} else {
			addAttendances.mutate({
				// attendanceDate: moment()
				// 	.startOf("day")
				// 	.format(),
				punchInTime: moment.utc().format()
			});
		}
	};
	return (
		<>
			<TmsMyAttendanceForm
				title="Time Attendance"
				toogle={toogle}
				handleCancel={() => setToogle(false)}
			/>
			<Button
				onClick={handlePunch}
				className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
				icon={<ScheduleOutlined />}
				disabled={addAttendances.isLoading || punchOutAttendances.isLoading}
			>
				{punchIn ? "Punch In" : "Punch Out"}
				<LiveTime />
			</Button>
		</>
	);
}

export default PunchInOut;
