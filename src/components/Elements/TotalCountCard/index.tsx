import React from "react";
import Widget from "components/Elements/Widget/index";
import { TeamOutlined } from "@ant-design/icons";

const TotalCountCard = ({
	isLink,
	totalCount,
	label,
	className = "gx-blue-cyan-gradient",
	icon: Icon = TeamOutlined
}: {
	isLink?: boolean;
	className?: string;
	totalCount: number;
	label: string;
	icon?: any;
}) => {
	return (
		<Widget
			styleName={`${className} gx-text-white gx-card-1367-p ${
				isLink ? "gx-link" : ""
			}`}
		>
			<div className="gx-flex-row gx-align-items-center  gx-mb-2">
				<Icon className="gx-fs-icon-lg gx-mr-2" />
				<div>
					<h2 className="gx-text-white">{totalCount}</h2>
					<p className="gx-mb-0">{label}</p>
				</div>
			</div>
		</Widget>
	);
};

export default TotalCountCard;
