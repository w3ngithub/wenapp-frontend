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

export { getLeaveDaysOfAllUsers };
