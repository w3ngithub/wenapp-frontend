import { Avatar, Timeline } from "antd";
import React from "react";
import ActivityItem from "../dashboard/CRM/ActivityItem";
import { changeDate, dayCheck, oneWeekFilterCheck } from "helpers/utils";

const TimeLineItem = Timeline.Item;

export const events: any = ({
	announcementsData = [],
	holidaysData = [],
	birthdayData = [],
	SalaryReviewData = []
}): any => [
	{
		id: 1,
		day: "Announcements",
		Icon: <i className="icon icon-alert gx-fs-xxl" />,
		tasks: announcementsData || []
	},
	{
		id: 2,
		day: "Holidays",
		Icon: <i className="icon icon-calendar gx-fs-xxl" />,
		tasks: holidaysData || []
	},
	{
		id: 3,
		day: "Salary Review",
		Icon: <i className="icon icon-schedule gx-fs-xxl" />,
		tasks: SalaryReviewData
	},
	{
		id: 4,
		day: "Birthdays",
		Icon: <i className="icon icon-birthday-new gx-fs-xxl" />,
		tasks: birthdayData
	}
];

function EventsAndAnnouncements({
	announcements,
	holidays,
	birthdays,
	salaryReview
}: {
	announcements: any;
	holidays: any;
	birthdays: any[];
	salaryReview: any[];
}) {
	const announcementsData = announcements?.map((x: any) => ({
		id: x._id,
		name: x.title,
		title: [
			<>
				<p className="gx-mb-0">{x.startDate && changeDate(x.startDate)}</p>
				{x.details}
			</>
		],
		Icon: "notification",
		imageList: []
	}));

	const holidaysData = holidays?.filter(oneWeekFilterCheck)?.map((x: any) => ({
		id: x._id,
		name: x.title,
		title: [
			<p>
				{x.date && changeDate(x.date)} - {x.title}
			</p>
		],
		Icon: "important-o"
	}));

	const birthdayData = birthdays?.map((x: any) => ({
		id: x._id,
		name: x.name,
		title: [<span>{dayCheck(x.dob)} -</span>, ` ${x.name}`],
		avatar: x.photoURL || ""
	}));

	const SalaryReviewData = salaryReview?.map((x: any) => ({
		id: x._id,
		name: x.name,
		title: [<span>{dayCheck(x.newSalaryReviewDate)} -</span>, ` ${x.name}`],
		avatar: x.photoURL || ""
	}));

	function getName(task: any, shape: any) {
		if (task?.avatar === "") {
			let nameSplit = task?.name.split(" ");
			if (task?.name.split(" ").length === 1) {
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
					<Avatar shape={shape} className="gx-size-30 gx-bg-primary">
						{initials}
					</Avatar>
				);
			}
		} else if (task?.avatar === undefined || task.avatar === null) {
			return <i className={`icon icon-${task.Icon} gx-fs-xl`} />;
			// return <task.Icon className="gx-fs-lg" />;
		} else {
			return (
				<Avatar
					shape={shape}
					className="gx-size-30 gx-bg-primary"
					src={task.avatar}
				/>
			);
		}
	}
	return (
		<div className="gx-entry-sec">
			{/* <WidgetHeader title="Upcoming Events" /> */}
			{events({
				announcementsData,
				holidaysData,
				birthdayData,
				SalaryReviewData
			})?.map((activity: any, index: number) => (
				<div className="gx-timeline-info" key={"activity" + index}>
					<div className="gx-flex-row gx-align-items-center gx-column-gap-10 gx-mb-3">
						{/* <activity.Icon className="gx-fs-xxl" /> */}
						{activity.Icon}
						<h3 className=" gx-mb-1 ">{activity?.day}</h3>
					</div>
					<Timeline>
						{activity?.tasks?.map((task: any, index: number) => {
							return (
								<TimeLineItem
									style={{ marginLeft: "8px" }}
									key={"timeline" + index}
									dot={getName(task, "")}
								>
									<ActivityItem task={task} />
								</TimeLineItem>
							);
						})}
					</Timeline>
				</div>
			))}
		</div>
	);
}

export default EventsAndAnnouncements;
