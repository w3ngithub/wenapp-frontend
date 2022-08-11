import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { LEAVE_TYPES } from "constants/Leaves";
import React, { useState } from "react";
import { Calendar } from "react-multi-date-picker";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

function Apply({ ...rest }) {
	const { getFieldDecorator, setFieldsValue } = rest.form;
	const [leaveType, setLeaveType] = useState("");

	const handleTypesChange = value => {
		setLeaveType(value);
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			console.log("selected dates :\n" + fieldsValue.dates.join(","));
			if (err) {
				return;
			}
		});
	};

	return (
		<div>
			<Form layout="vertical" style={{ padding: "10px 40px" }}>
				<Row type="flex">
					<Col span={6} xs={24} sm={6}>
						<FormItem label="Select Leave Dates">
							{getFieldDecorator("dates", {
								rules: [{ required: true, message: "Required!" }]
							})(
								<Calendar
									numberOfMonths={1}
									disableMonthPicker
									disableYearPicker
									multiple
									mapDays={({ date, today }) => {
										console.log(date.month.index, today.month.index);
										let isWeekend = [0, 6].includes(date.weekDay.index);
										let isOldDate =
											date.day < today.day && leaveType !== "sick";
										let isOldMonth = date.month.index < today.month.index;

										if (isWeekend || isOldDate || isOldMonth)
											return {
												disabled: true,
												style: { color: "#ccc" },
												onClick: () =>
													alert(
														isWeekend
															? "weekends are disabled"
															: "past dates are disabled"
													)
											};
									}}
								/>
							)}
						</FormItem>
						<small style={{ color: "red", fontSize: "14px", width: "10%" }}>
							*Disabled dates are holidays
						</small>
					</Col>
					<Col span={18} xs={24} sm={24} md={24} lg={24} xl={18}>
						<Row type="flex">
							<Col span={12} xs={24} lg={12} md={24}>
								<FormItem label="Leave Type">
									{getFieldDecorator("type", {
										rules: [{ required: true, message: "Required!" }]
									})(
										<Select
											placeholder="Select Type"
											style={{ width: "100%" }}
											onChange={handleTypesChange}
										>
											{LEAVE_TYPES.map(type => (
												<Option value={type.id} key={type.id}>
													{type.value}
												</Option>
											))}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={12} xs={24} lg={12} md={24}>
								<FormItem label="Select Teams Leads">
									{getFieldDecorator("leads", {
										rules: [{ required: true, message: "Required!" }]
									})(
										<Checkbox.Group style={{ width: "100%" }}>
											<Row style={{ flexDirection: "row" }}>
												<Col span={8}>
													<Checkbox className="gx-mb-3">A</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox className="gx-mb-3">B</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox className="gx-mb-3">C</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox className="gx-mb-3">D</Checkbox>
												</Col>
												<Col span={8}>
													<Checkbox className="gx-mb-3">E</Checkbox>
												</Col>
											</Row>
										</Checkbox.Group>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem label="Leave Reason">
									{getFieldDecorator("reason", {
										rules: [{ required: true, message: "Required!" }]
									})(<TextArea placeholder="Enter Leave Reason" rows={10} />)}
								</FormItem>
								<div>
									<Button type="primary" onClick={handleSubmit}>
										Apply
									</Button>
									<Button type="danger">Reset</Button>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</div>
	);
}

const ApplyForm = Form.create()(Apply);
export default ApplyForm;
