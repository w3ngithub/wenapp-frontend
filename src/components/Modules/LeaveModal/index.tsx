import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Row, Col, Spin } from "antd";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLeaveOfUser, getLeaveTypes, updateLeave } from "services/leaves";
import { filterOptions, handleResponse } from "helpers/utils";
import leaveTypeInterface from "types/Leave";
import { notification } from "helpers/notification";

const { Option } = Select;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 16 }
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 24 }
	}
};

function LeaveModal({
	leaveData,
	isEditMode,
	open,
	readOnly = false,
	onClose,
	users
}: {
	leaveData: any;
	isEditMode: boolean;
	open: boolean;
	onClose: () => void;
	users: any;
	readOnly: boolean;
}) {
	const queryClient = useQueryClient();

	const [form] = Form.useForm();
	const [leaveType, setLeaveType] = useState("");
	const [user, setUser] = useState("");
	const [leaveId, setLeaveId] = useState(null);

	const leaveTypeQuery = useQuery(["leaveType"], getLeaveTypes, {
		select: res => [
			...res?.data?.data?.data?.map((type: leaveTypeInterface) => ({
				id: type._id,
				value: type?.name.replace("Leave", "").trim()
			}))
		]
	});

	const leaveMutation = useMutation((leave: any) => createLeaveOfUser(leave), {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave created successfully",
				"Leave creation failed",
				[() => queryClient.invalidateQueries(["leaves"]), () => onClose()]
			),
		onError: error => {
			notification({ message: "Leave creation failed!", type: "error" });
		}
	});

	const leaveUpdateMutation = useMutation((leave: any) => updateLeave(leave), {
		onSuccess: response =>
			handleResponse(
				response,
				"Leave updated successfully",
				"Leave update failed",
				[() => queryClient.invalidateQueries(["leaves"]), () => onClose()]
			),
		onError: error => {
			notification({ message: "Leave update failed!", type: "error" });
		}
	});

	const onFinish = (values: any) => {
		form.submit();
		const data = form.getFieldsValue();
		const newLeave = {
			leaveDates: data.leaveDates.join(",").split(","),
			reason: data.reason,
			leaveType: data.leaveType
		};
		if (isEditMode) leaveUpdateMutation.mutate({ id: leaveId, data: newLeave });
		else
			leaveMutation.mutate({
				id: data.user,
				data: newLeave
			});
	};

	const handleLeaveTypeChange = (value: string) => {
		setLeaveType(leaveTypeQuery?.data?.find(type => type.id === value).value);
	};

	const handleUserChange = (user: string) => {
		setUser(user);
	};

	useEffect(() => {
		if (open) {
			if (isEditMode) {
				form.setFieldsValue({
					leaveType: leaveData.leaveType._id,
					leaveDates: leaveData.leaveDates,
					reason: leaveData.reason,
					user: leaveData.user._id
				});
				setUser(leaveData.user._id);
				setLeaveId(leaveData._id);
			}
		}

		if (!open) form.resetFields();
	}, [open]);
	return (
		<Modal
			width={1100}
			title={!isEditMode ? "Add Leave" : readOnly ? "Details" : "Update Leave"}
			style={{ flexDirection: "row" }}
			visible={open}
			onOk={onFinish}
			onCancel={onClose}
			footer={
				readOnly
					? [
							<Button key="back" onClick={onClose}>
								Cancel
							</Button>
					  ]
					: [
							<Button key="back" onClick={onClose}>
								Cancel
							</Button>,
							<Button key="submit" type="primary" onClick={onFinish}>
								Submit
							</Button>
					  ]
			}
		>
			<Spin spinning={leaveMutation.isLoading || leaveUpdateMutation.isLoading}>
				<Form {...layout} form={form} name="control-hooks" layout="vertical">
					<Row>
						<Col span={6} xs={24} sm={16} style={{ paddingLeft: 0 }}>
							<Row>
								<Col span={6} xs={24} sm={12}>
									<Form.Item
										{...formItemLayout}
										name="leaveType"
										label="Leave Type"
										rules={[{ required: true, message: "Required!" }]}
									>
										<Select
											showSearch
											filterOption={filterOptions}
											placeholder="Select Leave Type"
											allowClear
											onChange={handleLeaveTypeChange}
											disabled={readOnly}
										>
											{leaveTypeQuery?.data?.map(type => (
												<Option value={type.id} key={type.id}>
													{type.value}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={6} xs={24} sm={12}>
									<Form.Item
										{...formItemLayout}
										name="user"
										label="User"
										rules={[{ required: true, message: "Required!" }]}
									>
										<Select
											showSearch
											filterOption={filterOptions}
											placeholder="Select User"
											onChange={handleUserChange}
											disabled={readOnly}
											allowClear
										>
											{users?.map((user: any) => (
												<Option value={user._id} key={user._id}>
													{user?.name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col span={6} xs={24} sm={24} xl={24}>
									<Form.Item
										{...formItemLayout}
										name="reason"
										label="Leave Reason"
										rules={[{ required: true, message: "Required!" }]}
									>
										<Input.TextArea allowClear rows={10} disabled={readOnly}/>
									</Form.Item>
								</Col>
							</Row>
						</Col>
						{user && (
							<Col span={6} xs={24} sm={8}>
								<Form.Item
									{...formItemLayout}
									name="leaveDates"
									label="Select Leave Date"
									rules={[{ required: true, message: "Required!" }]}
								>
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
										mapDays={({ date }) => {
											let isWeekend = [0, 6].includes(date.weekDay.index);
											
											if (isWeekend )
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
										disabled={readOnly}
									/>
								</Form.Item>

								<small
									style={{
										color: "red",
										fontSize: "14px",
										width: "10%",
										paddingLeft: 15
									}}
								>
									*Disabled dates are holidays
								</small>
							</Col>
						)}
					</Row>
				</Form>
			</Spin>
		</Modal>
	);
}

export default LeaveModal;
