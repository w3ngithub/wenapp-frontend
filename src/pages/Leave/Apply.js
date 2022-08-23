import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Col, Input, Row, Select, Spin } from "antd";
import { filterOptions, handleResponse } from "helpers/utils";
import React, { useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { createLeave, getLeaveTypes } from "services/leaves";
import { Form } from "@ant-design/compatible";
import { getTeamLeads } from "services/users/userDetails";
import { notification } from "helpers/notification";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

function Apply({ ...rest }) {
	const { getFieldDecorator } = rest.form;
	const queryClient = useQueryClient();

	const [leaveType, setLeaveType] = useState("");
	const leaveTypeQuery = useQuery(["leaveType"], getLeaveTypes, {
		select: res => [
			...res?.data?.data?.data?.map(type => ({
				id: type._id,
				value: type?.name.replace("Leave", "").trim()
			}))
		]
	});
	const teamLeadsQuery = useQuery(["teamLeads"], getTeamLeads, {
		select: res => ({
			...res.data,
			data: res?.data?.data?.data.map(lead =>
				lead?.role?.key === "hr" ? { ...lead, name: "Hr" } : lead
			)
		})
	});

	const leaveMutation = useMutation(leave => createLeave(leave), {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave submitted successfully",
				"Leave submittion failed",
				[
					() => rest.form.resetFields(),
					() => queryClient.invalidateQueries(["userLeaves"]),
					() => queryClient.invalidateQueries(["leaves"]),
					() => queryClient.invalidateQueries(["takenAndRemainingLeaveDays"])
				]
			),
		onError: error => {
			notification({ message: "Leave submittion failed!", type: "error" });
		}
	});

	const handleTypesChange = value => {
		setLeaveType(leaveTypeQuery?.data?.find(type => type.id === value).value);
	};

	const handleFormReset = () => rest.form.resetFields();

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}

			leaveMutation.mutate({
				...fieldsValue,
				leaveDates: fieldsValue.leaveDates.join(",").split(",")
			});
		});
	};

	return (
		<Spin spinning={leaveMutation.isLoading}>
			<Form layout="vertical" style={{ padding: "15px 18px" }}>
				<Row type="flex">
					<Col xs={24} sm={6} md={6} style={{flex:0.3}}>
						<FormItem label="Select Leave Dates">
							{getFieldDecorator("leaveDates", {
								rules: [{ required: true, message: "Required!" }]
							})(
								<Calendar
									numberOfMonths={1}
									disableMonthPicker
									disableYearPicker
									multiple
									minDate={
										leaveType === "Sick"
											? new DateObject().subtract(2, "months")
											: new Date()
									}
									mapDays={({ date, today }) => {
										let isWeekend = [0, 6].includes(date.weekDay.index);
										let isOldDate =
											date.day < today.day && leaveType !== "Sick";
										let isOldMonth =
											date.month.index < today.month.index &&
											leaveType !== "Sick";
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
					<Col span={18} xs={24} sm={24} md={15} style={{marginLeft:'6rem'}}>
						<Row type="flex">
							<Col span={12} xs={24} lg={12} md={24}>
								<FormItem label="Leave Type">
									{getFieldDecorator("leaveType", {
										rules: [{ required: true, message: "Required!" }]
									})(
										<Select
											showSearch
											filterOption={filterOptions}
											placeholder="Select Type"
											style={{ width: "100%" }}
											onChange={handleTypesChange}
										>
											{leaveTypeQuery?.data?.map(type => (
												<Option value={type.id} key={type.id}>
													{type.value}
												</Option>
											))}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={10} xs={24} lg={12} md={24}>
								<FormItem label="Select Teams Leads">
									{getFieldDecorator("assignTo", {
										rules: [{ required: true, message: "Required!" }]
									})(
										<Checkbox.Group style={{ width: "100%" }}>
											<Row style={{ flexDirection: "row" }}>
												{teamLeadsQuery?.data?.data?.map(lead => (
													<Col span={12} key={lead._id}>
														<Checkbox className="gx-mb-3" value={lead._id}>
															{lead.name}
														</Checkbox>
													</Col>
												))}
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
										rules: [
											{
												validator: (rule, value, callback) => {
													try {
														if (!value) throw new Error("Required!");

														const trimmedValue = value && value.trim();
														if (trimmedValue?.length < 10) {
															throw new Error(
																"Reason should be at least 10 letters!"
															);
														}
													} catch (err) {
														callback(err.message);
														return;
													}

													callback();
												}
											}
										]
									})(<TextArea placeholder="Enter Leave Reason" rows={10} />)}
								</FormItem>
								<div>
									<Button type="primary" onClick={handleSubmit}>
										Apply
									</Button>
									<Button type="danger" onClick={handleFormReset}>
										Reset
									</Button>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Spin>
	);
}

const ApplyForm = Form.create()(Apply);
export default ApplyForm;
