import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Input, Button, DatePicker } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { handleResponse } from "helpers/utils";
import { addProject, deleteProject, updateProject } from "services/projects";
import ProjectModal from "components/Modules/ProjectModal";
import moment from "moment";
import { notification } from "helpers/notification";
import { getAllNotices } from "services/noticeboard";
import { NOTICE_COLUMNS } from "constants/Notice";

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;

const formattedNotices = notices => {
	return notices?.map(notice => ({
		...notice,
		key: notice._id,
		category: notice.noticeType.name
	}));
};

function NoticeBoardPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [userRecord, setUserRecord] = useState({});
	const [readOnly, setReadOnly] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	const queryClient = useQueryClient();

	const noticeRef = useRef("");

	const { data, isLoading, isError, isFetching } = useQuery(
		["notices", page, title],
		() =>
			getAllNotices({
				...page,
				title
			}),
		{ keepPreviousData: true }
	);

	const addNoticeMutation = useMutation(notice => addProject(notice), {
		onSuccess: response =>
			handleResponse(
				response,
				"Notice Added Successfully",
				"Notice addition failed",
				[
					() => queryClient.invalidateQueries(["notices"]),
					() => handleCloseModal()
				]
			),
		onError: error => {
			notification({ message: "Notice addition failed!", type: "error" });
		}
	});
	const updateNoticeMutation = useMutation(
		notice => updateProject(notice.id, notice.details),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Notice Updated Successfully",
					"Notice update failed",
					[
						() => queryClient.invalidateQueries(["notices"]),
						() => handleCloseModal()
					]
				),
			onError: error => {
				notification({ message: "Notice update failed", type: "error" });
			}
		}
	);

	const deleteNoticeMutation = useMutation(
		noticeId => deleteProject(noticeId),
		{
			onSuccess: response =>
				handleResponse(
					response,
					"Notice removed Successfully",
					"Notice deletion failed",
					[() => queryClient.invalidateQueries(["notices"])]
				),
			onError: error => {
				notification({ message: "Notice deletion failed", type: "error" });
			}
		}
	);

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Notices!", type: "error" });
		}
	}, [isError]);

	const handleUserDetailSubmit = (project, reset) => {
		try {
			const updatedProject = {
				...project,
				estimatedHours: project.estimatedHours
					? +project.estimatedHours
					: undefined,
				startDate: project.startDate
					? moment.utc(project.startDate).format()
					: undefined,
				endDate: project.endDate
					? moment.utc(project.endDate).format()
					: undefined
			};
			if (isEditMode)
				updateNoticeMutation.mutate({
					id: userRecord.id,
					details: updatedProject
				});
			else addNoticeMutation.mutate(updatedProject);
			reset.form.resetFields();
		} catch (error) {
			notification({ message: "Project Addition Failed", type: "error" });
		}
	};

	const handleOpenEditModal = (projectToUpdate, mode) => {
		const originalProject = data?.data?.data?.data?.find(
			project => project.id === projectToUpdate.id
		);
		setOpenUserDetailModal(prev => !prev);
		setUserRecord({
			id: projectToUpdate.id,
			project: {
				...projectToUpdate,
				projectStatus: originalProject?.projectStatus,
				projectTypes: originalProject?.projectTypes,
				startDate: originalProject.startDate ?? null,
				endDate: originalProject.endDate ?? null
			}
		});
		setReadOnly(mode);
		setIsEditMode(true);
	};

	const handleOpenAddModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleCloseModal = () => {
		setOpenUserDetailModal(prev => !prev);
		setUserRecord({});
		setIsEditMode(false);
	};

	const handleChangeDate = date => {
		setDate(date);
	};

	const handleTableChange = (pagination, filters, sorter) => {
		setSort(sorter);
	};

	const handlePageChange = pageNumber => {
		setPage(prev => ({ ...prev, page: pageNumber }));
	};

	const onShowSizeChange = (_, pageSize) => {
		setPage(prev => ({ ...page, limit: pageSize }));
	};

	const handleResetFilter = () => {
		setTitle("");
		noticeRef.current.input.state.value = "";
	};

	const confirmDeleteProject = notice => {
		deleteNoticeMutation.mutate(notice._id);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<ProjectModal
				toggle={openUserDetailModal}
				onClose={handleCloseModal}
				onSubmit={handleUserDetailSubmit}
				loading={addNoticeMutation.isLoading || updateNoticeMutation.isLoading}
				initialValues={userRecord.project}
				readOnly={readOnly}
				isEditMode={isEditMode}
			/>

			<Card title="Notice Board">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline">
							<FormItem>
								<Search
									placeholder="Search Notices"
									onSearch={value => {
										setPage(prev => ({ ...prev, page: 1 }));
										setTitle(value);
									}}
									style={{ width: 200 }}
									enterButton
									ref={noticeRef}
								/>
								<FormItem>
									<RangePicker
										onChange={handleChangeDate}
										value={date}
										style={{ width: "240px" }}
									/>
								</FormItem>
							</FormItem>
							<FormItem>
								<Button
									className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
									onClick={handleResetFilter}
								>
									Reset
								</Button>
							</FormItem>
						</Form>
						<Button
							className="gx-btn gx-btn-primary gx-text-white "
							onClick={handleOpenAddModal}
						>
							Add New Notice
						</Button>
					</div>
				</div>
				<Table
					className="gx-table-responsive"
					columns={NOTICE_COLUMNS(
						sort,
						handleOpenEditModal,
						confirmDeleteProject
					)}
					dataSource={formattedNotices(data?.data?.data?.data)}
					onChange={handleTableChange}
					pagination={{
						current: page.page,
						pageSize: page.limit,
						pageSizeOptions: ["5", "10", "20", "50"],
						showSizeChanger: true,
						total: data?.data?.data?.count || 1,
						onShowSizeChange,
						hideOnSinglePage: true,
						onChange: handlePageChange
					}}
					loading={isLoading || isFetching || deleteNoticeMutation.isLoading}
				/>
			</Card>
		</div>
	);
}

export default NoticeBoardPage;
