import React, { useEffect, lazy, Suspense } from "react";
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
	COWORKERS,
	DASHBOARD,
	EDITBLOG,
	FAQS,
	FORGOT_PASSWORD,
	HOLIDAY,
	INVITE,
	LEAVE,
	LEAVE_REPORT,
	LOGTIME,
	NOTICEBOARD,
	OVERVIEW,
	POLICY,
	PROFILE,
	PROJECTS,
	PROJECT_LOG,
	REPORTS,
	RESET_PASSWORD,
	RESOURCES,
	SETTINGS,
	SIGNIN,
	SIGNUP,
	WEEKLY_REPORT,
	WORK_LOG_REPORT
} from "helpers/routePath";
import { ProtectedRoute } from "components/Elements/ProtectedRoute";
// import Coworkers from "pages/Coworkers";
// import Projects from "pages/Projects";
// import LogTime from "pages/LogTime";
// import Leave from "pages/Leave";
// import Noticeboard from "pages/Noticeboard";
// import Blog from "pages/Blog";
// import Reports from "pages/Reports";
// import Resources from "pages/Resources";
// import Settings from "pages/Settings";
// import Attendace from "pages/Attendance";
// import Dashboard from "pages/Dashboard";
// import Overview from "pages/Overview";
// import ProjectLogs from "pages/ProjectLogs";
import Profile from "pages/Profile";
import InviteUserSignup from "pages/InviteUserSignup";
import WeeklyReport from "pages/Reports/WeeklyReport";
import WorkLogReport from "pages/Reports/WorkLogReport";
import LeaveReport from "pages/Reports/LeaveReport";
import Faqs from "pages/Resources/Faqs";
import Policy from "pages/Resources/Policy";
import Holiday from "pages/Resources/Holiday";
import Blogs from "pages/Blog/Blogs";
import BlogDetail from "pages/Blog/BlogDetail";
import AddBlog from "pages/Blog/AddBlog";
import { THEME_TYPE_DARK } from "constants/ThemeSetting";
import ForgotPassword from "containers/ForgotPassword";
import ResetPassword from "containers/ResetPassword";
import CircularProgress from "components/Elements/CircularProgress";

const Dashboard = lazy(() => import("pages/Dashboard"));
const Overview = lazy(() => import("pages/Overview"));
const Coworkers = lazy(() => import("pages/Coworkers"));
const Projects = lazy(() => import("pages/Projects"));
const Attendace = lazy(() => import("pages/Attendance"));
const LogTime = lazy(() => import("pages/LogTime"));
const Leave = lazy(() => import("pages/Leave"));
const Noticeboard = lazy(() => import("pages/Noticeboard"));
const Blog = lazy(() => import("pages/Blog"));
const Reports = lazy(() => import("pages/Reports"));
const Resources = lazy(() => import("pages/Resources"));
const Settings = lazy(() => import("pages/Settings"));
const ProjectLogs = lazy(() => import("pages/ProjectLogs"));

function App(props: any) {
	const { locale, authUser, themeType } = props;

	const currentAppLocale = AppLocale[locale.locale];

	useEffect(() => {
		if (themeType === THEME_TYPE_DARK) {
			document.body.classList.add("dark-theme");
		} else if (document.body.classList.contains("dark-theme")) {
			document.body.classList.remove("dark-theme");
		}
	}, [themeType]);

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
					<Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
					<Route path={RESET_PASSWORD} element={<ResetPassword />} />

					<Route element={<ProtectedRoute auth={authUser} />}>
						<Route element={<MainApp />}>
							<Route
								path={DASHBOARD}
								element={
									<Suspense fallback={<FallBack />}>
										<Dashboard />
									</Suspense>
								}
							/>
							<Route
								path={OVERVIEW}
								element={
									<Suspense fallback={<FallBack />}>
										<Overview />
									</Suspense>
								}
							/>
							<Route
								path={COWORKERS}
								element={
									<Suspense fallback={<FallBack />}>
										<Coworkers />
									</Suspense>
								}
							/>
							<Route
								path={PROJECTS}
								element={
									<Suspense fallback={<FallBack />}>
										<Projects />
									</Suspense>
								}
							></Route>
							<Route
								path={ATTENDANCE}
								element={
									<Suspense fallback={<FallBack />}>
										<Attendace />
									</Suspense>
								}
							/>
							<Route
								path={LOGTIME}
								element={
									<Suspense fallback={<FallBack />}>
										<LogTime />
									</Suspense>
								}
							/>
							<Route
								path={LEAVE}
								element={
									<Suspense fallback={<FallBack />}>
										<Leave />
									</Suspense>
								}
							/>
							<Route
								path={NOTICEBOARD}
								element={
									<Suspense fallback={<FallBack />}>
										<Noticeboard />
									</Suspense>
								}
							/>
							<Route
								path={BLOG}
								element={
									<Suspense fallback={<FallBack />}>
										<Blog />
									</Suspense>
								}
							>
								<Route path={BLOGS} element={<Blogs />} />
								<Route path={ADDBLOG} element={<AddBlog />} />
								<Route path={EDITBLOG} element={<AddBlog />} />
								<Route path={BLOGDETAIL} element={<BlogDetail />} />
							</Route>
							<Route
								path={REPORTS}
								element={
									<Suspense fallback={<FallBack />}>
										<Reports />
									</Suspense>
								}
							>
								<Route path={WEEKLY_REPORT} element={<WeeklyReport />} />
								<Route path={WORK_LOG_REPORT} element={<WorkLogReport />} />
								<Route path={LEAVE_REPORT} element={<LeaveReport />} />
							</Route>
							<Route
								path={RESOURCES}
								element={
									<Suspense fallback={<FallBack />}>
										<Resources />
									</Suspense>
								}
							>
								<Route path={FAQS} element={<Faqs />} />
								<Route path={POLICY} element={<Policy />} />
								<Route path={HOLIDAY} element={<Holiday />} />
							</Route>
							<Route
								path={SETTINGS}
								element={
									<Suspense fallback={<FallBack />}>
										<Settings />
									</Suspense>
								}
							/>
							<Route
								path={PROJECT_LOG}
								element={
									<Suspense fallback={<FallBack />}>
										<ProjectLogs />
									</Suspense>
								}
							/>
							<Route path={PROFILE} element={<Profile />} />
						</Route>
					</Route>
				</Routes>
			</IntlProvider>
		</ConfigProvider>
	);
}

const FallBack = () => <CircularProgress className="" />;

const mapStateToProps = ({ settings, auth }: { settings: any; auth: any }) => {
	const { locale, themeType } = settings;
	const { authUser } = auth;
	return { locale, authUser, themeType };
};
export default connect(mapStateToProps)(App);
