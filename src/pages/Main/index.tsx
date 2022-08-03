import React from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "containers/SignIn";
import SignUp from "containers/SignUp";

import {
	ATTENDANCE,
	BLOG,
	COWORKERS,
	DASHBOARD,
	INVITE,
	LEAVE,
	LOGTIME,
	NOTICEBOARD,
	PROFILE,
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
import Dashboard from "pages/Dashboard";
import Profile from "pages/Profile";
import InviteUserSignup from "pages/InviteUserSignup";

function App(props: any) {
	const { locale, authUser } = props;

	const currentAppLocale = AppLocale[locale.locale];

	return (
		<LocaleProvider locale={currentAppLocale.antd}>
			<IntlProvider
				locale={currentAppLocale.locale}
				messages={currentAppLocale.messages}
			>
				<Routes>
					<Route path="/" element={<Navigate to={DASHBOARD} />} />
					<Route path={SIGNIN} element={<SignIn />} />
					<Route path={SIGNUP} element={<SignUp />} />
					<Route path={INVITE} element={<InviteUserSignup />} />

					<Route element={<ProtectedRoute auth={authUser} />}>
						<Route element={<MainApp />}>
							<Route path={DASHBOARD} element={<Dashboard />} />
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
							<Route path={PROFILE} element={<Profile />} />
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
