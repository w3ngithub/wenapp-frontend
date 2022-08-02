import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { getUserRoles } from "services/users/userDetails";
import { useQuery } from "@tanstack/react-query";
import Position from "./../../../routes/components/feedback/Modal/Position";

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

function UserDetailForm({
	toggle,
	onToggleModal,
	roles,
	position,
	onSubmit,
	intialValues,
	...rest
}) {
	const { getFieldDecorator } = rest.form;

	const handleCancel = () => {
		rest.form.resetFields();
		onToggleModal({});
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}

			rest.form.resetFields();
			onSubmit(fieldsValue);
		});
	};

	console.log("inital", intialValues);

	return (
		<Modal
			title="Update User"
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
				<FormItem {...formItemLayout} label="Name" name="name">
					{getFieldDecorator("name", {
						initialValue: intialValues.name ? intialValues.name : "",
						rules: [{ required: true, message: "required!" }]
					})(<Input placeholder="Enter Name" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Role">
					{getFieldDecorator("role", {
						initialValue:
							intialValues.role && intialValues.role._id
								? intialValues.role._id
								: undefined,

						rules: [{ required: true, message: "required!" }]
					})(
						<Select placeholder="Select Role">
							{roles &&
								roles.data.data.data.map(role => (
									<Option value={role._id} key={role._id}>
										{role.value}
									</Option>
								))}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="Position">
					{getFieldDecorator("position", {
						initialValue:
							intialValues.position && intialValues.position._id
								? intialValues.position._id
								: undefined,
						rules: [
							{
								required: true,
								message: "required!"
							}
						]
					})(
						<Select placeholder="Select Position">
							{position &&
								position.data.data.data.map(position => (
									<Option value={position._id} key={position._id}>
										{position.name}
									</Option>
								))}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="Last Review Date">
					{getFieldDecorator("lastReviewDate", {
						rules: [
							{
								type: "object",
								message: "required!",
								whitespace: true
							}
						]
					})(<DatePicker className=" gx-w-100" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Exit Date">
					{getFieldDecorator("exitDate", {
						rules: [
							{
								type: "object",
								message: "required!",
								whitespace: true
							}
						]
					})(<DatePicker className=" gx-w-100" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Pan Number">
					{getFieldDecorator("panNumber", {
						rules: [
							{
								type: "number",
								message: "Pan must be a number!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Pan Number" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="CIT Number">
					{getFieldDecorator("citNumber", {
						rules: [
							{
								type: "number",
								message: "CIT must be a number!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Cit Number" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Bank Name">
					{getFieldDecorator("bankName", {
						rules: [
							{
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Bank Name" />)}
				</FormItem>

				<FormItem {...formItemLayout} label="Bank Account Number">
					{getFieldDecorator("citNumber", {
						rules: [
							{
								type: "number",
								message: "It must be a number!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Bank Account Number" />)}
				</FormItem>
			</Form>
		</Modal>
	);
}

const UserForm = Form.create()(UserDetailForm);
export default UserForm;
