import React from "react";
import { Button, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import parse from "html-react-parser";

import { Link } from "react-router-dom";

const BlogItem = ({ blog, grid, removeBlog, access }) => {
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
			<div style={{ padding: "24px" }}>
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

				<p>
					{parse(content?.substring(0, 400))}...
					<Link to={`${_id}-${slug}`}> read more</Link>{" "}
					{access && (
						<Popconfirm
							title="Are you sure to delete this Blog?"
							onConfirm={() => removeBlog(_id)}
							okText="Yes"
							cancelText="No"
						>
							<DeleteOutlined style={{ color: "red" }} />
						</Popconfirm>
					)}
				</p>
			</div>
		</div>
	);
};

export default BlogItem;
