import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut } from "appRedux/actions/Auth";

class UserInfo extends Component {
	render() {
		const userMenuOptions = (
			<ul className="gx-user-popover">
				<li>Profile</li>
				<li>Change Password</li>
				<li onClick={() => this.props.userSignOut()}>Logout</li>
			</ul>
		);

		return (
			<Popover
				overlayClassName="gx-popover-horizantal"
				placement="bottomRight"
				content={userMenuOptions}
				trigger="click"
			>
				<Avatar
					src="https://images.unsplash.com/photo-1658989236602-8f6a443a904d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
					className="gx-avatar gx-pointer"
					alt=""
				/>
			</Popover>
		);
	}
}

export default connect(null, { userSignOut })(UserInfo);
