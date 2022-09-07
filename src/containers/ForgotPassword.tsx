import { Button, Form, Input } from "antd";
import React from "react";
import IntlMessages from "util/IntlMessages";

const FormItem = Form.Item;

function ForgotPassword() {
	const [form] = Form.useForm();

	const handleSubmit = (values: { email: string }) => {
		console.log(values);
	};
	return (
		<div className="gx-login-container">
			<div className="gx-login-content">
				<div className="gx-login-header">
					<img
						src={require("assets/images/wenlogo.png")}
						alt="WebExperts Nepal"
						title="'"
					/>
				</div>
				<div className="gx-mb-4">
					<h2>Forgot Your Password ?</h2>
					<p>
						<IntlMessages id="app.userAuth.forgot" />
					</p>
				</div>

				<Form
					layout="vertical"
					onFinish={handleSubmit}
					className="gx-login-form gx-form-row0"
					form={form}
				>
					<FormItem
						name="email"
						rules={[
							{
								type: "email",
								message: "The input is not valid E-mail!"
							},
							{
								required: true,
								message: "Please input your E-mail!"
							}
						]}
					>
						<Input type="email" placeholder="E-Mail Address" />
					</FormItem>

					<FormItem>
						<Button type="primary" htmlType="submit">
							<IntlMessages id="app.userAuth.send" />
						</Button>
					</FormItem>
				</Form>
			</div>
		</div>
	);
}

export default ForgotPassword;
