import { Avatar, Timeline } from "antd";
import WidgetHeader from "components/Elements/WidgetHeader";
import React from "react";
import ActivityItem from "../dashboard/CRM/ActivityItem";

const TimeLineItem = Timeline.Item;

export const events = [
	{
		id: 1,
		day: "Announncements",
		tasks: [
			{
				id: 1,
				name: "Mila Alba",
				title: [
					<p>
						08/23/2022 We will shutdown our server for maintenance today at
						12:00PM. Please save your work accordingly
					</p>
				],
				avatar: "https://via.placeholder.com/150x150",
				imageList: []
			}
		]
	},
	{
		id: 2,
		day: "Holidays",
		tasks: [
			{
				id: 5,
				name: "Kily Johns",
				title: [
					<span className="gx-link" key={7}>
						Today -
					</span>,
					" Janai Purnima"
				],
				avatar: ""
			}
		]
	},
	{
		id: 3,
		day: "Salary Review",
		tasks: [
			{
				id: 5,
				name: "Kily Johns",
				title: [
					<span className="gx-link" key={7}>
						Today -
					</span>,
					" Ashok Ganika"
				],
				avatar: ""
			},
			{
				id: 5,
				name: "Kily Johns",
				title: [
					<span className="gx-link" key={7}>
						Tomorrow -
					</span>,
					" Pariskrit Moktan"
				],
				avatar: ""
			}
		]
	},
	{
		id: 3,
		day: "Birthdays",
		tasks: [
			{
				id: 5,
				name: "Kily Johns",
				title: [
					<span className="gx-link" key={7}>
						Today -
					</span>,
					" Ashok Ganika"
				],
				avatar: ""
			},
			{
				id: 5,
				name: "Kily Johns",
				title: [
					<span className="gx-link" key={7}>
						Tomorrow -
					</span>,
					" Pariskrit Moktan"
				],
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
					<Avatar shape={shape} className="gx-size-40 gx-bg-primary">
						{initials}
					</Avatar>
				);
			} else {
				const initials =
					nameSplit[0].charAt(0).toUpperCase() +
					nameSplit[1].charAt(0).toUpperCase();
				return (
					<Avatar shape={shape} className="gx-size-40 gx-bg-cyan">
						{initials}
					</Avatar>
				);
			}
		} else {
			return <Avatar shape={shape} className="gx-size-40" src={task.avatar} />;
		}
	}
	return (
		<div className="gx-entry-sec">
			<WidgetHeader title="Upcoming Events" />
			{events.map((activity, index) => (
				<div className="gx-timeline-info" key={"activity" + index}>
					<h4 className="gx-timeline-info-day">{activity.day}</h4>
					<Timeline>
						{activity.tasks.map((task, index) => {
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
