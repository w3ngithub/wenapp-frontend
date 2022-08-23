import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Checkbox, Spin } from "antd";
import moment from "moment";
import { FieldTimeOutlined } from "@ant-design/icons";
import LiveTime from "components/Elements/LiveTime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAttendance, updatePunchout } from "services/attendances";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";

function TmsMyAttendanceForm({
	title,
	toogle,
	handleCancel
}: {
	title: string;
	toogle: boolean;
	handleCancel: any;
}) {
	const [PUnchInform] = Form.useForm();
	const [PUnchOutform] = Form.useForm();

	const queryClient = useQueryClient();

	const addAttendances: any = useMutation(payload => addAttendance(payload), {
		onSuccess: (response: any) => {
			if (response.status) {
				closeModel();
			}

			handleResponse(response, "Punched Successfully", "Punch  failed", [
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
			onSuccess: (response: any) => {
				if (response.status) {
					closeModel();
				}

				handleResponse(response, "Punched Successfully", "Punch  failed", [
					() => queryClient.invalidateQueries(["userAttendance"])
				]);
			},
			onError: error => {
				notification({ message: "Punch  failed", type: "error" });
			}
		}
	);

	const handlePunchIn = (values: any) => {
		addAttendances.mutate({
			attendanceDate: moment()
				.startOf("day")
				.format(),
			punchInTime: moment.utc().format(),
			punchInNote: values.punchInNote
		});
	};

	const handlePunchOut = (values: any) => {
		// punchOutAttendances.mutate({
		// 	userId: punch._id,
		// 	payload: {
		// 		punchOutNote: values.punchOutNote,
		// 		midDayExit: values.midDayExit ? true : false
		// 	}
		// });
	};

	const closeModel = () => {
		PUnchInform.resetFields();
		PUnchOutform.resetFields();
		handleCancel();
	};

	return (
		<Modal
			width={"85%"}
			title={
				<span className="gx-d-flex" style={{ gap: 10, fontWeight: "400" }}>
					{title}
					<FieldTimeOutlined style={{ fontSize: "24px" }} />
					<LiveTime />
					<span>{moment().format("dddd, MMMM D, YYYY")}</span>
				</span>
			}
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
					<Col span={24} sm={12} xs={24}>
						<Form layout="vertical" onFinish={handlePunchIn} form={PUnchInform}>
							<Form.Item
								label="Punch In Note"
								name="punchInNote"
								rules={[{ required: true, message: "Required!" }]}
								hasFeedback
							>
								<Input.TextArea rows={5} />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Punch In
								</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col span={24} sm={12}>
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
								<Button type="primary" htmlType="submit">
									Punch Out
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Spin>
		</Modal>
	);
}

export default TmsMyAttendanceForm;
