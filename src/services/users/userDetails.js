import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// login user api
const loginInUser = async loginDetail => {
	try {
		let response = await API.post(`${Apis.Users}/login`, loginDetail);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export { loginInUser };
