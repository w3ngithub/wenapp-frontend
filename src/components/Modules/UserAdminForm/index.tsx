import React from "react";
import {
	AutoComplete,
	Button,
	Card,
	Cascader,
	Checkbox,
	Col,
	Form,
	Icon,
	Input,
	Row,
	Select,
	Tooltip
} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
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
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 8
		}
	}
};

function UserAdminForm(props: { form: { getFieldDecorator: any } }) {
	const { getFieldDecorator } = props.form;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// props.form.validateFieldsAndScroll((err, values) => {
		//   if (!err) {
		//     console.log('Received values of form: ', values);
		//   }
		// });
	};

	return (
		<Card className="gx-card" title="Registration Form">
			<Form onSubmit={handleSubmit}>
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
				{/* <FormItem {...formItemLayout} label="Password">
					{getFieldDecorator("password", {
						rules: [
							{
								required: true,
								message: "Please input your password!"
							},
							{
								validator: validateToNextPassword
							}
						]
					})(<Input type="password" />)}
				</FormItem> */}
				{/* <FormItem {...formItemLayout} label="Confirm Password">
					{getFieldDecorator("confirm", {
						rules: [
							{
								required: true,
								message: "Please confirm your password!"
							},
							{
								validator: compareToFirstPassword
							}
						]
					})(<Input type="password" onBlur={handleConfirmBlur} />)}
				</FormItem> */}
				{/* <FormItem
					{...formItemLayout}
					label={
						<span>
							Nickname&nbsp;
							<Tooltip title="What do you want others to call you?">
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
				>
					{getFieldDecorator("nickname", {
						rules: [
							{
								required: true,
								message: "Please input your nickname!",
								whitespace: true
							}
						]
					})(<Input />)}
				</FormItem> */}
				<FormItem {...formItemLayout} label="Habitual Residence">
					{getFieldDecorator("residence", {
						initialValue: ["zhejiang", "hangzhou", "xihu"],
						rules: [
							{
								type: "array",
								required: true,
								message: "Please select your habitual residence!"
							}
						]
					})(<Cascader options={[]} />)}
				</FormItem>
				{/* <FormItem {...formItemLayout} label="Phone Number">
					{getFieldDecorator("phone", {
						rules: [
							{ required: true, message: "Please input your phone number!" }
						]
					})(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
				</FormItem> */}
				{/* <FormItem {...formItemLayout} label="Website">
					{getFieldDecorator("website", {
						rules: [{ required: true, message: "Please input website!" }]
					})(
						<AutoComplete
							dataSource={websiteOptions}
							onChange={handleWebsiteChange}
							placeholder="website"
						>
							<Input />
						</AutoComplete>
					)}
				</FormItem> */}
				<FormItem
					{...formItemLayout}
					label="Captcha"
					extra="We must make sure that your are a human."
				>
					<Row>
						<Col span={24} sm={12}>
							{getFieldDecorator("captcha", {
								rules: [
									{
										required: true,
										message: "Please input the captcha you got!"
									}
								]
							})(<Input />)}
						</Col>
						<Col span={24} sm={12}>
							<Button>Get captcha</Button>
						</Col>
					</Row>
				</FormItem>
				<FormItem {...tailFormItemLayout}>
					{getFieldDecorator("agreement", {
						valuePropName: "checked"
					})(
						<Checkbox>
							I have read the <span className="gx-link">agreement</span>
						</Checkbox>
					)}
				</FormItem>
				<FormItem {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Register
					</Button>
				</FormItem>
			</Form>
		</Card>
	);
}

const UserForm = Form.create()(UserAdminForm);
export default UserForm;
