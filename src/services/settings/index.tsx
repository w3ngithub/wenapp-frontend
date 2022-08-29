import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getRoles = async () => {
	try {
		let response = await API.get(`${Apis.Roles}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getProjectTypes = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getProjectStatus = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/status`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getProjectTags = async () => {
	try {
		let response = await API.get(`${Apis.ProjectTags}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const getClients = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/clients`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getLogtypes = async () => {
	try {
		let response = await API.get(`${Apis.TimeLogs}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getLeaveTypes = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getNoticeboardTypes = async () => {
	try {
		let response = await API.get(`${Apis.NoticeBoard}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getBlogCategories = async () => {
	try {
		let response = await API.get(`${Apis.Blog}/categories`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const inviteUsers = async (payload: { email: string }) => {
	try {
		let response = await API.post(`${Apis.Users}/invite`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
