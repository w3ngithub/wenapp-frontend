import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// login user api
const loginInUsers = async (loginDetail) => {
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
	active = "",
}) => {
	try {
		let response = await API.get(
			`${Apis.Users}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&name=${name}&role=${role}&position=${position}&active=${active}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getUserRoles = async () => {
	try {
		let response = await API.get(`${Apis.Roles}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getUserPosition = async () => {
	try {
		let response = await API.get(`${Apis.Positions}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const updateProfile = async (payload) => {
	try {
		let response = await API.patch(`${Apis.Profile}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export {
	loginInUsers,
	getAllUsers,
	logoutUser,
	getUserRoles,
	getUserPosition,
	updateProfile,
	updateUser,
};
