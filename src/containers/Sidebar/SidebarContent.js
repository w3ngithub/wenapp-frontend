import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import {
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	THEME_TYPE_LITE
} from "constants/ThemeSetting";
import IntlMessages from "util/IntlMessages";
import { connect } from "react-redux";
import { SIDEBAR_ITEMS } from "constants/sideBarItems";

const SubMenu = Menu.SubMenu;

function SidebarContent(props) {
	const { themeType, navStyle } = props;
	const location = useLocation();
	const defaultOpenKeys = location.pathname.split("/")[1];

	const getNoHeaderClass = navStyle => {
		if (
			navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
			navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
		) {
			return "gx-no-header-notifications";
		}
		return "";
	};

	const getNavStyleSubMenuClass = navStyle => {
		if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
			return "gx-no-header-submenu-popup";
		}
		return "";
	};

	return (
		<Auxiliary>
			<SidebarLogo />
			<div className="gx-sidebar-content">
				<CustomScrollbars className="gx-layout-sider-scrollbar">
					<Menu
						defaultOpenKeys={["reports"]}
						selectedKeys={[defaultOpenKeys]}
						theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
						mode="inline"
						items={SIDEBAR_ITEMS}
					/>
				</CustomScrollbars>
			</div>
		</Auxiliary>
	);
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ settings }) => {
	const { navStyle, themeType, locale, pathname } = settings;
	return { navStyle, themeType, locale, pathname };
};
export default connect(mapStateToProps)(SidebarContent);
