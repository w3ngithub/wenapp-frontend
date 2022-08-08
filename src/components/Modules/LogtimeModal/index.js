import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import moment from "moment";

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
	onToggleModal,
	logTypes,
	onSubmit,
	initialValues,
	loading = false,
	isEditMode,
	...rest
}) {
	const { getFieldDecorator } = rest.form;
	const [types, setTypes] = useState([]);

	const handleCancel = () => {
		rest.form.resetFields();
		onToggleModal(false);
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			onSubmit(fieldsValue, rest);
		});
	};

	useEffect(() => {
		if (toggle) {
			setTypes(logTypes.data?.data?.data);
			// rest.form.setFieldsValue({
			// 	name: initialValues.name ? initialValues.name : "",
			// 	role:
			// 		initialValues.role && initialValues.role._id
			// 			? initialValues.role._id
			// 			: undefined,
			// 	position:
			// 		initialValues.position && initialValues.position._id
			// 			? initialValues.position._id
			// 			: undefined,
			// 	panNumber: initialValues.panNumber && initialValues.panNumber,
			// 	citNumber: initialValues.citNumber && initialValues.citNumber,
			// 	bankAccNumber:
			// 		initialValues.bankAccNumber && initialValues.bankAccNumber,
			// 	bankName: initialValues.bankName && initialValues.bankName,
			// 	lastReviewDate:
			// 		initialValues.lastReviewDate && moment(initialValues.lastReview),
			// 	exitDate: initialValues.exitDate && moment(initialValues.exitDate)
			// });
		}
	}, [toggle, initialValues, rest, logTypes]);

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
						})(<DatePicker className=" gx-w-100" placeholder="Select Date" />)}
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

					<FormItem {...formItemLayout} label="Remarks" hasFeedback>
						{getFieldDecorator("remarks", {
							rules: [
								{
									required: true,
									message: "Required!"
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
