import { Button, Form, Modal } from "antd";
import React, { useState } from "react";

const FormItem = Form.Item;
function UserDetailForm() {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		}
	};

	return (
		<>
			<Button type="primary" onClick={showModal}>
				Open Modal
			</Button>
			<Modal
				title="Basic Modal"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<p>Hello</p>
				{/* <Form onSubmit={() => {}}>
					<FormItem {...formItemLayout} label="E-mail">
						{getFieldDecorator("email", {
						rules: [
							{
								type: "email",
								message: "The input is not valid E-mail!"
							},
							{
								required: true,
								message: "Please input your E-mail!"
							}
						]
					})(<Input id="email1" />)}
					</FormItem>
				</Form> */}
			</Modal>
		</>
	);
}

export default UserDetailForm;
