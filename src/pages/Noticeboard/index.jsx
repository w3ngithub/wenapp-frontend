import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Form, Input, Button } from "antd";
import CircularProgress from "components/Elements/CircularProgress";
import { changeDate, handleResponse } from "helpers/utils";
import moment from "moment";
import { notification } from "helpers/notification";
import {
	addNotice,
	deleteNotice,
	getAllNotices,
	updateNotice
} from "services/noticeboard";
import { NOTICE_COLUMNS } from "constants/Notice";
import NoticeBoardModal from "components/Modules/noticeboardModal";

const Search = Input.Search;
const FormItem = Form.Item;

const formattedNotices = notices => {
	return notices?.map(notice => ({
		...notice,
		key: notice._id,
		category: notice.noticeType.name,
		startDate: notice.startDate ? changeDate(notice.startDate) : "",
		endDate: notice.endDate ? changeDate(notice.endDate) : ""
	}));
};

function NoticeBoardPage() {
	// init hooks
	const [sort, setSort] = useState({});
	const [title, setTitle] = useState("");
	const [typedNotice, setTypedNotice] = useState('');
	const [date, setDate] = useState(undefined);
	const [page, setPage] = useState({ page: 1, limit: 10 });
	const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
	const [noticeRecord, setNoticeRecord] = useState({});
	const [readOnly, setReadOnly] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [form] = Form.useForm();

	const queryClient = useQueryClient();

	const { data, isLoading, isError, isFetching } = useQuery(
		["notices", page, title, date],
		() =>
			getAllNotices({
				...page,
				title,
				startDate: date?.[0] ? moment.utc(date[0]).format() : "",
				endDate: date?.[1] ? moment.utc(date[1]).format() : ""
			}),
		{ keepPreviousData: true }
	);

	const addNoticeMutation = useMutation(notice => addNotice(notice), {
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
		notice => updateNotice(notice.id, notice.details),
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

	const deleteNoticeMutation = useMutation(noticeId => deleteNotice(noticeId), {
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
	});

	useEffect(() => {
		if (isError) {
			notification({ message: "Could not load Notices!", type: "error" });
		}
	}, [isError]);

	const handleUserDetailSubmit = (project, reset) => {
		try {
			const updatedProject = {
				...project,
				startDate: project.startDate
					? moment.utc(project.startDate).format()
					: undefined,
				endDate: project.endDate
					? moment.utc(project.endDate).format()
					: undefined,
				startTime: project.startTime
					? moment.utc(project.startTime).format()
					: undefined,
				endTime: project.endTime
					? moment.utc(project.endTime).format()
					: undefined
			};
			if (isEditMode) {
				updateNoticeMutation.mutate({
					id: noticeRecord.id,
					details: updatedProject
				});
			} else addNoticeMutation.mutate(updatedProject);
			form.resetFields();
		} catch (error) {
			notification({ message: "Notice Addition Failed", type: "error" });
		}
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
		setDate(undefined);
		setTypedNotice('');
	};

	const confirmDeleteProject = notice => {
		deleteNoticeMutation.mutate(notice._id);
	};

	const handleOpenEditModal = (notice, mode) => {
		const originalProject = data?.data?.data?.data?.find(
			ntc => ntc._id === notice._id
		);

		setOpenUserDetailModal(prev => !prev);
		setNoticeRecord({
			id: notice._id,
			project: {
				...notice,
				startDate: originalProject?.startDate ?? null,
				endDate: originalProject?.endDate ?? null,
				startTime: originalProject?.startTime ?? null,
				endTime: originalProject?.endTime ?? null
			}
		});
		setReadOnly(mode);
		setIsEditMode(true);
	};

	const handleCloseModal = () => {
		setOpenUserDetailModal(prev => !prev);
		setNoticeRecord({});
		setIsEditMode(false);
		setReadOnly(false);
	};

	const handleOpenAddModal = () => {
		setOpenUserDetailModal(prev => !prev);
	};

	const handleChangeDate = date => {
		setDate(date);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<NoticeBoardModal
				toggle={openUserDetailModal}
				onClose={handleCloseModal}
				onSubmit={handleUserDetailSubmit}
				loading={addNoticeMutation.isLoading || updateNoticeMutation.isLoading}
				initialValues={noticeRecord.project}
				readOnly={readOnly}
				isEditMode={isEditMode}
			/>

			<Card title="Notice Board">
				<div className="components-table-demo-control-bar">
					<div className="gx-d-flex gx-justify-content-between gx-flex-row">
						<Form layout="inline" form={form}>
							<FormItem style={{ marginBottom: "-2px" }}>
								<Search
									allowClear
									placeholder="Search Notices"
									onSearch={value => {
										setPage(prev => ({ ...prev, page: 1 }));
										setTitle(value);
									}}
									onChange={e => setTypedNotice(e.target.value)}
									value={typedNotice}
									style={{ marginBottom: "16px" }}
									enterButton
								/>
							</FormItem>
							{/* <FormItem>
								<RangePicker
									onChange={handleChangeDate}
									value={date}
									style={{ width: "240px" }}
								/>
							</FormItem> */}
							<FormItem style={{ marginBottom: "-2px" }}>
								<Button
									className="gx-btn-form gx-btn-primary gx-text-white gx-mt-auto"
									onClick={handleResetFilter}
								>
									Reset
								</Button>
							</FormItem>
						</Form>
						<Button
							className="gx-btn-form gx-btn-primary gx-text-white "
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
						hideOnSinglePage: false,
						onChange: handlePageChange
					}}
					loading={isLoading || isFetching || deleteNoticeMutation.isLoading}
				/>
			</Card>
		</div>
	);
}

export default NoticeBoardPage;
