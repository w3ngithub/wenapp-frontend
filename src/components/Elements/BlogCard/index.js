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
	const imgSrc = content?.split("src=")[1]?.split(" ")[0];
	const src = "https://firebasestorage.googleapis.com/v0/b/shop-and-mall.appspot.com/o/blogs%2FReebok3.jpg?alt=media&token=07093ef2-c6d5-484f-9d43-e2df3a1f06da"

	return (
		<div
			className={`gx-product-item  ${
				grid ? "gx-product-vertical" : "gx-product-horizontal"
			}`}
		>
		
			{imgSrc && (
				<div className="gx-product-image">
					<div className="gx-grid-thumb-equal">
						<span className="gx-link gx-grid-thumb-cover">
							<img alt="Bob" src={src} />
						</span>
					</div>
				</div>
			)}
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
			<div className="gx-footer"></div>
		</div>
	);
};

export default BlogItem;
