import { Button, Form, Input, Modal, Spin } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";

interface modalInterface {
	isEditMode: boolean;
	toggle: boolean;
	onSubmit: (name: string) => void;
	onCancel: React.MouseEventHandler<HTMLElement>;
	type: string;
	isLoading: boolean;
}

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

function CommonModal({
	isEditMode,
	toggle,
	onSubmit,
	onCancel,
	type,
	isLoading
}: modalInterface) {
	const [form] = Form.useForm();
	const [input, setInput] = useState("");

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

	const handleSubmit = () => {
		form.validateFields().then(values => onSubmit(input));
	};

	useEffect(() => {
		if (!toggle) form.resetFields();
	}, [toggle]);

	return (
		<Modal
			title={isEditMode ? `Update ${type}` : `Add ${type}`}
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
				<Form {...layout} form={form} name="control-hooks" layout="vertical">
					<Form.Item
						name={type}
						label={type}
						rules={[{ required: true, message: "Required!" }]}
					>
						<Input placeholder={type} onChange={handleInputChange} />
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
}

export default CommonModal;
