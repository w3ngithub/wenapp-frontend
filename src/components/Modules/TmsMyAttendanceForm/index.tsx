import React from "react";
import { Button, Col, Form, Input, Modal, Row, Checkbox, Spin } from "antd";
import moment from "moment";
import { FieldTimeOutlined } from "@ant-design/icons";
import LiveTime from "components/Elements/LiveTime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAttendance, updatePunchout } from "services/attendances";
import { handleResponse, sortFromDate } from "helpers/utils";
import { notification } from "helpers/notification";
import { useDispatch, useSelector } from "react-redux";
import { PUNCH_IN, PUNCH_OUT } from "constants/ActionTypes";
import { fetchLoggedInUserAttendance } from "appRedux/actions/Attendance";
import { Dispatch } from "redux";

function TmsMyAttendanceForm({
	title,
	toogle,
	handleCancel
}: {
	title: string;
	toogle: boolean;
	handleCancel: any;
}) {
	const { user } = JSON.parse(localStorage.getItem("user_id") || "{}");

	const [PUnchInform] = Form.useForm();
	const [PUnchOutform] = Form.useForm();

	const queryClient = useQueryClient();
	const dispatch: Dispatch<any> = useDispatch();
	const reduxuserAttendance = useSelector((state: any) => state.attendance);

	const { punchIn, latestAttendance } = reduxuserAttendance;

	const addAttendances: any = useMutation(payload => addAttendance(payload), {
		onSuccess: (response: any) => {
			if (response.status) {
				closeModel();
			}

			handleResponse(response, "Punched Successfully", "Punch  failed", [
				() => {
					dispatch(fetchLoggedInUserAttendance(user._id));
				},
				() => {
					dispatch({ type: PUNCH_OUT });
				},
				() => queryClient.invalidateQueries(["userAttendance"]),
				() => queryClient.invalidateQueries(["adminAttendance"])
			]);
		},
		onError: error => {
			notification({ message: "Punch  failed", type: "error" });
		}
	});

	const punchOutAttendances: any = useMutation(
		(payload: any) => updatePunchout(payload?.userId, payload.payload),
		{
			onSuccess: (response: any) => {
				if (response.status) {
					closeModel();
				}

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

	const handlePunchIn = (values: any) => {
		addAttendances.mutate({
			// attendanceDate: moment()
			// 	.startOf("day")
			// 	.format(),
			punchInTime: moment.utc().format(),
			punchInNote: values.punchInNote
		});
	};

	const handlePunchOut = (values: any) => {
		const lastattendace = sortFromDate(latestAttendance, "punchInTime").at(-1);

		punchOutAttendances.mutate({
			userId: lastattendace._id,
			payload: {
				punchOutNote: values.punchOutNote,
				midDayExit: values.midDayExit ? true : false,
				punchOutTime: moment.utc().format()
			}
		});
	};

	const closeModel = () => {
		PUnchInform.resetFields();
		PUnchOutform.resetFields();
		handleCancel();
	};

	return (
		<Modal
			title={
				<span className="gx-flex-row" style={{ gap: 10, fontWeight: "400" }}>
					{title}
				</span>
			}
			mask={false}
			visible={toogle}
			onCancel={closeModel}
			footer={[
				<Button key="back" onClick={closeModel}>
					Cancel
				</Button>
			]}
		>
			<Spin
				spinning={addAttendances.isLoading || punchOutAttendances.isLoading}
			>
				<Row>
					<Col span={24} sm={24} xs={24}>
						<div
							className="gx-flex-row gx-mb-4"
							style={{ gap: 10, fontWeight: "400" }}
						>
							{" "}
							<FieldTimeOutlined
								style={{ fontSize: "24px", marginTop: "-2px" }}
							/>
							<LiveTime />
							<span>{moment().format("dddd, MMMM D, YYYY")}</span>
						</div>
					</Col>
					{punchIn ? (
						<Col span={24} sm={24} xs={24}>
							<Form
								layout="vertical"
								onFinish={handlePunchIn}
								form={PUnchInform}
							>
								<Form.Item
									label="Punch In Note"
									name="punchInNote"
									rules={[{ required: true, message: "Required!" }]}
									hasFeedback
								>
									<Input.TextArea rows={5} />
								</Form.Item>
								<Form.Item>
									<Button type="primary" htmlType="submit" disabled={!punchIn}>
										Punch In
									</Button>
								</Form.Item>
							</Form>
						</Col>
					) : (
						<Col span={24} sm={24}>
							<Form
								layout="vertical"
								onFinish={handlePunchOut}
								form={PUnchOutform}
							>
								<Form.Item
									label="Punch Out Note"
									name="punchOutNote"
									rules={[{ required: true, message: "Required!" }]}
									hasFeedback
								>
									<Input.TextArea rows={5} />
								</Form.Item>
								<Form.Item name="midDayExit" valuePropName="checked">
									<Checkbox>Mid-day Exit</Checkbox>
								</Form.Item>
								<Form.Item>
									<Button type="primary" htmlType="submit" disabled={punchIn}>
										Punch Out
									</Button>
								</Form.Item>
							</Form>
						</Col>
					)}
				</Row>
			</Spin>
		</Modal>
	);
}

export default TmsMyAttendanceForm;
