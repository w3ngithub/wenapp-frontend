import React from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";

import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "containers/SignIn";
import SignUp from "containers/SignUp";

import {
	ADDBLOG,
	ATTENDANCE,
	BLOG,
	BLOGDETAIL,
	BLOGS,
	CALENDAR,
	COWORKERS,
	DASHBOARD,
	EDITBLOG,
	FAQS,
	INVITE,
	LEAVE,
	LEAVE_REPORT,
	LOGTIME,
	NOTICEBOARD,
	POLICY,
	PROFILE,
	PROJECTS,
	PROJECT_LOG,
	REPORTS,
	RESOURCES,
	SETTINGS,
	SIGNIN,
	SIGNUP,
	WEEKLY_REPORT,
	WORK_LOG_REPORT
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
import ProjectLogs from "pages/ProjectLogs";
import WeeklyReport from "pages/Reports/WeeklyReport";
import WorkLogReport from "pages/Reports/WorkLogReport";
import LeaveReport from "pages/Reports/LeaveReport";
import Faqs from "pages/Resources/Faqs";
import Policy from "pages/Resources/Policy";
import Calendar from "pages/Resources/Calendar";
import Blogs from "pages/Blog/Blogs";
import BlogDetail from "pages/Blog/BlogDetail";
import AddBlog from "pages/Blog/AddBlog";

function App(props: any) {
	const { locale, authUser } = props;

	const currentAppLocale = AppLocale[locale.locale];

	return (
		<ConfigProvider locale={currentAppLocale.antd}>
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
							<Route path={PROJECTS} element={<Projects />}></Route>
							<Route path={ATTENDANCE} element={<Attendace />} />
							<Route path={LOGTIME} element={<LogTime />} />
							<Route path={LEAVE} element={<Leave />} />
							<Route path={NOTICEBOARD} element={<Noticeboard />} />
							<Route path={BLOG} element={<Blog />}>
								<Route path={BLOGS} element={<Blogs />} />
								<Route path={ADDBLOG} element={<AddBlog />} />
								<Route path={EDITBLOG} element={<AddBlog />} />
								<Route path={BLOGDETAIL} element={<BlogDetail />} />
							</Route>
							<Route path={REPORTS} element={<Reports />}>
								<Route path={WEEKLY_REPORT} element={<WeeklyReport />} />
								<Route path={WORK_LOG_REPORT} element={<WorkLogReport />} />
								<Route path={LEAVE_REPORT} element={<LeaveReport />} />
							</Route>
							<Route path={RESOURCES} element={<Resources />}>
								<Route path={FAQS} element={<Faqs />} />
								<Route path={POLICY} element={<Policy />} />
								<Route path={CALENDAR} element={<Calendar />} />
							</Route>
							<Route path={SETTINGS} element={<Settings />} />
							<Route path={PROFILE} element={<Profile />} />
							<Route path={PROJECT_LOG} element={<ProjectLogs />} />
						</Route>
					</Route>
				</Routes>
			</IntlProvider>
		</ConfigProvider>
	);
}

const mapStateToProps = ({ settings, auth }: { settings: any; auth: any }) => {
	const { locale } = settings;
	const { authUser } = auth;
	return { locale, authUser };
};
export default connect(mapStateToProps)(App);
