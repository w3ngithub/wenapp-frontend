import React from "react";
import { Button, Modal, Spin } from "antd";
import DragAndDropFile from "components/Modules/DragAndDropFile";

function ImportUsers({
	toggle,
	onSubmit,
	onClose,
	loading = false,
	files,
	setFiles
}) {
	const handleCancel = () => {
		onClose();
	};

	const handleSubmit = () => {};

	return (
		<Modal
			title={"Import Users"}
			visible={toggle}
			onOk={handleSubmit}
			onCancel={handleCancel}
			footer={[
				<Button key="back" onClick={handleCancel}>
					Cancel
				</Button>,
				<Button key="submit" type="primary" onClick={handleSubmit}>
					Import
				</Button>
			]}
		>
			<Spin spinning={loading}>
				<DragAndDropFile
					allowMultiple={false}
					files={files}
					setFiles={setFiles}
				/>
			</Spin>
		</Modal>
	);
}
export default ImportUsers;
