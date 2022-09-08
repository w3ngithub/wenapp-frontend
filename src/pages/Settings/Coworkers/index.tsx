import React, { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Col, Row, Divider } from "antd";
import SettingTable from "../CommonTable";
import {
	getInvitedUsers,
	inviteUsers
} from "services/settings/coworkers/inviteUser";
import { INVITED_EMPLOYEES_COLUMN, POSITION_COLUMN } from "constants/Settings";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";
import CommonModal from "../CommonModal";
import {
	addPosition,
	deletePosition,
	editPosition,
	getPosition
} from "services/settings/coworkers/positions";
import {
	addPositionTypes,
	deletePositionTypes,
	editPositionType,
	getPositionTypes
} from "services/settings/coworkers/positionType";
import {
	addRole,
	deleteRole,
	getRoles,
	updateRole
} from "services/settings/coworkers/roles";

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
	const [dataToEdit, setDataToEdit] = useState<any>({});

	const {
		data: positions,
		isFetching: isPositionsFetching,
		isLoading
	} = useQuery(["positions"], getPosition);
	const { data: invitedUsers, isFetching: isInviteUsersFetching } = useQuery(
		["inviteUsers"],
		getInvitedUsers
	);
	const { data: positionTypes, isFetching: isPositionTypesFetching } = useQuery(
		["positionTypes"],
		getPositionTypes
	);
	const { data: roles } = useQuery(["roles"], getRoles, {
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
				message: "Position type deletion failed!",
				type: "error"
			});
		}
	});

	const deleteRoleMutation = useMutation(deleteRole, {
		onSuccess: response =>
			handleResponse(
				response,
				"Role deleted successfully",
				"Role deletion failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["roles"])]
			),
		onError: error => {
			notification({
				message: "Role deletion failed!",
				type: "error"
			});
		}
	});
	const addRoleMutation = useMutation(addRole, {
		onSuccess: response =>
			handleResponse(response, "Role added successfully", "Role add failed", [
				handleCloseModal,
				() => queryClient.invalidateQueries(["roles"])
			]),
		onError: error => {
			notification({
				message: "Role add failed!",
				type: "error"
			});
		}
	});
	const editRoleMutation = useMutation(updateRole, {
		onSuccess: response =>
			handleResponse(
				response,
				"Role updated successfully",
				"Role update failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["roles"])]
			),
		onError: error => {
			notification({
				message: "Role update failed!",
				type: "error"
			});
		}
	});

	const editPositionMutation = useMutation(editPosition, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position updated successfully",
				"Position update failed",
				[handleCloseModal, () => queryClient.invalidateQueries(["positions"])]
			),
		onError: error => {
			notification({
				message: "Position update failed!",
				type: "error"
			});
		}
	});
	const editPositionTypeMutation = useMutation(editPositionType, {
		onSuccess: response =>
			handleResponse(
				response,
				"Position Type updated successfully",
				"Position Type update failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["positionTypes"])
				]
			),
		onError: error => {
			notification({
				message: "Position Type update failed!",
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

		if (type === types.ROLE)
			addRoleMutation.mutate({ value: input, key: input.toLowerCase() });
	};

	const handleEditClick = (input: any) => {
		if (type === types.POSITION)
			editPositionMutation.mutate({ id: dataToEdit?._id, name: input });

		if (type === types.POSITION_TYPE)
			editPositionTypeMutation.mutate({ id: dataToEdit?._id, name: input });

		if (type === types.ROLE)
			editRoleMutation.mutate({ id: dataToEdit?._id, value: input });
	};

	const handleDeleteClick = (data: any, type: string) => {
		if (type === types.POSITION)
			deletePositionMutation.mutate({
				id: data._id
			});

		if (type === types.POSITION_TYPE)
			deletePositionTypeMutation.mutate({ id: data._id });

		if (type === types.ROLE) deleteRoleMutation.mutate({ id: data._id });
	};

	const handleOpenEditModal = (data: any, type: string) => {
		setIsEditMode(true);
		setType(type);
		setOpenModal(true);
		setDataToEdit(data);
	};

	const handleCloseModal = () => {
		setIsEditMode(false);

		setDataToEdit({});
		setOpenModal(false);
	};
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
				editData={dataToEdit}
				isLoading={
					addPositionMutation.isLoading ||
					addPositionTypeMutation.isLoading ||
					addRoleMutation.isLoading ||
					editPositionMutation.isLoading ||
					editRoleMutation.isLoading ||
					editPositionTypeMutation.isLoading
				}
				onSubmit={isEditMode ? handleEditClick : handleAddClick}
				onCancel={handleCloseModal}
			/>
			<Row>
				<Col span={6} xs={24} md={12} style={{ paddingLeft: 0 }}>
					<Card title="Invite A Co-worker">
						<Form
							{...layout}
							form={form}
							name="control-hooks"
							layout="vertical"
						>
							<div className="gx-d-flex gx-justify-content-between margin-1r">
								<Form.Item
									name="email"
									label="Email"
									rules={[{ required: true, message: "Required!" }]}
									help="To invite multiple email, separate the emails using comma."
									style={{ flex: "70%" }}
								>
									<Input
										placeholder="Email address"
										onChange={handleEmailChange}
									/>
								</Form.Item>
								<Form.Item style={{ flex: "0.2" }}>
									<Button
										key="submit"
										type="primary"
										style={{ marginTop: "20px" }}
										onClick={handleInviteSubmit}
									>
										Invite
									</Button>
								</Form.Item>
							</div>
						</Form>
						<SettingTable
							data={invitedUsers?.data?.data?.data}
							isLoading={isLoading || isInviteUsersFetching}
							columns={INVITED_EMPLOYEES_COLUMN()}
							hideAddButton
						/>
					</Card>
				</Col>

				<Col span={6} xs={24} md={12} style={{ paddingLeft: 0 }}>
					<Card
						title="Position"
						extra={
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={() => handleOpenModal("Position Type")}
							>
								Add
							</Button>
						}
					>
						<SettingTable
							data={positions?.data?.data?.data}
							columns={POSITION_COLUMN(
								value => handleDeleteClick(value, types.POSITION),
								value => handleOpenEditModal(value, types.POSITION)
							)}
							onAddClick={() => handleOpenModal(types.POSITION)}
							isLoading={
								isLoading ||
								isPositionsFetching ||
								deletePositionMutation.isLoading
							}
						/>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col span={6} xs={24} md={12} style={{ paddingLeft: 0 }}>
					<Card
						title="Position Type"
						extra={
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={() => handleOpenModal("Position Type")}
							>
								Add
							</Button>
						}
					>
						<SettingTable
							data={positionTypes?.data?.data?.data}
							columns={POSITION_COLUMN(
								value => handleDeleteClick(value, types.POSITION_TYPE),
								value => handleOpenEditModal(value, types.POSITION_TYPE)
							)}
							isLoading={
								isLoading ||
								isPositionTypesFetching ||
								deletePositionTypeMutation.isLoading
							}
							onAddClick={() => handleOpenModal("Position Type")}
						/>
					</Card>
				</Col>
				<Col span={6} xs={24} md={12} style={{ paddingLeft: 0 }}>
					<Card
						title="Role"
						extra={
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={() => handleOpenModal("Role")}
							>
								Add
							</Button>
						}
					>
						<SettingTable
							data={roles}
							columns={POSITION_COLUMN(
								value => handleDeleteClick(value, types.ROLE),
								value => handleOpenEditModal(value, types.ROLE)
							)}
							isLoading={deleteRoleMutation.isLoading || isLoading}
							onAddClick={() => handleOpenModal("Role")}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default Coworkers;
