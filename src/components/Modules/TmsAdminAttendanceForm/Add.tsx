import React from "react";
import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Checkbox,
	Spin,
	DatePicker,
	TimePicker,
	Select
} from "antd";
import moment from "moment";
import { FieldTimeOutlined } from "@ant-design/icons";
import LiveTime from "components/Elements/LiveTime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserAttendance } from "services/attendances";
import { filterOptions, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";

function TmsAdminAddAttendanceForm({
	toogle,
	handleCancel,
	users
}: {
	toogle: boolean;
	handleCancel: any;
	users: any[];
}) {
	const [PUnchform] = Form.useForm();
	const queryClient = useQueryClient();

	const addAttendances: any = useMutation(
		(payload: any) => addUserAttendance(payload.id, payload.payload),
		{
			onSuccess: (response: any) => {
				if (response.status) {
					closeModel();
				}
				handleResponse(
					response,
					"Punch added Successfully",
					"Punch add failed",
					[() => queryClient.invalidateQueries(["adminAttendance"])]
				);
			},
			onError: error => {
				notification({ message: "Punch add failed", type: "error" });
			}
		}
	);

	const handleAdd = (values: any) => {
		const attendanceDate = moment(values.attendanceDate)
			.startOf("day")
			.format();
		const punchInTime =
			moment
				.utc(attendanceDate)
				.format()
				.split("T")[0] +
			"T" +
			moment
				.utc(values.punchInTime)
				.format()
				.split("T")[1];
		const punchOutTime = values.punchOutTime
			? moment
					.utc(attendanceDate)
					.format()
					.split("T")[0] +
			  "T" +
			  moment
					.utc(values.punchOutTime)
					.format()
					.split("T")[1]
			: undefined;
		const payload = {
			...values,
			attendanceDate,
			punchInTime,
			punchOutTime: punchOutTime
		};
		addAttendances.mutate({ id: values.user, payload });
	};

	const closeModel = () => {
		PUnchform.resetFields();
		handleCancel();
	};

	return (
		<Modal
			width={"85%"}
			title={
				<span className="gx-d-flex" style={{ gap: 10, fontWeight: "400" }}>
					<FieldTimeOutlined style={{ fontSize: "24px" }} />
					<LiveTime />
					<span>{moment().format("dddd, MMMM D, YYYY")}</span>
				</span>
			}
			visible={toogle}
			onCancel={closeModel}
			footer={[
				<>
					<Button type="primary" form="myForm" key="submit" htmlType="submit">
						Add
					</Button>
					<Button key="back" onClick={closeModel}>
						Cancel
					</Button>
				</>
			]}
		>
			<Spin spinning={addAttendances.isLoading}>
				<Form
					layout="vertical"
					onFinish={handleAdd}
					form={PUnchform}
					id="myForm"
					initialValues={{
						punchInTime: moment("09:00:00 AM", "HH:mm:ss a"),
						punchOutTime: moment("06:00:00 PM", "HH:mm:ss a")
					}}
				>
					<Row>
						<Col span={24} sm={12}>
							<Row>
								<Form.Item
									name="user"
									rules={[{ required: true, message: "Required!" }]}
								>
									<Select
										style={{ width: 200, marginRight: 20 }}
										showSearch
										filterOption={filterOptions}
										placeholder="Select User"
									>
										{users?.map(type => (
											<Select.Option value={type._id} key={type._id}>
												{type.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item
									name="attendanceDate"
									rules={[{ required: true, message: "Required!" }]}
								>
									<DatePicker />
								</Form.Item>
							</Row>
						</Col>
					</Row>
					<Row>
						<Col span={24} sm={12} xs={24}>
							<Form.Item
								name="punchInTime"
								rules={[{ required: true, message: "Required!" }]}
								hasFeedback
							>
								<TimePicker
									use12Hours
									format="h:mm:ss A"
									defaultValue={moment("09:00:00 AM", "HH:mm:ss a")}
								/>
							</Form.Item>
							<Form.Item label="Punch In Note" name="punchInNote" hasFeedback>
								<Input.TextArea rows={5} />
							</Form.Item>
						</Col>
						<Col span={24} sm={12}>
							<div className="gx-d-flex" style={{ gap: 20 }}>
								<Form.Item name="punchOutTime" hasFeedback>
									<TimePicker
										use12Hours
										format="h:mm:ss A"
										defaultValue={moment("06:00:00 PM", "HH:mm:ss a")}
									/>
								</Form.Item>
								<Form.Item name="midDayExit" valuePropName="checked">
									<Checkbox>Mid-day Exit</Checkbox>
								</Form.Item>
							</div>
							<Form.Item label="Punch Out Note" name="punchOutNote" hasFeedback>
								<Input.TextArea rows={5} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	);
}

export default TmsAdminAddAttendanceForm;
