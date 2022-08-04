import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllProjects = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	projectStatus = "",
	projectType = "",
	projectClient = "",
	project = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.Projects}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&projectStatus=${projectStatus}&projectTypes=${projectType}&client=${projectClient}&name=${project}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getProjectTypes = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getProjectStatus = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/status`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getProjectClients = async () => {
	try {
		let response = await API.get(`${Apis.Projects}/clients`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const deleteProject = async projectId => {
	try {
		let response = await API.delete(`${Apis.Projects}/${projectId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export {
	getAllProjects,
	getProjectTypes,
	getProjectStatus,
	getProjectClients,
	deleteProject
};
