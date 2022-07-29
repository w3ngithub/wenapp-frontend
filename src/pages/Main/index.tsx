import React from "react";
import { connect } from "react-redux";
// import URLSearchParams from "url-search-params";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "containers/SignIn";
import SignUp from "containers/SignUp";

import Listing from "routes/main/dashboard/Listing/index";
import {
	ATTENDANCE,
	BLOG,
	COWORKERS,
	DASHBOARD,
	LEAVE,
	LOGTIME,
	NOTICEBOARD,
	PROJECTS,
	REPORTS,
	RESOURCES,
	SETTINGS,
	SIGNIN,
	SIGNUP
} from "helpers/routePath";
import Coworkers from "pages/Coworkers";
import Projects from "pages/Projects";
import { ProtectedRoute } from "components/Elements/ProtectedRoute";
import LogTime from "pages/LogTime";
import Leave from "pages/Leave";
import Noticeboard from "pages/Noticeboard";
import Blog from "pages/Blog";
import Reports from "pages/Reports";
import Resources from "pages/Resources";
import Settings from "pages/Settings";
import Attendace from "pages/Attendance";

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
	const { locale, authUser } = props;
	const location = useLocation();

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
							<Route path={ATTENDANCE} element={<Attendace />} />
							<Route path={LOGTIME} element={<LogTime />} />
							<Route path={LEAVE} element={<Leave />} />
							<Route path={NOTICEBOARD} element={<Noticeboard />} />
							<Route path={BLOG} element={<Blog />} />
							<Route path={REPORTS} element={<Reports />} />
							<Route path={RESOURCES} element={<Resources />} />
							<Route path={SETTINGS} element={<Settings />} />
						</Route>
					</Route>
				</Routes>
			</IntlProvider>
		</LocaleProvider>
	);
}

const mapStateToProps = ({ settings, auth }: { settings: any; auth: any }) => {
	const { locale } = settings;
	const { authUser } = auth;
	return { locale, authUser };
};
export default connect(mapStateToProps)(App);
