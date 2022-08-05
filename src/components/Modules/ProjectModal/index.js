import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	DatePicker,
	Form,
	Input,
	Modal,
	Radio,
	Select,
	Spin
} from "antd";
import moment from "moment";
import "./style.css";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 12 }
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 24 }
	}
};

function ProjectModal({
	toggle,
	onToggleModal,
	types,
	statuses,
	onSubmit,
	initialValues,
	readOnly = false,
	loading = false,
	...rest
}) {
	const { getFieldDecorator } = rest.form;
	const [priority, setPriority] = useState("");

	const handleCancel = () => {
		rest.form.resetFields();
		onToggleModal({});
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}

			onSubmit({ ...initialValues, ...fieldsValue }, rest);
		});
	};

	const setProjectPriority = e => {
		setPriority(e.target.value === "yes" ? true : false);
	};

	useEffect(() => {
		if (toggle) {
			console.log(initialValues);

			rest.form.setFieldsValue({
				name: initialValues.name ?? "",
				priority: initialValues.priority,
				estimatedHours: initialValues.estimatedHours,
				startDate: moment(initialValues.startDate),
				endDate: moment(initialValues.endDate),
				type: initialValues.projectTypes,
				status: initialValues.projectStatus,
				stagingUrls: initialValues.stagingUrls,
				liveUrl: initialValues.liveUrl,
				notes: initialValues.notes,
				maintenance: initialValues.maintenance
			});
		}
	}, [toggle]);
	return (
		<Modal
			width={700}
			style={{ width: "700px" }}
			title={readOnly ? "Details" : "Update Project"}
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
				<Form layout="vertical">
					<div className="form-wrapper">
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
						<FormItem {...formItemLayout} label="Priority">
							{getFieldDecorator("priority", {
								rules: [{ required: true, message: "Required!" }]
							})(
								<Radio.Group buttonStyle="solid" disabled={readOnly}>
									<Radio.Button value={true}>Yes</Radio.Button>
									<Radio.Button value={false}>No</Radio.Button>
								</Radio.Group>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Estimated Hours"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("estimatedHours", {
								rules: [
									{
										required: true,
										message: "Required!"
									}
								]
							})(
								<Input
									placeholder="Enter Estimated Hours"
									type="number"
									disabled={readOnly}
								/>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Start Date"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("startDate", {
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
							label="End Date"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("endDate", {
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
							label="Type"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("type", {
								rules: [
									{
										type: "object",
										message: "Required!",
										whitespace: true
									}
								]
							})(
								<Select placeholder="Select Type" disabled={readOnly}>
									{types &&
										types.data.data.data.map(type => (
											<Option value={type._id} key={type._id}>
												{type.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Status"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("status", {
								rules: [
									{
										type: "object",
										message: "Required!",
										whitespace: true
									}
								]
							})(
								<Select placeholder="Select Type" disabled={readOnly}>
									{statuses &&
										statuses.data.data.data.map(status => (
											<Option value={status._id} key={status._id}>
												{status.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Staging URL"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"stagingUrl",
								{}
							)(<Input placeholder="Enter Staging URL" disabled={readOnly} />)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Live URL"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"liveUrl",
								{}
							)(<Input placeholder="Enter Live URL" disabled={readOnly} />)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Notes"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"notes",
								{}
							)(
								<TextArea
									placeholder="Enter Notes"
									rows={1}
									disabled={readOnly}
								/>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Maintenance"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"maintenance",
								{}
							)(<Input placeholder="Enter Maintenance" disabled={readOnly} />)}
						</FormItem>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
}

const ProjModal = Form.create()(ProjectModal);
export default ProjModal;
