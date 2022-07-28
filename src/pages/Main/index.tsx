import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
// import URLSearchParams from "url-search-params";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "../../lngProvider";
import MainApp from "./MainApp";
import SignIn from "../../containers/SignIn";
import SignUp from "../../containers/SignUp";
import { setInitUrl } from "../../appRedux/actions/Auth";
import {
	onLayoutTypeChange,
	onNavStyleChange,
	setThemeType
} from "../../appRedux/actions/Setting";

import {
	LAYOUT_TYPE_BOXED,
	LAYOUT_TYPE_FRAMED,
	LAYOUT_TYPE_FULL,
	NAV_STYLE_ABOVE_HEADER,
	NAV_STYLE_BELOW_HEADER,
	NAV_STYLE_DARK_HORIZONTAL,
	NAV_STYLE_DEFAULT_HORIZONTAL,
	NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";
import Listing from "../../routes/main/dashboard/Listing/index";
import {
	COWORKERS,
	DASHBOARD,
	PROJECTS,
	SIGNIN,
	SIGNUP
} from "../../helpers/routePath";
import Coworkers from "../Coworkers";
import Projects from "../Projects";
import { ProtectedRoute } from "../../components/Elements/ProtectedRoute";

function App(props: any) {
	// const {
	// 	match,
	// 	location,
	// 	layoutType,
	// 	navStyle,
	// 	locale,
	// 	authUser,
	// 	initURL
	// } = props;
	const { match, layoutType, navStyle, locale, authUser, initURL } = props;
	const location = useLocation();
	const setLayoutType = (layoutType: string) => {
		if (layoutType === LAYOUT_TYPE_FULL) {
			document.body.classList.remove("boxed-layout");
			document.body.classList.remove("framed-layout");
			document.body.classList.add("full-layout");
		} else if (layoutType === LAYOUT_TYPE_BOXED) {
			document.body.classList.remove("full-layout");
			document.body.classList.remove("framed-layout");
			document.body.classList.add("boxed-layout");
		} else if (layoutType === LAYOUT_TYPE_FRAMED) {
			document.body.classList.remove("boxed-layout");
			document.body.classList.remove("full-layout");
			document.body.classList.add("framed-layout");
		}
	};

	const setNavStyle = (navStyle: string) => {
		if (
			navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
			navStyle === NAV_STYLE_DARK_HORIZONTAL ||
			navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
			navStyle === NAV_STYLE_ABOVE_HEADER ||
			navStyle === NAV_STYLE_BELOW_HEADER
		) {
			document.body.classList.add("full-scroll");
			document.body.classList.add("horizontal-layout");
		} else {
			document.body.classList.remove("full-scroll");
			document.body.classList.remove("horizontal-layout");
		}
	};

	useEffect(() => {}, []);

	// componentWillMount() {
	// 	if (this.props.initURL === "") {
	// 		// this.props.setInitUrl(this.props.history.location.pathname);
	// 		this.props.setInitUrl("/");
	// 	}
	// 	// const params = new URLSearchParams(this.props.location.search);

	// 	// if (params.has("theme")) {
	// 	// 	// this.props.setThemeType(params.get("theme"));
	// 	// }
	// 	// if (params.has("nav-style")) {
	// 	// 	// this.props.onNavStyleChange(params.get("nav-style"));
	// 	// }
	// 	// if (params.has("layout-type")) {
	// 	// 	// this.props.onLayoutTypeChange(params.get("layout-type"));
	// 	// }
	// }

	// this.setLayoutType(layoutType);

	// 	this.setNavStyle(navStyle);

	const currentAppLocale = AppLocale[locale.locale];

	if (location.pathname === "/") {
		// if (authUser === null) {
		// 	return <Navigate to={SIGNIN} />;
		// } else if (initURL === "" || initURL === "/" || initURL === SIGNIN) {
		// 	return <Navigate to={DASHBOARD} />;
		// } else {
		// 	return <Navigate to={initURL} />;
		// }

		return <Navigate to={DASHBOARD} />;
	}

	return (
		<LocaleProvider locale={currentAppLocale.antd}>
			<IntlProvider
				locale={currentAppLocale.locale}
				messages={currentAppLocale.messages}
			>
				<Routes>
					<Route path={SIGNIN} element={<SignIn />} />
					<Route path={SIGNUP} element={<SignUp />} />

					<Route element={<ProtectedRoute />}>
						<Route element={<MainApp />}>
							<Route path={DASHBOARD} element={<Listing />} />
							<Route path={COWORKERS} element={<Coworkers />} />
							<Route path={PROJECTS} element={<Projects />} />
						</Route>
					</Route>
				</Routes>
			</IntlProvider>
		</LocaleProvider>
	);
}

const mapStateToProps = ({ settings, auth }: { settings: any; auth: any }) => {
	const { locale, navStyle, layoutType } = settings;
	const { authUser, initURL } = auth;
	return { locale, navStyle, layoutType, authUser, initURL };
};
export default connect(mapStateToProps, {
	setInitUrl,
	setThemeType,
	onNavStyleChange,
	onLayoutTypeChange
})(App);
