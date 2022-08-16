import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Input, Select, Spin } from "antd";
import {
	convertToRaw,
	EditorState,
	ContentState,
	convertFromHTML
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { CameraOutlined, RollbackOutlined } from "@ant-design/icons";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBlog, getBlog, getBlogCatogories, updateBlog } from "services/blog";
import { filterOptions, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BLOG } from "helpers/routePath";
import AddMediaModel from "components/Modules/AddMediaModal";
import CircularProgress from "components/Elements/CircularProgress/index";

function AddBlog() {
	// init state

	const [editorState, seteditorState] = useState(EditorState.createEmpty());
	const [submitting, setSubmitting] = useState(false);
	const [openMedia, setopenMedia] = useState(false);

	// init hooks
	const navigate = useNavigate();
	const { blogId } = useParams();

	const blogRef = useRef(true);

	const bid = blogId?.split("-")[0];

	const { data, isLoading, refetch } = useQuery(
		["singleBlog", bid],
		() => getBlog(bid),
		{
			enabled: false
		}
	);

	const { data: catogories } = useQuery(["blogCatogories"], () =>
		getBlogCatogories()
	);

	const addBlogMutation = useMutation(details => addBlog(details), {
		onSuccess: response =>
			handleResponse(
				response,
				"Added Blog successfully",
				"Could not add Blog",
				[
					() => {
						navigate(`/${BLOG}`);
					}
				]
			),

		onError: () =>
			notification({
				message: "Could not add Bog!",
				type: "error"
			}),
		onSettled: () => {
			setSubmitting(false);
		}
	});

	const updateBlogMutation = useMutation(details => updateBlog(bid, details), {
		onSuccess: response =>
			handleResponse(
				response,
				"Updated Blog successfully",
				"Could not update Blog",
				[
					() => {
						navigate(`/${BLOG}`);
					}
				]
			),

		onError: () =>
			notification({
				message: "Could not update Bog!",
				type: "error"
			}),
		onSettled: () => {
			setSubmitting(false);
		}
	});

	useEffect(() => {
		if (bid) {
			refetch();
		}
	}, [bid, refetch]);

	useEffect(() => {
		if (bid && data && blogRef.current) {
			const blocksFromHTML = convertFromHTML(
				data?.data?.data?.data?.[0]?.content
			);
			const state = ContentState.createFromBlockArray(
				blocksFromHTML.contentBlocks,
				blocksFromHTML.entityMap
			);

			const initialState = blocksFromHTML
				? EditorState.createWithContent(state)
				: EditorState.createEmpty();
			seteditorState(initialState);
			blogRef.current = false;
		}
	}, [bid, data]);

	const onEditorStateChange = editorStates => {
		seteditorState(editorStates);
	};

	const submitBlog = formData => {
		if (draftToHtml(convertToRaw(editorState.getCurrentContent())).length < 9) {
			notification({
				message: "Content Must be at least 10 characters",
				type: "error"
			});
			return;
		}
		setSubmitting(true);
		if (bid) {
			updateBlogMutation.mutate({
				...formData,
				content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
			});
		} else {
			addBlogMutation.mutate({
				...formData,
				content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
			});
		}
	};

	const handleCanelMedia = () => {
		setopenMedia(false);
	};

	const handleInsertMedia = files => {
		console.log(files);
		seteditorState(prev => prev.concat("hello"));
		handleCanelMedia();
	};

	if (isLoading && bid) {
		return <CircularProgress />;
	}

	return (
		<div>
			<Card
				title={
					<div>
						<Link to={`/${BLOG}`}>
							<RollbackOutlined />
						</Link>
						<span className="gx-ml-2">{bid ? "Update Blog" : "Add Blog"}</span>
					</div>
				}
			>
				<Spin spinning={submitting}>
					<Form
						layout="vertical"
						onFinish={submitBlog}
						initialValues={{
							title: data?.data?.data?.data?.[0].title || "",
							blogCategories:
								data?.data?.data?.data?.[0].blogCategories.map(x => x._id) ||
								undefined
						}}
					>
						<Form.Item
							name="title"
							label="Title"
							rules={[{ required: true, message: "Title is Required!" }]}
							hasFeedback
						>
							<Input />
						</Form.Item>
						<Form.Item name="content" label="Content">
							<>
								<Button
									type="primary"
									htmlType="button"
									icon={<CameraOutlined />}
									onClick={() => {
										setopenMedia(true);
									}}
								>
									Add Media
								</Button>
								<Editor
									editorStyle={{
										width: "100%",
										minHeight: 500,
										borderWidth: 1,
										borderStyle: "solid",
										borderColor: "lightgray"
									}}
									editorState={editorState}
									wrapperClassName="demo-wrapper"
									onEditorStateChange={onEditorStateChange}
								/>
							</>
						</Form.Item>

						<Form.Item name="blogCategories" label="Catogories">
							<Select
								showSearch
								filterOption={filterOptions}
								placeholder="Select Tags"
								mode="tags"
								size="large"
							>
								{catogories?.data?.data?.data?.map(tag => (
									<Select.Option value={tag._id} key={tag._id}>
										{tag.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Publish
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</Card>

			<AddMediaModel
				toogle={openMedia}
				handleCancel={handleCanelMedia}
				handleSubmit={handleInsertMedia}
			/>
		</div>
	);
}

export default AddBlog;
