import React from "react";
import Widget from "components/Elements/Widget/index";
import { TeamOutlined } from "@ant-design/icons";

const TotalCountCard = ({
	totalCount,
	label,
	className = "gx-blue-cyan-gradient",
	icon: Icon = TeamOutlined
}: {
	className?: string;
	totalCount: number;
	label: string;
	icon?: any;
}) => {
	return (
		<Widget styleName={`${className} gx-text-white gx-card-1367-p`}>
			<div className="gx-flex-row gx-justify-content-between gx-mb-2">
				{/* <TeamOutlined className="gx-fs-xlxl gx-mr-2" /> */}
				<Icon className="gx-fs-xlxl gx-mr-2" />
			</div>
			<h2 className="gx-text-white">{totalCount}</h2>
			<p className="gx-mb-0">{label}</p>
		</Widget>
	);
};

export default TotalCountCard;
