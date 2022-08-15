import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Form, Input, Button, Pagination } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { notification } from "helpers/notification";
import { getAllBlogs } from "services/blog";
import BlogItem from "components/Elements/BlogCard";
import { getAllUsers } from "services/users/userDetails";
import Select from "components/Elements/Select";
import { useNavigate } from "react-router-dom";
import { ADDBLOG } from "helpers/routePath";

const Search = Input.Search;
const FormItem = Form.Item;

function Blogs() {
	// init state
	const [title, setTitle] = useState("");
	const [user, setUser] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });

	// init hooks
	const navigate = useNavigate();

	const blogRef = useRef("");

	const { data, isLoading, isError } = useQuery(
		["blogs", page, title, user],
		() =>
			getAllBlogs({
				...page,
				title,
				createdBy: user
			}),
		{ keepPreviousData: true }
	);

	const { data: users } = useQuery(
		["users"],
		() => getAllUsers({ fields: "_id,name" }),
		{
			keepPreviousData: true
		}
	);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Blogs!", type: "error" });
		}
	}, [isError]);

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handleResetFilter = () => {
		setTitle("");
		setUser(undefined);
		blogRef.current.input.value = "";
	};

	const handleUserChange = user => {
		setUser(user);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<Card title="Blogs">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline">
							<FormItem>
								<Search
									placeholder="Search Blogs"
									onSearch={value => {
										setPage(prev => ({ ...prev, page: 1 }));
										setTitle(value);
									}}
									style={{ width: 600 }}
									enterButton
									ref={blogRef}
								/>
							</FormItem>
							<FormItem>
								<Select
									placeholder="Select Author"
									onChange={handleUserChange}
									value={user}
									options={users?.data?.data?.data.map(x => ({
										id: x._id,
										value: x.name
									}))}
								/>
							</FormItem>

							<FormItem>
								<Button
									className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
									onClick={handleResetFilter}
								>
									Reset
								</Button>
							</FormItem>
						</Form>
						<Button
							className="gx-btn gx-btn-primary gx-text-white "
							onClick={() => {
								navigate(`${ADDBLOG}`);
							}}
						>
							Add New Blog
						</Button>
					</div>
				</div>
				{data?.data?.data?.data?.map(blog => (
					<BlogItem key={blog._id} blog={blog} />
				))}

				<Pagination
					total={data?.data?.data?.count || 1}
					current={page.page}
					pageSize={page.limit}
					pageSizeOptions={["5", "10", "20", "50"]}
					showSizeChanger={true}
					onShowSizeChange={onShowSizeChange}
					hideOnSinglePage={true}
					onChange={handlePageChange}
				/>
			</Card>
		</div>
	);
}

export default Blogs;
