import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "services/projects";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 16 }
	}
};

function LogtimeModal({
	toggle,
	onClose,
	logTypes,
	onSubmit,
	initialValues = {},
	loading = false,
	isEditMode,
	isUserLogtime = false,
	...rest
}) {
	const { getFieldDecorator } = rest.form;
	const [types, setTypes] = useState([]);
	const projectsQuery = useQuery(["projects"], getAllProjects, {
		enabled: false
	});

	const handleCancel = () => {
		rest.form.resetFields();
		onClose();
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			onSubmit({ ...initialValues, ...fieldsValue }, rest);
		});
	};

	useEffect(() => {
		if (toggle) {
			setTypes(logTypes.data?.data?.data);
			projectsQuery.refetch();
			if (isEditMode) {
				rest.form.setFieldsValue({
					...initialValues,
					logDate: moment(initialValues?.logDate),
					hours: initialValues?.hours,
					minutes: initialValues?.minutes,
					logType: initialValues?.logType._id,
					remarks: initialValues?.remarks,
					user: initialValues?.user._id
				});
			}
		}
	}, [toggle]);
	return (
		<Modal
			title={isEditMode ? "Update Log Time" : "Add Log Time"}
			visible={toggle}
			onOk={handleSubmit}
			onCancel={handleCancel}
			footer={[
				<Button key="back" onClick={handleCancel}>
					Cancel
				</Button>,
				<Button key="submit" type="primary" onClick={handleSubmit}>
					Submit
				</Button>
			]}
		>
			<Spin spinning={loading}>
				<Form>
					<FormItem {...formItemLayout} label="Date" hasFeedback>
						{getFieldDecorator("logDate", {
							rules: [
								{
									message: "Required!",
									required: true
								}
							]
						})(
							<DatePicker
								className=" gx-w-100"
								placeholder="Select Date"
								disabledDate={current =>
									(current &&
										current <
											moment()
												.subtract(1, "days")
												.startOf("day")) ||
									current > moment().endOf("day")
								}
							/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="Hours" hasFeedback>
						{getFieldDecorator("hours", {
							rules: [
								{
									required: true,
									message: "Required!"
								}
							]
						})(<Input placeholder="Enter Hours" type="number" />)}
					</FormItem>
					<FormItem {...formItemLayout} label="Minutes" hasFeedback>
						{getFieldDecorator("minutes", {
							rules: [
								{
									required: true,
									message: "Required!"
								}
							]
						})(<Input placeholder="Enter Minutes" type="number" />)}
					</FormItem>
					<FormItem {...formItemLayout} label="Log Type" hasFeedback>
						{getFieldDecorator("logType", {
							rules: [{ required: true, message: "Required!" }]
						})(
							<Select placeholder="Select Log Type">
								{types.map(logType => (
									<Option value={logType._id} key={logType._id}>
										{logType.name}
									</Option>
								))}
							</Select>
						)}
					</FormItem>
					{isUserLogtime && (
						<FormItem {...formItemLayout} label="Project Name" hasFeedback>
							{getFieldDecorator(
								"project",
								{}
							)(
								<Select placeholder="Select Project">
									{projectsQuery?.data?.data?.data?.data.map(project => (
										<Option value={project._id} key={project._id}>
											{project.name}
										</Option>
									))}
								</Select>
							)}
						</FormItem>
					)}

					<FormItem {...formItemLayout} label="Remarks" hasFeedback>
						{getFieldDecorator("remarks", {
							rules: [
								{
									required: true,
									validator: (rule, value, callback) => {
										const trimmedValue = value.replace(/ /g, "");
										if (trimmedValue.length < 10)
											callback("Remarks should be at least 10 letters");

										callback();
									}
								}
							]
						})(<TextArea placeholder="Enter Remarks" rows={1} />)}
					</FormItem>
				</Form>
			</Spin>
		</Modal>
	);
}

const LogModal = Form.create()(LogtimeModal);
export default LogModal;
