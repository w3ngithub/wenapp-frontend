import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input } from "antd";
import SettingTable from "../CommonTable";
import { getRoles, inviteUsers } from "services/settings";
import { INVITED_EMPLOYEES_COLUMN, POSITION_COLUMN } from "constants/Settings";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import CommonModal from "../CommonModal";
import {
	addPosition,
	deletePosition,
	getPosition
} from "services/settings/positions";
import {
	addPositionTypes,
	deletePositionTypes,
	getPositionTypes
} from "services/settings/positionType";

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

const types = {
	POSITION: "Position",
	POSITION_TYPE: "Position Type",
	ROLE: "Role"
};

function Coworkers() {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	const [email, setEmail] = useState("");
	const [type, setType] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	const { data: positions, isFetching: isPositionsFetching }: any = useQuery(
		["positions"],
		getPosition
	);
	const {
		data: positionTypes,
		isFetching: isPositionTypesFetching
	}: any = useQuery(["positionTypes"], getPositionTypes);
	const { data: roles }: { data: any } = useQuery(["roles"], getRoles, {
		onError: err => console.log(err),
		select: res =>
			res?.data?.data?.data?.map(
				(role: { key: string; value: string; _id: string }) => ({
					...role,
					key: role._id,
					name: role?.value
				})
			)
	});

	const inviteUserMutation = useMutation(inviteUsers, {
		onSuccess: response =>
			handleResponse(
				response,
				"User invited successfully",
				"User invite failed",
				[() => setEmail("")]
			),
		onError: error => {
			notification({ message: "User invite failed!", type: "error" });
		}
	});

	const addPositionMutation = useMutation(addPosition, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position added successfully",
				"Position add failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["positions"])]
			),
		onError: error => {
			notification({
				message: "Position add failed!",
				type: "error"
			});
		}
	});
	const deletePositionMutation = useMutation(deletePosition, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position deleted successfully",
				"Position deletion failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["positions"])]
			),
		onError: error => {
			notification({
				message: "Position deletion failed!",
				type: "error"
			});
		}
	});

	const addPositionTypeMutation = useMutation(addPositionTypes, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position type added successfully",
				"Position type add failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["positionTypes"])
				]
			),
		onError: error => {
			notification({
				message: "Position type add failed!",
				type: "error"
			});
		}
	});
	const deletePositionTypeMutation = useMutation(deletePositionTypes, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position type deleted successfully",
				"Position type deletion failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["positionTypes"])
				]
			),
		onError: error => {
			notification({
				message: "Position  typedeletion failed!",
				type: "error"
			});
		}
	});

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleAddClick = (input: string) => {
		if (type === types.POSITION) addPositionMutation.mutate({ name: input });

		if (type === types.POSITION_TYPE)
			addPositionTypeMutation.mutate({ name: input });
	};

	const handleDeleteClick = (data: any, type: string) => {
		if (type === types.POSITION)
			deletePositionMutation.mutate({
				id: data._id
			});

		if (type === types.POSITION_TYPE)
			deletePositionTypeMutation.mutate({ id: data._id });
	};

	const handleEditClick = () => {};

	const handleCloseModal = () => setOpenModal(false);
	const handleOpenModal = (type: string) => {
		setOpenModal(true);
		setType(type);
	};

	const handleInviteSubmit = () => {
		form.validateFields().then(() => inviteUserMutation.mutate({ email }));
	};

	return (
		<>
			<CommonModal
				toggle={openModal}
				type={type}
				isEditMode={isEditMode}
				isLoading={
					addPositionMutation.isLoading || addPositionTypeMutation.isLoading
				}
				onSubmit={handleAddClick}
				onCancel={handleCloseModal}
			/>
			<Card title="Invite An Employee">
				<Form {...layout} form={form} name="control-hooks" layout="vertical">
					<Form.Item
						name="email"
						label="Email"
						rules={[{ required: true, message: "Required!" }]}
						help="To invite multiple email, separate the emails using comma."
					>
						<Input placeholder="Email address" onChange={handleEmailChange} />
					</Form.Item>
					<Form.Item>
						<Button
							key="submit"
							type="primary"
							style={{ marginTop: "20px" }}
							onClick={handleInviteSubmit}
						>
							Invite
						</Button>
					</Form.Item>
				</Form>
				<SettingTable
					data={[]}
					columns={INVITED_EMPLOYEES_COLUMN(
						() => handleDeleteClick("", ""),
						handleEditClick
					)}
				/>
			</Card>
			<Card title="Position">
				<SettingTable
					data={positions?.data?.data?.data}
					columns={POSITION_COLUMN(
						value => handleDeleteClick(value, types.POSITION),
						handleEditClick
					)}
					onAddClick={() => handleOpenModal(types.POSITION)}
					isLoading={isPositionsFetching || deletePositionMutation.isLoading}
				/>
			</Card>
			<Card title="Position Type">
				<SettingTable
					data={positionTypes?.data?.data?.data}
					columns={POSITION_COLUMN(
						value => handleDeleteClick(value, types.POSITION_TYPE),
						handleEditClick
					)}
					isLoading={
						isPositionTypesFetching || deletePositionTypeMutation.isLoading
					}
					onAddClick={() => handleOpenModal("Position Type")}
				/>
			</Card>
			<Card title="Role">
				<SettingTable
					data={roles}
					columns={POSITION_COLUMN(
						() => handleDeleteClick("", ""),
						handleEditClick
					)}
					onAddClick={() => handleOpenModal("Position Type")}
				/>
			</Card>
		</>
	);
}

export default Coworkers;
