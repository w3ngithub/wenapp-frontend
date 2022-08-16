import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog } from "services/blog";
import { useQuery } from "@tanstack/react-query";
import BlogsBreadCumb from "./BlogsBreadCumb";
import CircularProgress from "components/Elements/CircularProgress";
import { Button, Card } from "antd";

function Detail() {
	// init hooks
	const { blog } = useParams();
	const navigate = useNavigate();

	const [blogId] = blog.split("-");

	const { data, isLoading } = useQuery(["singleBlog", blogId], () =>
		getBlog(blogId)
	);

	const BLOG = data?.data?.data?.data?.[0];

	const handleEdit = () => {
		navigate(`/blog/edit-blog/${blog}`);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<BlogsBreadCumb slug={BLOG?.title} />
			<div style={{ marginTop: 20 }}></div>
			<Card title="Details">
				<Button type="primary" onClick={handleEdit}>
					Edit
				</Button>
			</Card>
		</div>
	);
}

export default Detail;
