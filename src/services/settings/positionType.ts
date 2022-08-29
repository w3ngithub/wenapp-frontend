import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getPositionTypes = async () => {
	try {
		let response = await API.get(`${Apis.PositionTypes}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
export const addPositionTypes = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.Users}/positionTypes`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deletePositionTypes = async (payload: { id: string }) => {
	try {
		let response = await API.delete(
			`${Apis.Users}/positionTypes/${payload.id}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
