import React, { Component } from "react";
import { Layout, Switch } from "antd";
import { FaMoon } from "react-icons/fa";
import { BsFillSunFill } from "react-icons/bs";
import { toggleCollapsedSideNav } from "appRedux/actions/Setting";
import UserInfo from "components/Elements/UserInfo";
import Auxiliary from "util/Auxiliary";

import {
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_MINI_SIDEBAR,
	TAB_SIZE,
	THEME_TYPE_DARK,
	THEME_TYPE_SEMI_DARK
} from "constants/ThemeSetting";
import { connect } from "react-redux";
import PunchInOut from "components/Elements/PunchInOut";
import { setThemeType } from "appRedux/actions/Setting";

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

	handleThemeChange = e => {
		if (e) {
			this.props.setThemeType(THEME_TYPE_DARK);
			localStorage.setItem("theme", THEME_TYPE_DARK);
		} else {
			this.props.setThemeType(THEME_TYPE_SEMI_DARK);
			localStorage.setItem("theme", THEME_TYPE_SEMI_DARK);
		}
	};

	render() {
		const { width, navCollapsed, navStyle, themeType } = this.props;

		return (
			<Auxiliary>
				<Header>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
							gap: '2px'
						}}
					>
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

						<div className="gx-header-notifications gx-mt-2">
							<PunchInOut />
						</div>
						<div>
							<ul className="gx-header-notifications gx-ml-auto gx-d-flex" style={{flexWrap:'nowrap'}}>
								<li className="gx-notify" >
									<Switch
										unCheckedChildren={
											<FaMoon
												style={{
													fontSize: "15px",
													color: "#3a3939",
													marginTop: "3px"
												}}
											/>
										}
										checkedChildren={
											<BsFillSunFill
												style={{
													color: "yellow",
													fontSize: "18px",
													marginTop: "2px"
												}}
											/>
										}
										defaultChecked={
											themeType === THEME_TYPE_DARK ? true : false
										}
										onChange={this.handleThemeChange}
									/>
								</li>

								<li className="gx-user-nav li-gap" >
									<UserInfo />
								</li>
							</ul>
						</div>
					</div>
				</Header>
			</Auxiliary>
		);
	}
}

const mapStateToProps = ({ settings }) => {
	const { navStyle, navCollapsed, width, themeType } = settings;
	return { navStyle, navCollapsed, width, themeType };
};

export default connect(mapStateToProps, {
	toggleCollapsedSideNav,
	setThemeType
})(Topbar);
