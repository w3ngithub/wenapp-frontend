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

const getAllUsers = async () => {
	try {
		let response = await API.get(`${Apis.Users}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export { loginInUsers, logoutUser, getAllUsers };
