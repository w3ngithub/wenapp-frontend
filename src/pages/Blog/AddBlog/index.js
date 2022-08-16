import React, { useState } from "react";
import { Button, Card, Form, Input, Select, Spin } from "antd";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBlog, getBlogCatogories } from "services/blog";
import { filterOptions, handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import { useNavigate } from "react-router-dom";
import { BLOG } from "helpers/routePath";

function AddBlog() {
	// init state
	const [editorState, seteditorState] = useState(EditorState.createEmpty());
	const [submitting, setSubmitting] = useState(false);

	// init hooks
	const navigate = useNavigate();
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

	const onEditorStateChange = editorStates => {
		seteditorState(editorStates);
	};

	const submitBlog = formData => {
		setSubmitting(true);
		addBlogMutation.mutate({
			...formData,
			content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
		});
	};
	return (
		<div>
			<Card title="Add Blog">
				<Spin spinning={submitting}>
					<Form layout="vertical" onFinish={submitBlog}>
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
								<Editor
									editorStyle={{
										width: "100%",
										minHeight: 300,
										borderWidth: 1,
										borderStyle: "solid",
										borderColor: "lightgray"
									}}
									editorState={editorState}
									wrapperClassName="demo-wrapper"
									onEditorStateChange={onEditorStateChange}
								/>
								<textarea
									style={{ width: "100%", height: 200 }}
									disabled
									value={draftToHtml(
										convertToRaw(editorState.getCurrentContent())
									)}
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
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</Card>
		</div>
	);
}

export default AddBlog;
