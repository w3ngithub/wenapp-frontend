import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Col, Input, Row, Select, Spin, Form } from "antd";
import { filterOptions, handleResponse } from "helpers/utils";
import React, { useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { createLeave, getLeaveTypes } from "services/leaves";
import { useSelector } from "react-redux";
import { getTeamLeads } from "services/users/userDetails";
import { notification } from "helpers/notification";
import { THEME_TYPE_DARK } from "constants/ThemeSetting";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { getAllHolidays } from "services/resources";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

function Apply() {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	const { themeType } = useSelector(state => state.settings);
	const darkCalendar = themeType === THEME_TYPE_DARK;

	const [leaveType, setLeaveType] = useState("");

	const { data: Holidays } = useQuery(["DashBoardHolidays"], () =>
		getAllHolidays({ sort: "-createdAt", limit: "1" })
	);

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
					() => form.resetFields(),
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

	const handleFormReset = () => form.resetFields();

	const handleSubmit = () => {

		form.validateFields().then(values =>
			leaveMutation.mutate({
				...values,
				leaveDates: values.leaveDates.join(",").split(",")
			})
		);
	};
	const holidaysThisYear = Holidays?.data?.data?.data?.[0]?.holidays?.map(
		holiday => ({
			date: new Date(holiday?.date).getDate(),
			name: holiday?.title
		})
	);

	return (
		<Spin spinning={leaveMutation.isLoading}>
			<Form layout="vertical" style={{ padding: "15px 18px" }} form={form}>
				<Row type="flex">
					<Col xs={24} sm={6} md={6} style={{ flex: 0.3, marginRight: "6rem" }}>
						<FormItem
							label="Select Leave Dates"
							name="leaveDates"
							rules={[{ required: true, message: "Required!" }]}
						>
							<Calendar
								className={darkCalendar ? "bg-dark" : "null"}
								numberOfMonths={1}
								disableMonthPicker
								disableYearPicker
								weekStartDayIndex={1}
								multiple
								minDate={
									leaveType === "Sick"
										? new DateObject().subtract(2, "months")
										: new Date()
								}
								mapDays={({ date, today }) => {
									let isWeekend = [0, 6].includes(date.weekDay.index);
									let holidayList = holidaysThisYear?.filter(
										holiday => date.day === holiday?.date
									);
									let isHoliday = holidayList?.length > 0;
									if (isWeekend || isHoliday)
										return {
											disabled: true,
											style: { color: isWeekend ? "#ccc" : "rgb(237 45 45)" },
											onClick: () =>
												alert(
													isWeekend
														? "weekends are disabled"
														: `${holidayList[0]?.name} holiday`
												)
										};
								}}
							/>
						</FormItem>
						<small style={{ color: "red", fontSize: "14px", width: "10%" }}>
							*Disabled dates are holidays
						</small>
					</Col>
					<Col span={18} xs={24} sm={24} md={15}>
						<Row type="flex">
							<Col span={12} xs={24} lg={12} md={24}>
								<FormItem
									label="Leave Type"
									name="leaveType"
									rules={[{ required: true, message: "Required!" }]}
								>
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
								</FormItem>
							</Col>
							<Col span={10} xs={24} lg={12} md={24}>
								<FormItem
									label="Select Team Leads"
									name="assignTo"
									rules={[{ required: true, message: "Required!" }]}
								>
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
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem label="Leave Reason" name="reason" rules={[
											{
												validator:async(rule, value) => {
													try {
														if (!value) throw new Error("Required!");

														const trimmedValue = value && value.trim();
														if (trimmedValue?.length < 10) {
															throw new Error(
																"Reason should be at least 10 letters!"
															);
														}
													} catch (err) {
														throw new Error(err.message);
													}
												}
											}
										]}>
								<TextArea placeholder="Enter Leave Reason" rows={10} />
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

export default Apply;
