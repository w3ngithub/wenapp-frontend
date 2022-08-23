import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// login user api
const loginInUsers = async loginDetail => {
	try {
		let response = await API.post(`${Apis.Users}/login`, loginDetail);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

// logout user api
const logoutUser = async () => {
	try {
		let response = await API.get(`${Apis.Users}/logout`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getAllUsers = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	name = "",
	role = "",
	position = "",
	positionType = "",
	active = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.Users}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&name=${name}&role=${role}&position=${position}&positionType=${positionType}&active=${active}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getUserRoles = async () => {
	try {
		let response = await API.get(`${Apis.Roles}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getUserPositionTypes = async () => {
	try {
		let response = await API.get(`${Apis.PositionTypes}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getTeamLeads = async () => {
	try {
		let response = await API.get(
			`${Apis.Users}?role=62b1a1ac9220ea1d59ab385b&role=62b1907b31f49d10e7717078`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getUserPosition = async () => {
	try {
		let response = await API.get(`${Apis.Positions}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateProfile = async payload => {
	try {
		let response = await API.patch(`${Apis.Profile}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateUser = async (userId, payload) => {
	try {
		let response = await API.patch(`${Apis.Users}/${userId}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const importUsers = async payload => {
	try {
		let response = await API.post(`${Apis.Users}/import`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	loginInUsers,
	getAllUsers,
	getTeamLeads,
	logoutUser,
	getUserRoles,
	getUserPosition,
	getUserPositionTypes,
	updateProfile,
	updateUser,
	importUsers
};
