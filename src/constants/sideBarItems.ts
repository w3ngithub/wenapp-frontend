import {
	ATTENDANCE,
	BLOG,
	COWORKERS,
	DASHBOARD,
	FAQS,
	HOLIDAY,
	LEAVE,
	LEAVE_REPORT,
	LOGTIME,
	NOTICEBOARD,
	OVERVIEW,
	POLICY,
	PROJECTS,
	REPORTS,
	RESOURCES,
	SETTINGS,
	WEEKLY_REPORT,
	WORK_LOG_REPORT
} from "../helpers/routePath";
import sidebarItemsInterface from "../types/sideBar";

export const SIDEBAR_ITEMS: sidebarItemsInterface[] = [
	{
		icon: "dasbhoard",
		name: "sidebar.dashboard",
		url: DASHBOARD,
		isExpandable: false,
		id: 1
	},
	{
		icon: "view-o",
		name: "sidebar.overview",
		url: OVERVIEW,
		isExpandable: false,
		id: 12
	},
	{
		icon: "contacts",

		name: "sidebar.coworkers",
		url: COWORKERS,
		isExpandable: false,
		id: 2
	},
	{
		icon: "folder-o",

		name: "sidebar.projects",
		url: PROJECTS,
		isExpandable: false,
		id: 3
	},
	{
		icon: "select",

		name: "sidebar.attendance",
		url: ATTENDANCE,
		isExpandable: false,
		id: 4
	},
	{
		icon: "ckeditor",
		name: "sidebar.logtime",
		url: LOGTIME,
		isExpandable: false,
		id: 5
	},
	{
		icon: "hotel-booking",
		name: "sidebar.leavemanagement",
		url: LEAVE,
		isExpandable: false,
		id: 6
	},
	{
		icon: "calendar-new",
		name: "sidebar.noticeboard",
		url: NOTICEBOARD,
		isExpandable: false,
		id: 7
	},
	{
		icon: "chat-new",

		name: "sidebar.blog",
		url: BLOG,
		isExpandable: false,
		id: 8
	},
	{
		icon: "chart-line",

		name: "sidebar.reports",
		url: REPORTS,
		isExpandable: true,
		id: 9,
		subItems: [
			{
				name: "sidebar.reports.weeklyreport",
				url: WEEKLY_REPORT,
				id: 1
			},
			{
				name: "sidebar.reports.worklogreport",
				url: WORK_LOG_REPORT,
				id: 2
			},
			{
				name: "sidebar.reports.leavereport",
				url: LEAVE_REPORT,
				id: 3
			}
		]
	},
	{
		icon: "editor",

		name: "sidebar.resources",
		url: RESOURCES,
		isExpandable: true,
		id: 10,
		subItems: [
			{
				name: "sidebar.resources.faq",
				url: FAQS,
				id: 1
			},
			{
				name: "sidebar.resources.policy",
				url: POLICY,
				id: 2
			},
			{
				name: "sidebar.resources.holiday",
				url: HOLIDAY,
				id: 3
			}
		]
	},
	{
		icon: "setting",
		name: "sidebar.settings",
		url: SETTINGS,
		isExpandable: false,
		id: 11
	}
];
