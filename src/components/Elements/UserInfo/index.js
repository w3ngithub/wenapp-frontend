import React, { useState } from "react";
import { connect } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut } from "appRedux/actions/Auth";
import { useNavigate } from "react-router-dom";
import { PROFILE } from "helpers/routePath";
import { getLocalStorageData } from "helpers/utils";

function UserInfo(props) {
	const navigate = useNavigate();
	const [visible, setVisible] = useState(false);
	const user = getLocalStorageData("user_id");

	const handleVisibleChange = newVisible => {
		setVisible(newVisible);
	};

	const userMenuOptions = (
		<ul className="gx-user-popover">
			<li
				onClick={() => {
					handleVisibleChange(false);
					navigate(PROFILE);
				}}
			>
				Profile
			</li>
			<li>Change Password</li>
			<li
				onClick={() => {
					handleVisibleChange(false);
					props.userSignOut();
				}}
			>
				Logout
			</li>
		</ul>
	);

	return (
		<Popover
			overlayClassName="gx-popover-horizantal"
			placement="bottomRight"
			content={userMenuOptions}
			trigger="click"
			visible={visible}
			onVisibleChange={handleVisibleChange}
		>
			<Avatar src={user?.photoURL} className="gx-avatar gx-pointer" alt="" />
		</Popover>
	);
}

export default connect(null, { userSignOut })(UserInfo);
