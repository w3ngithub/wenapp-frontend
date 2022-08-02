import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

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

function UserProfileModal({ user, toggle, onToggle, onSubmit, ...rest }) {
	const { getFieldDecorator } = rest.form;

	const handleCancel = () => {
		rest.form.resetFields();

		onToggle();
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			console.log(fieldsValue);
			rest.form.resetFields();
			onSubmit(fieldsValue);
		});
	};

	useEffect(() => {
		if (toggle)
			rest.form.setFieldsValue({
				name: user.name,
				dob: user.dob.split("T")[0],
				gender: user.gender,
				primaryPhone: user.primaryPhone,
				joinDate: moment(user.joinDate),
				maritalStatus: user.maritalStatus
			});
	}, [toggle]);
	return (
		<Modal
			title="Details"
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
			<Form>
				<FormItem {...formItemLayout} label="Name">
					{getFieldDecorator("name", {
						rules: [{ required: true, message: "required!" }]
					})(<Input placeholder="Enter Name" />)}
				</FormItem>

				<FormItem {...formItemLayout} label="DOB">
					{getFieldDecorator("dob", {
						rules: [
							{
								required: true,
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter DOB" />)}
				</FormItem>

				<FormItem {...formItemLayout} label="Gender">
					{getFieldDecorator("gender", {
						rules: [
							{
								type: "string",
								required: true,
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Gender" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Primary Phone">
					{getFieldDecorator("primaryPhone", {
						rules: [
							{
								type: "number",
								message: "field must be a number!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Primary Phone" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Secondary Phone">
					{getFieldDecorator("secondaryPhone", {
						rules: [
							{
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Secondary Phone" />)}
				</FormItem>

				<FormItem {...formItemLayout} label="Join Date">
					{getFieldDecorator("joinDate", {
						rules: [
							{
								type: "object",

								message: "It must be a date!",
								whitespace: true
							}
						]
					})(<DatePicker className=" gx-w-100" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Marital Status">
					{getFieldDecorator("maritalStatus", {
						rules: [
							{
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Marital Status" />)}
				</FormItem>
			</Form>
		</Modal>
	);
}

const UserModal = Form.create()(UserProfileModal);
export default UserModal;
