import React, { Component } from "react";
import { Link } from "react-router-dom";

import { toggleCollapsedSideNav } from "appRedux/actions/Setting";
import UserInfo from "components/Elements/UserInfo";
import AppNotification from "components/Elements/AppNotification";
import MailNotification from "components/Modules/MailNotification";
import Auxiliary from "util/Auxiliary";
import { Layout, Popover } from "antd";

import {
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_MINI_SIDEBAR,
	TAB_SIZE
} from "constants/ThemeSetting";
import { connect } from "react-redux";
import PunchInOut from "components/Elements/PunchInOut";
import { getLocalStorageData } from "helpers/utils";

const { Header } = Layout;

class Topbar extends Component {
	state = {
		searchText: ""
	};

	updateSearchChatUser = evt => {
		this.setState({
			searchText: evt.target.value
		});
	};

	render() {
		const { width, navCollapsed, navStyle } = this.props;
		return (
			<Auxiliary>
				<Header>
					{navStyle === NAV_STYLE_DRAWER ||
					((navStyle === NAV_STYLE_FIXED ||
						navStyle === NAV_STYLE_MINI_SIDEBAR) &&
						width < TAB_SIZE) ? (
						<div className="gx-linebar gx-mr-3">
							<i
								className="gx-icon-btn icon icon-menu"
								onClick={() => {
									this.props.toggleCollapsedSideNav(!navCollapsed);
								}}
							/>
						</div>
					) : null}
					<Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
						<img alt="" src={require("assets/images/logo.png")} />
					</Link>

					<div className="gx-header-notifications gx-mt-auto">
						<PunchInOut />
					</div>

					<ul className="gx-header-notifications gx-ml-auto">
						<li className="gx-notify"></li>

						<li className="gx-user-nav">
							<UserInfo />
						</li>
					</ul>
				</Header>
			</Auxiliary>
		);
	}
}

const mapStateToProps = ({ settings }) => {
	const { navStyle, navCollapsed, width } = settings;
	return { navStyle, navCollapsed, width };
};

export default connect(mapStateToProps, { toggleCollapsedSideNav })(Topbar);
