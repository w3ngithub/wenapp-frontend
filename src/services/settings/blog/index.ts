import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

export const getBlogCategories = async () => {
	try {
		let response = await API.get(`${Apis.Blog}/categories`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addBlogCategory = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.Blog}/categories`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const editBlogCategory = async (payload: {
	name: string;
	id: string;
}) => {
	try {
		let response = await API.patch(
			`${Apis.Blog}/categories/${payload?.id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteBlogCategory = async (payload: { id: string }) => {
	try {
		let response = await API.delete(`${Apis.Blog}/categories/${payload.id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
