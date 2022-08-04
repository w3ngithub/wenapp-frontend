import React from "react";
import { Breadcrumb, Icon } from "antd";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "helpers/routePath";

const LogsBreadCumb = ({ slug }) => {
	const navigate = useNavigate();

	return (
		<Breadcrumb>
			<Breadcrumb.Item onClick={() => navigate(`/${PROJECTS}`)}>
				<span className="gx-link">
					<Icon type="folder" />
					<span>Projects</span>
				</span>
			</Breadcrumb.Item>
			<Breadcrumb.Item>{slug}</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default LogsBreadCumb;
