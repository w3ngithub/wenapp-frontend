import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Spin } from "antd";
import DragAndDropFile from "components/Modules/DragAndDropFile";
import { importUsers } from "services/users/userDetails";
import { csvFileToArray } from "helpers/utils";

function ImportUsers({ toggle, onClose, files, setFiles }) {
	const fileReader = new FileReader();

	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const mutation = useMutation(usersToImport => importUsers(usersToImport), {
		onSuccess: () => {
			queryClient.invalidateQueries(["users"]);
			setLoading(false);
			handleCancel();
		},
		onError: () => {
			setLoading(false);
		}
	});
	const handleCancel = () => {
		onClose();
		setFiles([]);
	};

	const handleSubmit = () => {
		try {
			setLoading(true);
			const file = files[0]?.originFileObj;
			if (file) {
				fileReader.onload = function(event) {
					const csvOutput = csvFileToArray(event.target.result);
					mutation.mutate(csvOutput);
				};

				fileReader.readAsText(file);
			}
		} catch (error) {
			console.log(error);
		}
	};

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
