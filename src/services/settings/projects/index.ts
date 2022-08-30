import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

// Project Types
export const getProjectTypes = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addProjectType = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.Projects}/types`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const editProjectType = async (payload: {
	name: string;
	id: string;
}) => {
	try {
		let response = await API.patch(
			`${Apis.Projects}/types/${payload?.id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteProjectType = async (payload: { id: string }) => {
	try {
		let response = await API.delete(`${Apis.Projects}/types/${payload.id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

// Project Status
export const getProjectStatus = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/status`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addProjectStatus = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.Projects}/status`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const editProjectStatus = async (payload: {
	name: string;
	id: string;
}) => {
	try {
		let response = await API.patch(
			`${Apis.Projects}/status/${payload?.id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteProjectStatus = async (payload: { id: string }) => {
	try {
		let response = await API.delete(`${Apis.Projects}/status/${payload.id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

// Tags
export const getProjectTags = async () => {
	try {
		let response = await API.get(`${Apis.ProjectTags}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addProjectTag = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.ProjectTags}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const editProjectTag = async (payload: { name: string; id: string }) => {
	try {
		let response = await API.patch(
			`${Apis.ProjectTags}/${payload?.id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteProjectTag = async (payload: { id: string }) => {
	try {
		let response = await API.delete(`${Apis.ProjectTags}/${payload.id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

//Clients

export const getClients = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/clients`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const addClient = async (payload: { name: string }) => {
	try {
		let response = await API.post(`${Apis.Projects}/clients`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const editClient = async (payload: { name: string; id: string }) => {
	try {
		let response = await API.patch(
			`${Apis.Projects}/clients/${payload?.id}`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export const deleteClient = async (payload: { id: string }) => {
	try {
		let response = await API.delete(`${Apis.Projects}/clients/${payload.id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};
