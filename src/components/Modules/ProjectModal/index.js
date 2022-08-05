import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getProjectTags } from "services/projects";
import { getAllUsers } from "services/users/userDetails";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
	labelCol: {
		xs: { span: 0 },
		sm: { span: 10 }
	},
	wrapperCol: {
		xs: { span: 0 },
		sm: { span: 24 }
	}
};

function ProjectModal({
	toggle,
	onClose,
	types,
	statuses,
	onSubmit,
	initialValues,
	readOnly = false,
	loading = false,
	isEditMode = false,
	...rest
}) {
	const { getFieldDecorator } = rest.form;
	const [projectTypes, setProjectTypes] = useState([]);
	const [projectStatuses, setProjectStatuses] = useState([]);
	const { data, refetch } = useQuery(["tags"], getProjectTags, {
		enabled: false
	});
	const usersQuery = useQuery(["users"], getAllUsers, {
		enabled: false
	});
	const handleCancel = () => {
		rest.form.resetFields();
		onClose();
	};

	const handleSubmit = () => {
		rest.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			onSubmit(fieldsValue, rest);
		});
	};

	useEffect(() => {
		if (toggle) {
			setProjectStatuses(statuses.data.data.data);
			setProjectTypes(types.data.data.data);
			refetch();
			usersQuery.refetch();
			if (isEditMode) {
				rest.form.setFieldsValue({
					name: initialValues.name ?? "",
					priority: initialValues.priority,
					path: initialValues.path,
					estimatedHours: initialValues.estimatedHours,
					startDate: initialValues.startDate
						? moment(initialValues.startDate)
						: null,
					endDate: initialValues.endDate ? moment(initialValues.endDate) : null,
					projectTypes: initialValues.projectTypes?.map(type => type._id),
					projectStatus: initialValues.projectStatus?._id,
					projectTags:
						initialValues.projectTags?.length > 0
							? initialValues.projectTags?.map(tags => tags._id)
							: undefined,
					developers:
						initialValues.developers?.length > 0
							? initialValues.developers?.map(developer => developer._id)
							: undefined,
					designers:
						initialValues.designers?.length > 0
							? initialValues.designers?.map(designer => designer._id)
							: undefined,
					devOps:
						initialValues.devOps?.length > 0
							? initialValues.devOps?.map(devop => devop._id)
							: undefined,
					qa:
						initialValues.qa?.length > 0
							? initialValues.qa?.map(q => q._id)
							: undefined,
					stagingUrls:
						initialValues.stagingUrls?.length > 0
							? initialValues.stagingUrls
							: undefined,
					liveUrl: initialValues.liveUrl,
					notes: initialValues.notes,
					maintenance:
						initialValues.maintenance?.length > 0
							? initialValues.maintenance
							: undefined
				});
			}
		}
	}, [toggle]);
	return (
		<Modal
			width={900}
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
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator("name", {
								rules: [{ required: true, message: "Required!" }]
							})(<Input placeholder="Enter Name" disabled={readOnly} />)}
						</FormItem>
						<FormItem {...formItemLayout} label="Priority">
							{getFieldDecorator(
								"priority",
								{}
							)(
								<Radio.Group buttonStyle="solid" disabled={readOnly}>
									<Radio.Button value={true}>Yes</Radio.Button>
									<Radio.Button value={false}>No</Radio.Button>
								</Radio.Group>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Path"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"path",
								{}
							)(<Input placeholder="Enter Path" disabled={readOnly} />)}
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
							{getFieldDecorator(
								"startDate",
								{}
							)(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="End Date"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"endDate",
								{}
							)(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Type"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"projectTypes",
								{}
							)(
								<Select placeholder="Select Type" disabled={readOnly}>
									{projectTypes.map(type => (
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
							{getFieldDecorator("projectStatus", {
								rules: [
									{
										required: true,
										message: "Required!"
									}
								]
							})(
								<Select placeholder="Select Status" disabled={readOnly}>
									{projectStatuses.map(status => (
										<Option value={status._id} key={status._id}>
											{status.name}
										</Option>
									))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Tags"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"projectTags",
								{}
							)(
								<Select
									placeholder="Select Tags"
									disabled={readOnly}
									mode="tags"
									size="large"
								>
									{data &&
										data.data.data.data.map(tag => (
											<Option value={tag._id} key={tag._id}>
												{tag.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Developers"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"developers",
								{}
							)(
								<Select
									placeholder="Select Developers"
									disabled={readOnly}
									mode="tags"
								>
									{usersQuery.data &&
										usersQuery.data.data.data.data.map(tag => (
											<Option value={tag._id} key={tag._id}>
												{tag.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="Designers"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"designers",
								{}
							)(
								<Select
									placeholder="Select Designers"
									disabled={readOnly}
									mode="tags"
								>
									{usersQuery.data &&
										usersQuery.data.data.data.data.map(tag => (
											<Option value={tag._id} key={tag._id}>
												{tag.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="QA"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"qa",
								{}
							)(
								<Select placeholder="Select QA" disabled={readOnly} mode="tags">
									{usersQuery.data &&
										usersQuery.data.data.data.data.map(tag => (
											<Option value={tag._id} key={tag._id}>
												{tag.name}
											</Option>
										))}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="DevOps"
							hasFeedback={readOnly ? false : true}
						>
							{getFieldDecorator(
								"devOps",
								{}
							)(
								<Select
									placeholder="Select DevOps"
									disabled={readOnly}
									mode="tags"
								>
									{usersQuery.data &&
										usersQuery.data.data.data.data.map(tag => (
											<Option value={tag._id} key={tag._id}>
												{tag.name}
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
								"stagingUrls",
								{}
							)(
								<Select
									placeholder="Select Staging Urls"
									disabled={readOnly}
									mode="tags"
								>
									{[].map(item => (
										<Option key={item} value={item} />
									))}
								</Select>
							)}
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
						<FormItem {...formItemLayout} label="Notes">
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
