import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Form, Input, Button, Pagination, Spin, Col, Row } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { notification } from "helpers/notification";
import { deleteBlog, getAllBlogs } from "services/blog";
import BlogItem from "components/Elements/BlogCard";
import { getAllUsers } from "services/users/userDetails";
import Select from "components/Elements/Select";
import { useNavigate } from "react-router-dom";
import { ADDBLOG } from "helpers/routePath";
import { handleResponse } from "helpers/utils";
import useWindowsSize from "hooks/useWindowsSize";

const Search = Input.Search;
const FormItem = Form.Item;

function Blogs() {
	// init state
	const [title, setTitle] = useState("");
	const [user, setUser] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });

	// init hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { innerWidth } = useWindowsSize();
	const [form] = Form.useForm();

	const [typedTitle, setTypedTitle] = useState("");
	const userData = JSON.parse(localStorage.getItem("user_id") || {});

	const { data, isLoading, isError, isFetching } = useQuery(
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

	const deleteBlogMutation = useMutation(blog => deleteBlog(blog), {
		onSuccess: response =>
			handleResponse(
				response,
				"Blog removed Successfully",
				"Blog deletion failed",
				[() => queryClient.invalidateQueries(["blogs"])]
			),
		onError: error => {
			notification({ message: "Project deletion failed", type: "error" });
		}
	});

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
		setTypedTitle("");
		setTitle("");
		setUser(undefined);
	};

	const handleUserChange = user => {
		setUser(user);
	};

	const removeBlog = blog => {
		deleteBlogMutation.mutate(blog);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div className="ant-row" style={{ rowGap: 0 }}>
			<Card title="Blogs">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row ">
						<Form layout="inline" form={form}>
							<FormItem>
								<Search
									placeholder="Search Blogs"
									onSearch={value => {
										setPage(prev => ({ ...prev, page: 1 }));
										setTitle(value);
									}}
									value={typedTitle}
									allowClear
									onChange={e => setTypedTitle(e.target.value)}
									enterButton
								/>
							</FormItem>
							<FormItem className="direct-form-item">
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

							<FormItem style={{ marginBottom: "2px" }}>
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
				<Spin spinning={isFetching}>
					<Row align="top">
						{data?.data?.data?.data?.map(blog => (
							<Col xl={8} md={12} sm={18} xs={24}>
								<BlogItem
									key={blog._id}
									grid={true}
									blog={blog}
									removeBlog={removeBlog}
									access={userData?.user?._id === blog.createdBy._id}
								/>
							</Col>
						))}
					</Row>

					<Pagination
						total={data?.data?.data?.count || 1}
						current={page.page}
						pageSize={page.limit}
						pageSizeOptions={["5", "10", "20", "50"]}
						showSizeChanger={true}
						onShowSizeChange={onShowSizeChange}
						onChange={handlePageChange}
					/>
				</Spin>
			</Card>
		</div>
	);
}

export default Blogs;
