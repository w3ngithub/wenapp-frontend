import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "services/projects";
import { filterOptions } from "helpers/utils";

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
	const { getFieldDecorator, validateFieldsAndScroll } = rest.form;
	const [types, setTypes] = useState([]);
	const projectsQuery = useQuery(["projects"], getAllProjects, {
		enabled: false
	});

	const handleCancel = () => {
		rest.form.resetFields();
		onClose();
	};

	const handleSubmit = () => {
		validateFieldsAndScroll((err, fieldsValue) => {
			console.log(err);
			if (err) {
				return;
			}
			onSubmit(
				isEditMode
					? { ...initialValues, ...fieldsValue, user: initialValues?.user._id }
					: { ...fieldsValue }
			);
		});
	};

	useEffect(() => {
		if (toggle) {
			setTypes(logTypes.data?.data?.data);
			projectsQuery.refetch();
			if (isEditMode) {
				rest.form.setFieldsValue(
					isUserLogtime
						? {
								logDate: moment(initialValues?.logDate),
								hours: initialValues?.hours,
								minutes: initialValues?.minutes,
								logType: initialValues?.logType._id,
								remarks: initialValues?.remarks,
								project: initialValues?.project._id
						  }
						: {
								logDate: moment(initialValues?.logDate),
								hours: initialValues?.hours,
								minutes: initialValues?.minutes,
								logType: initialValues?.logType._id,
								remarks: initialValues?.remarks
						  }
				);
			}
		}

		if (!toggle) rest.form.resetFields();
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
							<Select
								showSearch
								filterOption={filterOptions}
								placeholder="Select Log Type"
							>
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
								<Select
									showSearch
									filterOption={filterOptions}
									placeholder="Select Project"
								>
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
									validator: (rule, value, callback) => {
										try {
											if (!value) throw new Error("Required!");

											const trimmedValue = value && value.trim();
											if (trimmedValue?.length < 10) {
												throw new Error(
													"Remarks should be at least 10 letters!"
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
						})(<TextArea placeholder="Enter Remarks" rows={1} />)}
					</FormItem>
				</Form>
			</Spin>
		</Modal>
	);
}

const LogModal = Form.create()(LogtimeModal);
export default LogModal;
