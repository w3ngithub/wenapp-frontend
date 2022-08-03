import React, { useEffect } from "react";
import { Button, Checkbox, Form, Icon, Input, message } from "antd";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { hideMessage, showAuthLoader, userSignIn } from "appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/Elements/CircularProgress/index";
import API from "helpers/api";
import { Apis } from "services/api";

const FormItem = Form.Item;

function SignIn(props) {
	const navigate = useNavigate();

	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				props.showAuthLoader();
				props.userSignIn(values);
			}
		});
	};

	useEffect(() => {
		// if (props.showMessage) {
		// 	setTimeout(() => {
		// 		props.hideMessage();
		// 	}, 100);
		// }
		if (props.authUser !== null) {
			navigate("/dashboard");
		}
	}, [props.authUser]);

	const { getFieldDecorator } = props.form;
	const { showMessage, loader, alertMessage } = props;

	return (
		<div className="gx-app-login-wrap">
			<div className="gx-app-login-container">
				<div className="gx-app-login-main-content">
					<div className="gx-app-logo-content">
						<div className="gx-app-logo-content-bg">
							<img
								src="https://images.unsplash.com/photo-1658989236602-8f6a443a904d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
								alt="Neature"
							/>
						</div>
						<div className="gx-app-logo-wid">
							<h1>
								<IntlMessages id="app.userAuth.signIn" />
							</h1>
							<p>
								<IntlMessages id="app.userAuth.bySigning" />
							</p>
							<p>
								<IntlMessages id="app.userAuth.getAccount" />
							</p>
						</div>
						<div className="gx-app-logo">
							<img alt="example" src={require("assets/images/wenlogo.png")} />
						</div>
					</div>
					<div className="gx-app-login-content">
						<Form
							onSubmit={handleSubmit}
							className="gx-signin-form gx-form-row0"
						>
							<FormItem label="Email" hasFeedback>
								{getFieldDecorator("email", {
									rules: [
										{
											required: true,
											type: "email",
											message: "The input is not valid E-mail!"
										}
									]
								})(<Input placeholder="Email" />)}
							</FormItem>
							<FormItem label="Password" hasFeedback>
								{getFieldDecorator("password", {
									rules: [
										{ required: true, message: "Please input your Password!" }
									]
								})(<Input.Password type="password" placeholder="Password" />)}
							</FormItem>
							<FormItem>
								{getFieldDecorator("remember", {
									valuePropName: "checked",
									initialValue: false
								})(
									<Checkbox>
										<IntlMessages id="appModule.iAccept" />
									</Checkbox>
								)}
							</FormItem>
							<FormItem>
								<Button type="primary" className="gx-mb-0" htmlType="submit">
									<IntlMessages id="app.userAuth.signIn" />
								</Button>
							</FormItem>

							<span className="gx-text-light gx-fs-sm"> @webexpertsnepal</span>
						</Form>
					</div>

					{loader ? (
						<div className="gx-loader-view">
							<CircularProgress />
						</div>
					) : null}
					{showMessage ? message.error(alertMessage.toString()) : null}
				</div>
			</div>
		</div>
	);
}

const WrappedNormalLoginForm = Form.create()(SignIn);

const mapStateToProps = ({ auth }) => {
	const { loader, alertMessage, showMessage, authUser } = auth;
	return { loader, alertMessage, showMessage, authUser };
};

export default connect(mapStateToProps, {
	userSignIn,
	hideMessage,
	showAuthLoader
})(WrappedNormalLoginForm);
