import { Avatar, Timeline } from "antd";
import WidgetHeader from "components/Elements/WidgetHeader";
import React from "react";
import ActivityItem from "../dashboard/CRM/ActivityItem";
import {
	InfoCircleOutlined,
	NotificationOutlined,
	CalendarOutlined,
	ClockCircleOutlined
} from "@ant-design/icons";

const TimeLineItem = Timeline.Item;

export const events: any[] = [
	{
		id: 1,
		day: "Announcements",
		Icon: NotificationOutlined,
		tasks: [
			{
				id: 1,
				name: "Mila Alba",
				title: [
					<p>
						08/23/2022
						<br /> We will shutdown our server for maintenance today at 12:00PM.
						Please save your work accordingly
					</p>
				],
				Icon: InfoCircleOutlined,
				imageList: []
			}
		]
	},
	{
		id: 2,
		day: "Holidays",
		Icon: CalendarOutlined,

		tasks: [
			{
				id: 5,
				name: "Kily Johns",
				title: [<span>Today -</span>, " Janai Purnima"],
				Icon: InfoCircleOutlined
			}
		]
	},
	{
		id: 3,
		day: "Salary Review",
		Icon: ClockCircleOutlined,

		tasks: [
			{
				id: 5,
				name: "Kily Johns",
				title: [<span>Today -</span>, " Ashok Ganika"],
				Icon: InfoCircleOutlined
			},
			{
				id: 5,
				name: "Kily Johns",
				title: [<span>Tomorrow -</span>, " Pariskrit Moktan"],
				Icon: InfoCircleOutlined
			}
		]
	},
	{
		id: 3,
		day: "Birthdays",
		Icon: InfoCircleOutlined,

		tasks: [
			{
				id: 5,
				name: "Ashok Ganika",
				title: [<span>Today -</span>, " Ashok Ganika"],
				avatar: ""
			},
			{
				id: 5,
				name: "Pariskrit Moktan",
				title: [<span>Tomorrow -</span>, " Pariskrit Moktan"],
				avatar: ""
			}
		]
	}
];

function EventsAndAnnouncements() {
	function getName(task: any, shape: any) {
		if (task.avatar === "") {
			let nameSplit = task.name.split(" ");
			if (task.name.split(" ").length === 1) {
				const initials = nameSplit[0].charAt(0).toUpperCase();
				return (
					<Avatar shape={shape} className="gx-size-24 gx-bg-primary">
						{initials}
					</Avatar>
				);
			} else {
				const initials =
					nameSplit[0].charAt(0).toUpperCase() +
					nameSplit[1].charAt(0).toUpperCase();
				return (
					<Avatar shape={shape} className="gx-size-24 gx-bg-primary">
						{initials}
					</Avatar>
				);
			}
		} else {
			return <div></div>;
			// return <task.Icon className="gx-fs-lg" />;
		}
	}
	return (
		<div className="gx-entry-sec">
			{/* <WidgetHeader title="Upcoming Events" /> */}
			{events.map((activity, index) => (
				<div className="gx-timeline-info" key={"activity" + index}>
					<div className="gx-flex-row gx-align-items-center gx-column-gap-10 gx-mb-3">
						<activity.Icon className="gx-fs-xxl" />
						<h3 className=" gx-mb-1 ">{activity.day}</h3>
					</div>
					<Timeline>
						{activity.tasks.map((task: any, index: number) => {
							return (
								<TimeLineItem
									key={"timeline" + index}
									// mode="alternate"
									dot={getName(task, "")}
								>
									<ActivityItem task={task} />
								</TimeLineItem>
							);
						})}
					</Timeline>
				</div>
			))}
			{/* <span
        className="gx-link gx-btn-link"
        onClick={this.onLoadMore.bind(this)}
    >
        Load More
    </span> */}
		</div>
	);
}

export default EventsAndAnnouncements;
