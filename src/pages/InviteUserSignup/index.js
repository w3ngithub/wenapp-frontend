import React, { useState } from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, Input, Select, Card, Button } from "antd";
import DragAndDropFile from "components/Modules/DragAndDropFile";
import moment from "moment";
import "./style.css";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
	labelCol: {
		xs: { span: 8 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 16 },
		sm: { span: 16 }
	}
};

function InviteUserSignup(props) {
	const [files, setFiles] = useState([]);

	const { getFieldDecorator } = props.form;

	const handleFormSubmit = e => {
		e.preventDefault();

		props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			const updatedUser = {
				...fieldsValue,
				dob: moment.utc(fieldsValue.dob._d).format(),
				joinDate: moment.utc(fieldsValue.joinDate._d).format(),
				primaryPhone: +fieldsValue.primaryPhone,
				secondaryPhone:
					fieldsValue.secondaryPhone && +fieldsValue.secondaryPhone,
				profilePhoto: files[0]
			};
			console.log(updatedUser);
		});
	};

	return (
		<div className="signup-wrapper">
			<div className="gx-app-login-container">
				<Card className="gx-card" title="Sign Up">
					<Form onSubmit={handleFormSubmit}>
						<FormItem {...formItemLayout} label="Name" hasFeedback>
							{getFieldDecorator("name", {
								rules: [{ required: true, message: "Required!" }]
							})(<Input placeholder="Enter Name" />)}
						</FormItem>
						<FormItem {...formItemLayout} label="Profile Photo">
							<DragAndDropFile
								files={files}
								setFiles={setFiles}
								displayType="picture-card"
								allowMultiple={false}
							/>
						</FormItem>

						<FormItem {...formItemLayout} label="DOB" hasFeedback>
							{getFieldDecorator("dob", {
								rules: [
									{
										type: "object",
										required: true,
										message: "Required!",
										whitespace: true
									}
								]
							})(<DatePicker className=" gx-w-100" />)}
						</FormItem>

						<FormItem {...formItemLayout} label="Gender" hasFeedback>
							{getFieldDecorator("gender", {
								rules: [
									{
										required: true,
										message: "Required!",
										whitespace: true
									}
								]
							})(
								<Select placeholder="Select Gender">
									<Option value="Male">Male</Option>
									<Option value="Female">Female</Option>
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="Primary Phone" hasFeedback>
							{getFieldDecorator("primaryPhone", {
								rules: [
									{
										required: true,
										message: "Required!",
										whitespace: true
									}
								]
							})(<Input placeholder="Enter Primary Phone" type="number" />)}
						</FormItem>
						<FormItem {...formItemLayout} label="Secondary Phone">
							{getFieldDecorator("secondaryPhone", {
								rules: [
									{
										message: "field must be a number!",
										whitespace: true
									}
								]
							})(<Input placeholder="Enter Secondary Phone" type="number" />)}
						</FormItem>

						<FormItem {...formItemLayout} label="Join Date" hasFeedback>
							{getFieldDecorator("joinDate", {
								rules: [
									{
										type: "object",
										required: true,
										message: "Required!",
										whitespace: true
									}
								]
							})(<DatePicker className=" gx-w-100" />)}
						</FormItem>
						<FormItem {...formItemLayout} label="Marital Status" hasFeedback>
							{getFieldDecorator("maritalStatus", {
								rules: [
									{
										required: true,
										message: "Required!",
										whitespace: true
									}
								]
							})(
								<Select placeholder="Select Marital Status">
									<Option value="Married">Married</Option>
									<Option value="Unmarried">Unmarried</Option>
								</Select>
							)}
						</FormItem>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
						>
							Sign Up
						</Button>
					</Form>
				</Card>
			</div>
		</div>
	);
}

const SignupForm = Form.create()(InviteUserSignup);

export default SignupForm;
