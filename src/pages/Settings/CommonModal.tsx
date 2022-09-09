import { Button, Form, Input, Modal, Spin } from "antd";
import React, { useEffect } from "react";

interface modalInterface {
	isEditMode: boolean;
	toggle: boolean;
	onSubmit: (name: string) => void;
	onCancel: React.MouseEventHandler<HTMLElement>;
	type: string;
	isLoading: boolean;
	editData: any;
}

const layout = {
	// labelCol: { span: 8 },
	// wrapperCol: { span: 16 }
};

function CommonModal({
	isEditMode,
	toggle,
	onSubmit,
	onCancel,
	type,
	isLoading,
	editData
}: modalInterface) {
	const [form] = Form.useForm();

	const handleSubmit = () => {
		form.validateFields().then(values => onSubmit(form.getFieldValue("name")));
	};

	useEffect(() => {
		if (toggle) {
			if (isEditMode) form.setFieldValue("name", editData?.name);
		}
		if (!toggle) form.resetFields();
	}, [toggle]);
	return (
		<Modal
			title={isEditMode ? `Update ${type}` : `Add ${type}`}
			visible={toggle}
			onOk={handleSubmit}
			mask={false}
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
				<Form {...layout} form={form} name="control-hooks" layout="vertical">
					<Form.Item
						name="name"
						label={type}
						rules={[{ required: true, message: "Required!" }]}
					>
						<Input
							// value={input}
							placeholder={type}
							// onChange={handleInputChange}
						/>
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
}

export default CommonModal;
