import { useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Input, Modal, Row, Select, Spin } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { Form } from "@ant-design/compatible";
import { filterOptions } from "helpers/utils";
import { getNoticeTypes } from "services/noticeboard";

const FormItem = Form.Item;
const { TextArea } = Input;

function NoticeModal({
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

	const noticeTypesQuery = useQuery(["noticeTypes"], getNoticeTypes, {
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
			noticeTypesQuery.refetch();
			if (isEditMode) {
				rest.form.setFieldsValue({
					title: initialValues?.title,
					details: initialValues?.details,
					noticeType: initialValues?.noticeType?._id,
					startDate: initialValues?.startDate
						? moment(initialValues?.startDate)
						: null,
					endDate: initialValues?.endDate
						? moment(initialValues?.endDate)
						: null
				});
			}
		}
	}, [toggle]);

	return (
		<Modal
			width={900}
			title={isEditMode ? "Update Notice" : "Add Notice"}
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
					<Row type="flex">
						<Col span={24} sm={12}>
							<FormItem label="Title" hasFeedback={readOnly ? false : true}>
								{getFieldDecorator("title", {
									rules: [{ required: true, message: "Required!" }]
								})(<Input placeholder="Enter Title" disabled={readOnly} />)}
							</FormItem>
						</Col>

						<Col span={24} sm={12}>
							<FormItem label="Category" hasFeedback={readOnly ? false : true}>
								{getFieldDecorator("noticeType", {
									rules: [{ required: true, message: "Required!" }]
								})(
									<Select
										showSearch
										filterOption={filterOptions}
										placeholder="Select Category"
										disabled={readOnly}
									>
										{noticeTypesQuery.data &&
											noticeTypesQuery?.data?.data?.data?.data?.map(tag => (
												<Select.Option value={tag._id} key={tag._id}>
													{tag.name}
												</Select.Option>
											))}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row type="flex">
						<Col span={24} sm={12}>
							<FormItem
								label="Start Date"
								hasFeedback={readOnly ? false : true}
							>
								{getFieldDecorator("startDate", {
									rules: [{ required: true, message: "Required!" }]
								})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
							</FormItem>
						</Col>
						<Col span={24} sm={12}>
							<FormItem label="End Date" hasFeedback={readOnly ? false : true}>
								{getFieldDecorator("endDate", {
									rules: [{ required: true, message: "Required!" }]
								})(<DatePicker className=" gx-w-100" disabled={readOnly} />)}
							</FormItem>
						</Col>
					</Row>
					<Row type="flex">
						<Col span={24} sm={24}>
							<FormItem label="Details" hasFeedback={readOnly ? false : true}>
								{getFieldDecorator("details", {
									rules: [{ required: true, message: "Required!" }]
								})(
									<TextArea
										placeholder="Enter Details"
										rows={5}
										disabled={readOnly}
									/>
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	);
}

const NoticeBoardModal = Form.create()(NoticeModal);
export default NoticeBoardModal;
