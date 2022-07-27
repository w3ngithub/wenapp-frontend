import sidebarItemsInterface from "../types/sideBar";

export const SIDEBAR_ITEMS: sidebarItemsInterface[] = [
	{
		name: "sidebar.dashboard",
		url: "/main/dashboard/listing",
		isExpandable: false,
		id: 1
	},
	{
		name: "sidebar.coworkers",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 2
	},
	{
		name: "sidebar.projects",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 3
	},
	{
		name: "sidebar.attendance",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 4
	},
	{
		name: "sidebar.logtime",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 5
	},
	{
		name: "sidebar.leavemanagement",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 6
	},
	{
		name: "sidebar.noticeboard",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 7
	},
	{
		name: "sidebar.blog",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 8
	},
	{
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
		name: "sidebar.settings",
		url: "/main/dashboard/crypto",
		isExpandable: false,
		id: 11
	}
];
