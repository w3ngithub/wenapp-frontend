import sidebarItemsInterface from "../types/sideBar";

export const SIDEBAR_ITEMS: sidebarItemsInterface[] = [
	{
		icon: "icon-dasbhoard",
		name: "sidebar.dashboard",
		url: "/main/dashboard/listing",
		isExpandable: false,
		id: 1
	},
	{
		icon: "icon-contacts",

		name: "sidebar.coworkers",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 2
	},
	{
		icon: "icon-folder-o",

		name: "sidebar.projects",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 3
	},
	{
		icon: "icon-select",

		name: "sidebar.attendance",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 4
	},
	{
		icon: "icon-ckeditor",
		name: "sidebar.logtime",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 5
	},
	{
		icon: "icon-hotel-booking",
		name: "sidebar.leavemanagement",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 6
	},
	{
		icon: "icon-calendar-new",
		name: "sidebar.noticeboard",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 7
	},
	{
		icon: "icon-chat-new",

		name: "sidebar.blog",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 8
	},
	{
		icon: "icon-chart-line",

		name: "sidebar.reports",
		url: "",
		isExpandable: true,
		id: 9,
		subItems: [
			{
				name: "sidebar.reports.weeklyreport",
				url: "/components/general/button",
				id: 1
			},
			{
				name: "sidebar.reports.worklogreport",
				url: "/components/general/icon",
				id: 2
			},
			{
				name: "sidebar.reports.leavereport",
				url: "/main/dashboard/crypto",
				id: 3
			}
		]
	},
	{
		icon: "icon-editor",

		name: "sidebar.resources",
		url: "",
		isExpandable: true,
		id: 10,
		subItems: [
			{
				name: "sidebar.resources.faq",
				url: "/components/general/button",
				id: 1
			},
			{
				name: "sidebar.resources.policy",
				url: "/components/general/icon",
				id: 2
			},
			{
				name: "sidebar.resources.calendar",
				url: "/main/dashboard/crypto",
				id: 3
			}
		]
	},
	{
		icon: "icon-setting",
		name: "sidebar.settings",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 11
	}
];
