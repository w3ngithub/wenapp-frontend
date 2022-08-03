import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import moment from "moment";
import DragAndDropFile from "components/Modules/DragAndDropFile";

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

function UserProfileModal({
	user,
	toggle,
	onToggle,
	onSubmit,
	isLoading,
	...rest
}) {
	const { getFieldDecorator } = rest.form;
	const [files, setFiles] = useState([]);

	const handleCancel = () => {
		rest.form.resetFields();
		setFiles([]);
		onToggle();
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			onSubmit(fieldsValue);
		});
	};

	useEffect(() => {
		if (toggle)
			rest.form.setFieldsValue({
				name: user.name,
				dob: moment(user.dob),
				gender: user.gender,
				primaryPhone: String(user.primaryPhone),
				secondaryPhone: String(user.secondaryPhone || ""),
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
			<Spin spinning={isLoading}>
				<Form>
					<FormItem {...formItemLayout} label="Name">
						{getFieldDecorator("name", {
							rules: [{ required: true, message: "required!" }]
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

					<FormItem {...formItemLayout} label="DOB">
						{getFieldDecorator("dob", {
							rules: [
								{
									type: "object",
									required: true,
									message: "required!",
									whitespace: true
								}
							]
						})(<DatePicker className=" gx-w-100" />)}
					</FormItem>

					<FormItem {...formItemLayout} label="Gender">
						{getFieldDecorator("gender", {
							rules: [
								{
									required: true,
									message: "required!",
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
					<FormItem {...formItemLayout} label="Primary Phone">
						{getFieldDecorator("primaryPhone", {
							rules: [
								{
									required: true,
									message: "required!",
									whitespace: true
								}
							]
						})(<Input placeholder="Enter Primary Phone" />)}
					</FormItem>
					<FormItem {...formItemLayout} label="Secondary Phone">
						{getFieldDecorator("secondaryPhone", {
							rules: [
								{
									message: "field must be a number!",
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
									required: true,
									message: "required!",
									whitespace: true
								}
							]
						})(<DatePicker className=" gx-w-100" />)}
					</FormItem>
					<FormItem {...formItemLayout} label="Marital Status">
						{getFieldDecorator("maritalStatus", {
							rules: [
								{
									required: true,
									message: "required!",
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
				</Form>
			</Spin>
		</Modal>
	);
}

const UserModal = Form.create()(UserProfileModal);
export default UserModal;
