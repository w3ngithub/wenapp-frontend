import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";

const FormItem = Form.Item;
const Option = Select.Option;

function UserDetailForm(props) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { getFieldDecorator } = props.form;

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		props.form.resetFields();

		setIsModalVisible(false);
	};

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

	const handleSubmit = () => {
		console.log(props.form);
		props.form.validateFields((err, fieldsValue) => {
			console.log(err);
			if (err) {
				return;
			}

			props.form.resetFields();
		});
	};

	return (
		<>
			<Button type="primary" onClick={showModal}>
				Open Modal
			</Button>
			<Modal
				title="Update User"
				visible={isModalVisible}
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
						})(
							<Select placeholder="Please select a name">
								<Option value="china">name1</Option>
								<Option value="use">name2</Option>
							</Select>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="Role">
						{getFieldDecorator("role", {
							rules: [{ required: true, message: "required!" }]
						})(
							<Select placeholder="Please select a role">
								<Option value="china">QA</Option>
								<Option value="use">React Developer</Option>
								<Option value="use">Front End Developer</Option>
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
						})(<Input placeholder="Select position" />)}
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
						})(<Input placeholder="enter pan number" />)}
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
						})(<Input placeholder="enter cit number" />)}
					</FormItem>
					<FormItem {...formItemLayout} label="Bank Name">
						{getFieldDecorator("bankName", {
							rules: [
								{
									message: "required!",
									whitespace: true
								}
							]
						})(<Input placeholder="enter bank name" />)}
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
						})(<Input placeholder="enter bank account number" />)}
					</FormItem>
				</Form>
			</Modal>
		</>
	);
}

const UserForm = Form.create()(UserDetailForm);
export default UserForm;
