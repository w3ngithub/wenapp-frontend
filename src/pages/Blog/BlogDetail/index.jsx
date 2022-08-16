import React from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "services/blog";
import { useQuery } from "@tanstack/react-query";
import BlogsBreadCumb from "./BlogsBreadCumb";
import CircularProgress from "components/Elements/CircularProgress";

function Detail() {
	// init hooks
	const { blog } = useParams();

	const [blogId] = blog.split("-");

	const { data, isLoading } = useQuery(["singleBlog", blogId], () =>
		getBlog(blogId)
	);

	const BLOG = data?.data?.data?.data?.[0];

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<BlogsBreadCumb slug={BLOG?.title} />
		</div>
	);
}

export default Detail;
