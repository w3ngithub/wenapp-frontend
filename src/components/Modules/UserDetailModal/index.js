import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { getUserRoles } from "services/users/userDetails";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 16 },
	},
};

function UserDetailForm({
	toggle,
	onToggleModal,
	roles,
	position,
	onSubmit,
	intialValues,
	readOnly = false,
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

			onSubmit({ ...intialValues, ...fieldsValue }, rest);
		});
	};

	useEffect(() => {
		if (toggle) {
			rest.form.setFieldsValue({
				name: intialValues.name ? intialValues.name : "",
				role:
					intialValues.role && intialValues.role._id
						? intialValues.role._id
						: undefined,
				position:
					intialValues.position && intialValues.position._id
						? intialValues.position._id
						: undefined,
				panNumber: intialValues.panNumber && intialValues.panNumber,
				citNumber: intialValues.citNumber && intialValues.citNumber,
				bankAccNumber: intialValues.bankAccNumber && intialValues.bankAccNumber,
				bankName: intialValues.bankName && intialValues.bankName,
				lastReviewDate:
					intialValues.lastReviewDate && moment(intialValues.lastReview),
				exitDate: intialValues.exitDate && moment(intialValues.exitDate),
			});
		}
	}, [toggle]);

	return (
		<Modal
			title={readOnly ? "Details" : "Update User"}
			visible={toggle}
			onOk={handleSubmit}
			onCancel={handleCancel}
			footer={
				readOnly
					? [
							<Button key="back" onClick={handleCancel}>
								Cancel
							</Button>,
					  ]
					: [
							<Button key="back" onClick={handleCancel}>
								Cancel
							</Button>,
							<Button key="submit" type="primary" onClick={handleSubmit}>
								Submit
							</Button>,
					  ]
			}
		>
			<Form>
				<FormItem {...formItemLayout} label="Name" name="name">
					{getFieldDecorator("name", {
						rules: [{ required: true, message: "required!" }],
					})(<Input placeholder="Enter Name" disabled={readOnly} />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Role">
					{getFieldDecorator("role", {
						rules: [{ required: true, message: "required!" }],
					})(
						<Select placeholder="Select Role" disabled={readOnly}>
							{roles &&
								roles.data.data.data.map((role) => (
									<Option value={role._id} key={role._id}>
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
							},
						],
					})(
						<Select placeholder="Select Position" disabled={readOnly}>
							{position &&
								position.data.data.data.map((position) => (
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
								whitespace: true,
							},
						],
					})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Exit Date">
					{getFieldDecorator("exitDate", {
						rules: [
							{
								type: "object",
								message: "required!",
								whitespace: true,
							},
						],
					})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Pan Number">
					{getFieldDecorator("panNumber", {
						rules: [
							{
								pattern: new RegExp(/^[0-9]+$/),
								message: "Pan must be a number!",
							},
						],
					})(
						<Input
							placeholder="Enter Pan Number"
							type="number"
							disabled={readOnly}
						/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="CIT Number">
					{getFieldDecorator("citNumber", {
						rules: [
							{
								pattern: new RegExp(/^[0-9]+$/),
								message: "CIT must be a number!",
							},
						],
					})(
						<Input
							placeholder="Enter Cit Number"
							type="number"
							disabled={readOnly}
						/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="Bank Name">
					{getFieldDecorator(
						"bankName",
						{}
					)(<Input placeholder="Enter Bank Name" disabled={readOnly} />)}
				</FormItem>
				<FormItem {...formItemLayout} label="Bank Account Number">
					{getFieldDecorator(
						"bankAccNumber",
						{}
					)(
						<Input
							placeholder="Enter Bank Account Number"
							disabled={readOnly}
						/>
					)}
				</FormItem>
			</Form>
		</Modal>
	);
}

const UserForm = Form.create()(UserDetailForm);
export default UserForm;
