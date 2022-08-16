import { Button, Modal } from "antd";
import React, { useState } from "react";
import UploadFiles from "./UploadFiles";

function AddMediaModel({ toogle, handleSubmit, handleCancel }) {
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
				<Button key="submit" type="primary" onClick={handleInsert}>
					Insert
				</Button>
			]}
		>
			<UploadFiles
				handleSubmit={handleSubmit}
				files={files}
				setFiles={setFiles}
			/>
		</Modal>
	);
}

export default AddMediaModel;
