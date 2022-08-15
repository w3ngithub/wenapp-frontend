import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllNotices = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	title = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.NoticeBoard}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&title=${title}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getNotice = async noticeId => {
	try {
		let response = await API.get(`${Apis.NoticeBoard}/${noticeId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addNotice = async notice => {
	try {
		let response = await API.post(`${Apis.NoticeBoard}`, notice);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateNotice = async (id, notice) => {
	try {
		let response = await API.patch(`${Apis.NoticeBoard}/${id}`, notice);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const deleteNotice = async noticeId => {
	try {
		let response = await API.delete(`${Apis.NoticeBoard}/${noticeId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getNoticeTypes = async () => {
	try {
		let response = await API.get(`${Apis.NoticeBoard}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getAllNotices,
	getNotice,
	deleteNotice,
	addNotice,
	updateNotice,
	getNoticeTypes
};
