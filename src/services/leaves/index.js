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

const getLeavesOfAllUsers = async (status = "", user = "") => {
	try {
		let response = await API.get(
			`${Apis.Leaves}?leaveStatus=${status}&user=${user}`
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

export {
	getLeaveDaysOfAllUsers,
	getLeavesOfUser,
	getLeavesOfAllUsers,
	getTakenAndRemainingLeaveDaysOfUser,
	getLeaveTypes,
	changeLeaveStatus
};
