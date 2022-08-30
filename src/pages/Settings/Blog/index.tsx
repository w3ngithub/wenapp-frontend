import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "antd";
import SettingTable from "../CommonTable";
import { POSITION_COLUMN } from "constants/Settings";
import {
	addBlogCategory,
	deleteBlogCategory,
	editBlogCategory,
	getBlogCategories
} from "services/settings/blog";
import CommonModal from "../CommonModal";
import { handleResponse } from "helpers/utils";
import { notification } from "helpers/notification";

function Blog() {
	const queryClient = useQueryClient();
	const [type, setType] = useState("");

	const [openModal, setOpenModal] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [dataToEdit, setDataToEdit] = useState<any>({});
	const { data: blogCategories }: { data: any } = useQuery(
		["blogCategories"],
		getBlogCategories
	);
	const addBlogCategoryMutation = useMutation(addBlogCategory, {
		onSuccess: response =>
			handleResponse(
				response,
				"Blog Category added successfully",
				"Blog Category add failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["blogCategories"])
				]
			),
		onError: error => {
			notification({
				message: "Blog Category add failed!",
				type: "error"
			});
		}
	});
	const deleteBlogCategoryMutation = useMutation(deleteBlogCategory, {
		onSuccess: response =>
			handleResponse(
				response,
				"Blog Category deleted successfully",
				"Blog Category deletion failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["blogCategories"])
				]
			),
		onError: error => {
			notification({
				message: "Blog Category deletion failed!",
				type: "error"
			});
		}
	});

	const editBlogCategoryMutation = useMutation(editBlogCategory, {
		onSuccess: response =>
			handleResponse(
				response,
				"Blog Category updated successfully",
				"Blog Category update failed",
				[
					handleCloseModal,
					() => queryClient.invalidateQueries(["blogCategories"])
				]
			),
		onError: error => {
			notification({
				message: "Blog Category update failed!",
				type: "error"
			});
		}
	});

	const handleAddClick = (input: string) => {
		addBlogCategoryMutation.mutate({ name: input });
	};

	const handleEditClick = (input: any) => {
		editBlogCategoryMutation.mutate({ id: dataToEdit?._id, name: input });
	};

	const handleDeleteClick = (data: any, type: string) => {
		deleteBlogCategoryMutation.mutate({ id: data._id });
	};

	const handleOpenEditModal = (data: any, type: string) => {
		setType(type);

		setIsEditMode(true);
		setOpenModal(true);
		setDataToEdit(data);
	};

	const handleCloseModal = () => {
		setIsEditMode(false);

		setDataToEdit({});
		setOpenModal(false);
	};
	const handleOpenModal = (type: string) => {
		setType(type);

		setOpenModal(true);
	};

	return (
		<>
			<CommonModal
				toggle={openModal}
				type={type}
				isEditMode={isEditMode}
				editData={dataToEdit}
				isLoading={
					addBlogCategoryMutation.isLoading ||
					editBlogCategoryMutation.isLoading
				}
				onSubmit={isEditMode ? handleEditClick : handleAddClick}
				onCancel={handleCloseModal}
			/>
			<Card title="Category">
				<SettingTable
					data={blogCategories?.data?.data?.data}
					columns={POSITION_COLUMN(
						value => handleDeleteClick(value, "Category"),
						value => handleOpenEditModal(value, "Category")
					)}
					onAddClick={() => handleOpenModal("Category")}
					isLoading={deleteBlogCategoryMutation.isLoading}
				/>
			</Card>
		</>
	);
}

export default Blog;
