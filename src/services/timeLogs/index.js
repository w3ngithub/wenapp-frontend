import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllTimeLogs = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	project = "",
	user = "",
	logType = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.TimeLogs}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&project=${project}&user=${user}&logType=${logType}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getLogTypes = async () => {
	try {
		let response = await API.get(`${Apis.TimeLogs}/types`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const addLogTime = async payload => {
	try {
		let response = await API.post(
			`${Apis.Projects}/${payload.id}/timelogs`,
			payload.details
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const deleteTimeLog = async logId => {
	try {
		let response = await API.delete(`${Apis.TimeLogs}/${logId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export { getAllTimeLogs, getLogTypes, deleteTimeLog, addLogTime };
