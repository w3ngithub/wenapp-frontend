import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Modal } from "antd";

const Dragger = Upload.Dragger;

const getBase64 = file =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});

/*
Props Types
{
        files:[],
        setFiles:setState,
        displayType:'text' | 'picture' | 'picture-card',
        allowMultiple:boolean
} */
function DragAndDropFile({
	files,
	setFiles,
	displayType = "text",
	allowMultiple = true,
	accept = ""
}) {
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");

	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
	};

	const handleChange = info => {
		let fileList = [...info.fileList];
		if (allowMultiple) setFiles(fileList);
		else {
			const list = fileList[fileList.length - 1]
				? [fileList[fileList.length - 1]]
				: [];
			setFiles(list);
		}
	};
	const handleCancel = () => setPreviewVisible(false);
	return (
		<>
			<Dragger
				beforeUpload={file => false}
				listType={displayType}
				onPreview={
					(displayType === "picture-card" || displayType === "picture") &&
					handlePreview
				}
				fileList={files}
				onChange={handleChange}
				accept={accept}
			>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
			</Dragger>
			<Modal
				visible={previewVisible}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<img alt="example" style={{ width: "100%" }} src={previewImage} />
			</Modal>
		</>
	);
}

export default DragAndDropFile;
