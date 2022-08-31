import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Spin } from "antd";
import moment from "moment";
import React, { useEffect } from "react";

interface modalType {
	isEditMode: boolean;
	toggle: boolean;
	onSubmit: (holiday: any) => void;
	onCancel: React.MouseEventHandler<HTMLElement>;
	isLoading: boolean;
	editData: any;
}

const CommonModal = (props: modalType) => {
	const [form] = Form.useForm();
	const {
		isEditMode,
		toggle = true,
		onCancel,
		onSubmit,
		isLoading,
		editData
	} = props;

	const handleSubmit = () => {
		form.validateFields().then(values =>
			onSubmit({
				holidays: form
					.getFieldsValue()
					.holidays.filter(
						(holiday: { date: string; title: string; remarks: string }) =>
							holiday
					)
			})
		);
	};

	useEffect(() => {
		if (toggle) {
			if (isEditMode)
				form.setFieldsValue({
					holidays: editData?.map((holiday: any) => ({
						...holiday,
						date: moment(holiday.date)
					}))
				});
		}
		if (!toggle) form.resetFields();
	}, [toggle]);

	return (
		<Modal
			width={900}
			title={isEditMode ? `Update Holidays` : `Add Holidays`}
			visible={toggle}
			onOk={handleSubmit}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>
					Cancel
				</Button>,
				<Button key="submit" type="primary" onClick={handleSubmit}>
					Submit
				</Button>
			]}
		>
			<Spin spinning={isLoading}>
				<Form
					form={form}
					name="dynamic_form_nest_item"
					autoComplete="off"
					style={{ marginLeft: 10 }}
				>
					<Form.List
						name="holidays"
						initialValue={[
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]}
					>
						{(fields, { add, remove }) => (
							<>
								{fields.map(field => (
									<Row key={field.key} style={{ columnGap: 6 }}>
										<Col span={24} sm={7}>
											<Form.Item
												noStyle
												shouldUpdate={(prevValues, curValues) =>
													prevValues.area !== curValues.area ||
													prevValues.sights !== curValues.sights
												}
											>
												<Form.Item
													{...field}
													label="Date"
													name={[field.name, "date"]}
													// rules={[{ required: true, message: "required!" }]}
												>
													<DatePicker className=" gx-w-100" />
												</Form.Item>
											</Form.Item>
										</Col>
										<Col span={24} sm={7}>
											<Form.Item
												noStyle
												shouldUpdate={(prevValues, curValues) =>
													prevValues.area !== curValues.area ||
													prevValues.sights !== curValues.sights
												}
											>
												<Form.Item
													{...field}
													label="Title"
													name={[field.name, "title"]}
													// rules={[{ required: true, message: "required!" }]}
												>
													<Input />
												</Form.Item>
											</Form.Item>
										</Col>
										<Col span={24} sm={9}>
											<Row align="middle">
												<Col span={24} sm={20}>
													<Form.Item
														{...field}
														label="Remarks"
														name={[field.name, "remarks"]}
														// rules={[{ required: true, message: "required!" }]}
													>
														<Input.TextArea rows={1} />
													</Form.Item>
												</Col>
												<Col span={24} sm={2}>
													<MinusCircleOutlined
														onClick={() => remove(field.name)}
														style={{ marginBottom: 20 }}
													/>
												</Col>
											</Row>
										</Col>
									</Row>
								))}

								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										block
										icon={<PlusOutlined />}
									>
										Add More
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Spin>
		</Modal>
	);
};

export default CommonModal;
