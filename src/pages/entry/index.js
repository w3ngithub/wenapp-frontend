import React, { Component } from "react";
import { connect } from "react-redux";
import URLSearchParams from "url-search-params";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "containers/SignIn";
import SignUp from "containers/SignUp";
import { setInitUrl } from "appRedux/actions/Auth";
import {
	onLayoutTypeChange,
	onNavStyleChange,
	setThemeType
} from "appRedux/actions/Setting";

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

const RestrictedRoute = ({
	component: Component,
	authUser = true,
	children,
	...rest
}) => {
	let location = useLocation();
	console.log("protected");
	if (!authUser) {
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	if (authUser) return <Navigate to="/dashboard" />;

	return children;
};

class App extends Component {
	setLayoutType = layoutType => {
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

	setNavStyle = navStyle => {
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

	componentWillMount() {
		if (this.props.initURL === "") {
			// this.props.setInitUrl(this.props.history.location.pathname);
			this.props.setInitUrl("/");
		}
		// const params = new URLSearchParams(this.props.location.search);

		this.props.setThemeType("");
		this.props.onNavStyleChange("");
		this.props.onLayoutTypeChange("");
		// if (params.has("theme")) {
		// 	// this.props.setThemeType(params.get("theme"));
		// }
		// if (params.has("nav-style")) {
		// 	// this.props.onNavStyleChange(params.get("nav-style"));
		// }
		// if (params.has("layout-type")) {
		// 	// this.props.onLayoutTypeChange(params.get("layout-type"));
		// }
	}

	render() {
		const {
			match,
			location,
			layoutType,
			navStyle,
			locale,
			authUser,
			initURL
		} = this.props;
		// if (location.pathname === "/") {
		// 	// if (authUser === null) {
		// 	// 	return <Redirect to={"/signin"} />;
		// 	// } else if (initURL === "" || initURL === "/" || initURL === "/signin") {
		// 	// 	return <Redirect to={"/main/dashboard/listing"} />;
		// 	// } else {
		// 	// 	return <Redirect to={initURL} />;
		// 	// }

		// 	return <Navigate to={"/main/dashboard/listing"} />;
		// }
		this.setLayoutType(layoutType);

		this.setNavStyle(navStyle);

		const currentAppLocale = AppLocale[locale.locale];

		return (
			<LocaleProvider locale={currentAppLocale.antd}>
				<IntlProvider
					locale={currentAppLocale.locale}
					messages={currentAppLocale.messages}
				>
					<Routes>
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route
							path="/"
							element={
								// <RestrictedRoute>
								<MainApp />
								// </RestrictedRoute>
							}
						>
							<Route path="dashboard" element={<Listing />} />
						</Route>
						{/* <RestrictedRoute
							path="/"
							authUser={authUser}
							component={<MainApp />}
						/> */}
					</Routes>
				</IntlProvider>
			</LocaleProvider>
		);
	}
}

const mapStateToProps = ({ settings, auth }) => {
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
