import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllFaqs = async ({ page = "", limit = "" }) => {
	try {
		let response = await API.get(
			`${Apis.Resources}/faqs?page=${page}&limit=${limit}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getAllPolicies = async ({ page = "", limit = "" }) => {
	try {
		let response = await API.get(
			`${Apis.Resources}/policies?page=${page}&limit=${limit}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export { getAllFaqs, getAllPolicies };
