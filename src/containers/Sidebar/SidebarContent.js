import React from "react";
import { Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
import { SIDEBAR_ICONS, SIDEBAR_ITEMS } from "constants/sideBarItems";

const SubMenu = Menu.SubMenu;

function SidebarContent(props) {
	const { themeType, navStyle } = props;
	const navigate = useNavigate();
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
			<CustomScrollbars className="gx-layout-sider-scrollbar">
				<div className="gx-sidebar-content">
					<Menu
						defaultOpenKeys={["reports"]}
						selectedKeys={[defaultOpenKeys]}
						theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
						mode="inline"
						onClick={props => {
							console.log(props);
							navigate(props.key);
						}}
						items={SIDEBAR_ITEMS.map(item => ({
							...item,
							icon: (
								<i
									className={`icon icon-${item.iconName} gx-fs-xlxl `}
									style={{ marginRight: "10px" }}
								/>
							)
						}))}
					/>
				</div>
			</CustomScrollbars>
		</Auxiliary>
	);
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ settings }) => {
	const { navStyle, themeType, locale, pathname } = settings;
	return { navStyle, themeType, locale, pathname };
};
export default connect(mapStateToProps)(SidebarContent);
