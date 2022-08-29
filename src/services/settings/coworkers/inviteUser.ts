import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const inviteUsers = async (payload: { email: string }) => {
	try {
		let response = await API.post(`${Apis.Users}/invite`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const getInvitedUsers = async () => {
	try {
		let response = await API.get(`${Apis.Users}/invite`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
