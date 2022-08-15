import React from "react";
import { Button, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

const BlogItem = ({ blog, grid }) => {
	const navigate = useNavigate();

	const {
		title,
		content,
		createdBy,
		createdAt,
		blogCategories,
		_id,
		slug
	} = blog;

	return (
		<div
			className={`gx-product-item  ${
				grid ? "gx-product-vertical" : "gx-product-horizontal"
			}`}
		>
			<div className="gx-product-image">
				<div className="gx-grid-thumb-equal">
					<span className="gx-link gx-grid-thumb-cover">
						<img
							alt="Remy Sharp"
							src={
								"https://images.unsplash.com/photo-1660505155761-fb440082f784?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
							}
						/>
					</span>
				</div>
			</div>

			<div className="gx-product-body">
				<h3 className="gx-product-title">{title}</h3>
				<div className="ant-row-flex">
					<small className="gx-text-grey">
						<EditOutlined />
						{" " + createdBy.name} - {moment(createdAt).format("LL")}
					</small>

					<h6 className="gx-text-success gx-mb-1 gx-mt-1">
						{blogCategories?.map(x => (
							<Tag color="cyan" key={x._id}>
								{x.name}
							</Tag>
						))}
					</h6>
				</div>

				<p>{parse(content?.substring(0, 200))}...</p>
			</div>

			<div className="gx-product-footer">
				<Button
					type="primary"
					onClick={() => {
						navigate(`${_id}-${slug}`);
					}}
				>
					Read More
				</Button>
			</div>
		</div>
	);
};

export default BlogItem;
