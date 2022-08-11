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

const getLeavesOfAllUsers = async () => {
	try {
		let response = await API.get(`${Apis.Leaves}`);
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
	changeLeaveStatus,
	getLeavesOfAllUsers
};
