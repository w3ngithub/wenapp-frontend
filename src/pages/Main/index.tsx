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
	COWORKERS,
	DASHBOARD,
	PROJECTS,
	SIGNIN,
	SIGNUP
} from "helpers/routePath";
import Coworkers from "pages/Coworkers";
import Projects from "pages/Projects";
import { ProtectedRoute } from "components/Elements/ProtectedRoute";

function App(props: any) {
	const { match, layoutType, navStyle, locale, authUser, initURL } = props;
	const location = useLocation();

	const currentAppLocale = AppLocale[locale.locale];

	if (location.pathname === "/") {
		if (authUser === null || authUser === undefined) {
			return <Navigate to={SIGNIN} />;
		} else if (initURL === "" || initURL === "/" || initURL === SIGNIN) {
			return <Navigate to={DASHBOARD} />;
		} else {
			return <Navigate to={initURL} />;
		}

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

					<Route element={<ProtectedRoute auth={authUser} />}>
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
	const { locale } = settings;
	const { authUser } = auth;
	return { locale, authUser };
};
export default connect(mapStateToProps)(App);
