import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getLeaveDaysOfAllUsers = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/users/leavedays`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getTakenAndRemainingLeaveDaysOfUser = async id => {
	try {
		let response = await API.get(`${Apis.Leaves}/${id}/leavedays`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getLeavesOfAllUsers = async (status = "", user = "", date = "") => {
	try {
		let response = await API.get(
			`${Apis.Leaves}?leaveStatus=${status}&user=${user}&leaveDates=${date}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getLeavesOfUser = async id => {
	try {
		let response = await API.get(`${Apis.Leaves}?user=${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getLeaveTypes = async id => {
	try {
		let response = await API.get(`${Apis.Leaves}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const changeLeaveStatus = async (id, statusType) => {
	try {
		let response = await API.patch(`${Apis.Leaves}/${id}/status/${statusType}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const createLeave = async payload => {
	try {
		let response = await API.post(`${Apis.Leaves}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const createLeaveOfUser = async payload => {
	try {
		let response = await API.post(
			`${Apis.Users}/${payload.id}/leaves`,
			payload.data
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateLeave = async payload => {
	try {
		let response = await API.patch(
			`${Apis.Leaves}/${payload.id}`,
			payload.data
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getPendingLeavesCount = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/pending/count`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getTodaysUserLeaveCount = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/users/today/count`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getFiscalYearLeaves = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/users/fiscalYearLeaves`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getWeekRangeLeaves = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}/users/weekLeaves`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getLeaveDaysOfAllUsers,
	getLeavesOfUser,
	getLeavesOfAllUsers,
	getTakenAndRemainingLeaveDaysOfUser,
	getLeaveTypes,
	changeLeaveStatus,
	createLeave,
	createLeaveOfUser,
	updateLeave,
	getPendingLeavesCount,
	getTodaysUserLeaveCount,
	getFiscalYearLeaves,
	getWeekRangeLeaves
};
