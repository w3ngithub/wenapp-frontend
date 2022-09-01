import React, { useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import { Button, DatePicker, Input, Modal, Select, Spin, Form } from "antd";
import moment from "moment";
import { filterOptions } from "helpers/utils";

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
	positionTypes,
	onSubmit,
	intialValues,
	readOnly = false,
	loading = false
}) {
	const [form] = Form.useForm();
	const handleCancel = () => {
		form.resetFields();
		onToggleModal({});
	};

	const handleSubmit = () => {
		form.validateFields().then(values => onSubmit({...intialValues,...values}));

	};

	useEffect(() => {
		if (toggle) {
			form.setFieldsValue({
				name: intialValues.name ? intialValues.name : "",
				role:
					intialValues.role && intialValues.role._id
						? intialValues.role._id
						: undefined,
				position:
					intialValues.position && intialValues.position._id
						? intialValues.position._id
						: undefined,
				positionType:
					intialValues.positionType && intialValues.positionType._id
						? intialValues.positionType._id
						: undefined,
				panNumber: intialValues.panNumber && intialValues.panNumber,
				citNumber: intialValues.citNumber && intialValues.citNumber,
				bankAccNumber: intialValues.bankAccNumber && intialValues.bankAccNumber,
				bankName: intialValues.bankName && intialValues.bankName,
				lastReviewDate:
					intialValues.lastReviewDate && moment(intialValues.lastReviewDate),
				exitDate: intialValues.exitDate && moment(intialValues.exitDate)
			});
		}

		if (!toggle) form.resetFields();
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
				<Form form={form}>
					<FormItem
						{...formItemLayout}
						label="Name"
						name="name"
						rules={[{ required: true, message: "Required!" }]}
						hasFeedback={readOnly ? false : true}
					>
						<Input placeholder="Enter Name" disabled={readOnly} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Role"
						hasFeedback={readOnly ? false : true}
						name="role"
						rules={[{ required: true, message: "Required!" }]}
					>
						<Select
							showSearch
							placeholder="Select Role"
							disabled={readOnly}
							filterOption={filterOptions}
						>
							{roles &&
								roles?.data?.data?.data?.map(role => (
									<Option value={role._id} key={role._id}>
										{role.value}
									</Option>
								))}
						</Select>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Position"
						hasFeedback={readOnly ? false : true}
						name="position"
						rules={[
							{
								required: true,
								message: "Required!"
							}
						]}
					>
						<Select
							showSearch
							placeholder="Select Position"
							disabled={readOnly}
							hasFeedback={readOnly ? false : true}
							filterOption={filterOptions}
						>
							{position &&
								position?.data?.data?.data?.map(position => (
									<Option value={position._id} key={position._id}>
										{position.name}
									</Option>
								))}
						</Select>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Position Type"
						hasFeedback={readOnly ? false : true}
						name="positionType"
						rules={[
							{
								required: true,
								message: "Required!"
							}
						]}
					>
						<Select
							showSearch
							placeholder="Select Position Type"
							disabled={readOnly}
							hasFeedback={readOnly ? false : true}
							filterOption={filterOptions}
						>
							{positionTypes &&
								positionTypes?.data?.data?.data?.map(positionType => (
									<Option value={positionType._id} key={positionType._id}>
										{positionType.name}
									</Option>
								))}
						</Select>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Last Review Date"
						hasFeedback={readOnly ? false : true}
						name="lastReviewDate"
						rules={[
							{
								type: "object",
								message: "Required!",
								whitespace: true
							}
						]}
					>
						<DatePicker className=" gx-w-100" disabled={readOnly} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Exit Date"
						hasFeedback={readOnly ? false : true}
						name="exitDate"
						rules={[
							{
								type: "object",
								message: "Required!",
								whitespace: true
							}
						]}
					>
						<DatePicker className=" gx-w-100" disabled={readOnly} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Pan Number"
						hasFeedback={readOnly ? false : true}
						name="panNumber"
						rules={[
							{
								pattern: new RegExp(/^[0-9]+$/),
								message: "Pan must be a number!"
							}
						]}
					>
						<Input
							placeholder="Enter Pan Number"
							type="number"
							disabled={readOnly}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="CIT Number"
						hasFeedback={readOnly ? false : true}
						name="citNumber"
						rules={[
							{
								pattern: new RegExp(/^[0-9]+$/),
								message: "CIT must be a number!"
							}
						]}
					>
						<Input
							placeholder="Enter Cit Number"
							type="number"
							disabled={readOnly}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Bank Name"
						hasFeedback={readOnly ? false : true}
						name="bankName"
					>
						<Input placeholder="Enter Bank Name" disabled={readOnly} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Bank Account Number"
						hasFeedback={readOnly ? false : true}
						name="bankAccNumber"
					>
						<Input
							placeholder="Enter Bank Account Number"
							disabled={readOnly}
						/>
					</FormItem>
				</Form>
			</Spin>
		</Modal>
	);
}

export default UserDetailForm;
