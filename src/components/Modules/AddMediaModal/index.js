import { Button, Modal, Spin } from "antd";
import React, { useState } from "react";
import UploadFiles from "./UploadFiles";

function AddMediaModel({ toogle, handleSubmit, handleCancel, loading }) {
	const [files, setFiles] = useState([]);

	const handleInsert = () => {
		handleSubmit(files);
	};
	return (
		<Modal
			width={900}
			title={"Add Media"}
			visible={toogle}
			onOk={handleSubmit}
			onCancel={handleCancel}
			footer={[
				<Button key="back" onClick={handleCancel}>
					Cancel
				</Button>,
				<Button
					key="submit"
					type="primary"
					onClick={handleInsert}
					disabled={loading}
				>
					Insert
				</Button>
			]}
		>
			<Spin spinning={loading}>
				<UploadFiles
					handleSubmit={handleSubmit}
					files={files}
					setFiles={setFiles}
				/>
			</Spin>
		</Modal>
	);
}

export default AddMediaModel;
