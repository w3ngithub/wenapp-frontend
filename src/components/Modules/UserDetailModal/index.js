import React, { useEffect } from "react";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, DatePicker, Input, Modal, Select, Spin } from "antd";
import { getUserRoles } from "services/users/userDetails";
import { useQuery } from "@tanstack/react-query";
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

function UserDetailForm({
	toggle,
	onToggleModal,
	roles,
	position,
	onSubmit,
	intialValues,
	readOnly = false,
	loading = false,
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
				exitDate: intialValues.exitDate && moment(intialValues.exitDate)
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
							</Button>
					  ]
					: [
							<Button key="back" onClick={handleCancel}>
								Cancel
							</Button>,
							<Button key="submit" type="primary" onClick={handleSubmit}>
								Submit
							</Button>
					  ]
			}
		>
			<Spin spinning={loading}>
				<Form>
					<FormItem
						{...formItemLayout}
						label="Name"
						name="name"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("name", {
							rules: [{ required: true, message: "Required!" }]
						})(<Input placeholder="Enter Name" disabled={readOnly} />)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Role"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("role", {
							rules: [{ required: true, message: "Required!" }]
						})(
							<Select placeholder="Select Role" disabled={readOnly}>
								{roles &&
									roles?.data?.data?.data?.map(role => (
										<Option value={role._id} key={role._id}>
											{role.value}
										</Option>
									))}
							</Select>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Position"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("position", {
							rules: [
								{
									required: true,
									message: "Required!"
								}
							]
						})(
							<Select
								placeholder="Select Position"
								disabled={readOnly}
								hasFeedback={readOnly ? false : true}
							>
								{position &&
									position?.data?.data?.data?.map(position => (
										<Option value={position._id} key={position._id}>
											{position.name}
										</Option>
									))}
							</Select>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Last Review Date"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("lastReviewDate", {
							rules: [
								{
									type: "object",
									message: "Required!",
									whitespace: true
								}
							]
						})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Exit Date"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("exitDate", {
							rules: [
								{
									type: "object",
									message: "Required!",
									whitespace: true
								}
							]
						})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Pan Number"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("panNumber", {
							rules: [
								{
									pattern: new RegExp(/^[0-9]+$/),
									message: "Pan must be a number!"
								}
							]
						})(
							<Input
								placeholder="Enter Pan Number"
								type="number"
								disabled={readOnly}
							/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="CIT Number"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator("citNumber", {
							rules: [
								{
									pattern: new RegExp(/^[0-9]+$/),
									message: "CIT must be a number!"
								}
							]
						})(
							<Input
								placeholder="Enter Cit Number"
								type="number"
								disabled={readOnly}
							/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Bank Name"
						hasFeedback={readOnly ? false : true}
					>
						{getFieldDecorator(
							"bankName",
							{}
						)(<Input placeholder="Enter Bank Name" disabled={readOnly} />)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Bank Account Number"
						hasFeedback={readOnly ? false : true}
					>
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
			</Spin>
		</Modal>
	);
}

const UserForm = Form.create()(UserDetailForm);
export default UserForm;
