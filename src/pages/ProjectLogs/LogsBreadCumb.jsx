import React from "react";
import { Breadcrumb } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "helpers/routePath";

const LogsBreadCumb = ({ slug }) => {
	const navigate = useNavigate();

	return (
		<Breadcrumb>
			<Breadcrumb.Item onClick={() => navigate(`/${PROJECTS}`)}>
				<span className="gx-link">
					<InboxOutlined type="folder" />
					<span className="gx-ml-1">Projects</span>
				</span>
			</Breadcrumb.Item>
			<Breadcrumb.Item>{slug}</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default LogsBreadCumb;
