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
	SETTINGS
} from "../helpers/routePath";

export const SIDEBAR_ITEMS= [
		{
		iconName: "dasbhoard",
		key: "sidebar.dashboard",
		label: "Dashboard",
		name: "sidebar.dashboard",
		url: DASHBOARD,
		isExpandable: false,
		id: 1
	},	
		{
		iconName: "contacts",
		label: "Coworkers",
		key: "sidebar.coworkers",
		name: "sidebar.coworkers",
		url: COWORKERS,
		isExpandable: false,
		id: 2
	},
		{
		iconName: "folder-o",
		label: "Projects",
		key: "sidebar.projects",
		name: "sidebar.projects",
		url: PROJECTS,
		isExpandable: false,
		id: 3
	},
	{
		iconName: "select",
		label: "Attendance",
		key: "sidebar.attendance",
		name: "sidebar.attendance",
		url: ATTENDANCE,
		isExpandable: false,
		id: 4
	},
		{
		iconName: "ckeditor",
		key:"sidebar.logtime",
		label:'Log Time',
		name: "sidebar.logtime",
		url: LOGTIME,
		isExpandable: false,
		id: 5
	},
		{
		iconName: "hotel-booking",
		key:"sidebar.leavemanagement",
		label:"Leave Management",
		name: "sidebar.leavemanagement",
		url: LEAVE,
		isExpandable: false,
		id: 6
	},
	{
		iconName: "calendar-new",
		key:"sidebar.noticeboard",
		label: 'Noticeboard',
		name: "sidebar.noticeboard",
		url: NOTICEBOARD,
		isExpandable: false,
		id: 7
	},
	{
		iconName: "chat-new",
		key: "sidebar.blog",
		label:'Blog',
		name: "sidebar.blog",
		url: BLOG,
		isExpandable: false,
		id: 8
	},
	{
		iconName: "chart-line",
		key: "sidebar.reports",
		label: "Reports",
		name: "sidebar.reports",
		url: REPORTS,
		isExpandable: true,
		id: 9,
		children: [
			{	label:"Weekly Report",
				key: "sidebar.reports.weeklyreport",
				name: "sidebar.reports.weeklyreport",
				url: REPORTS,
				id: 1
			},
			{
				label:"Work Log Report",
				key: "sidebar.reports.worklogreport",
				name: "sidebar.reports.worklogreport",
				url: "worklog",
				id: 2
			},
			{	
				label:"Leave Report",
				key: "sidebar.reports.leavereport",
				name: "sidebar.reports.leavereport",
				url: "leavereport",
				id: 3
			}
		]
	},
	{
		iconName: "editor",
		key: "sidebar.resources",
		label:'Resources',
		name: "sidebar.resources",
		url: "",
		isExpandable: true,
		id: 10,
		children: [
			{	
				label:'FAQ',
				key:"sidebar.resources.faq",
				name: "sidebar.resources.faq",
				url: "/components/general/button",
				id: 1
			},
			{	
				label:'Policy',
				key:"sidebar.resources.policy",
				name: "sidebar.resources.policy",
				url: "/components/general/icon",
				id: 2
			},
			{	label:'Calendar',
				key:'sidebar.resources.calendar',
				name: "sidebar.resources.calendar",
				url: "/main/dashboard/crypto",
				id: 3
			}
		]
	},
	{
		iconName: "setting",
		key: "sidebar.settings",
		label: 'Settings',
		name: "sidebar.settings",
		url: SETTINGS,
		isExpandable: false,
		id: 11
	}
];






