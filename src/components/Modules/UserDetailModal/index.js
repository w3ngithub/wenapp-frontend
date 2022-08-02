import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { getUserRoles } from "services/users/userDetails";
import { useQuery } from "@tanstack/react-query";

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

function UserDetailForm({ toggle, onToggleModal, onSubmit, ...rest }) {
	const { data, refetch } = useQuery(["userRoles"], getUserRoles, {
		enabled: false
	});

	const { getFieldDecorator } = rest.form;

	const handleCancel = () => {
		rest.form.resetFields();

		onToggleModal();
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

	useEffect(() => {
		if (toggle) refetch();
	}, [toggle]);
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
				<FormItem {...formItemLayout} label="Name">
					{getFieldDecorator("name", {
						rules: [{ required: true, message: "required!" }]
					})(<Input placeholder="Enter Name" />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Role">
					{getFieldDecorator("role", {
						rules: [{ required: true, message: "required!" }]
					})(
						<Select placeholder="Select Role">
							{data &&
								data.data.data.data.map(role => (
									<Option value={role.value} key={role._id}>
										{role.value}
									</Option>
								))}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="Position">
					{getFieldDecorator("position", {
						rules: [
							{
								required: true,
								message: "required!",
								whitespace: true
							}
						]
					})(<Input placeholder="Enter Position" />)}
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
