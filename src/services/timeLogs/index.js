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

const getWeeklyTimeLogSummary = async () => {
	try {
		let response = await API.get(`${Apis.TimeLogs}/users/weeklytime`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getTodayTimeLogSummary = async () => {
	try {
		let response = await API.get(`${Apis.TimeLogs}/users/todaytime`);
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

const updateTimeLog = async payload => {
	try {
		let response = await API.patch(
			`${Apis.TimeLogs}/${payload.id}`,
			payload.details
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const addUserTimeLog = async payload => {
	try {
		let response = await API.post(`${Apis.TimeLogs}`, payload);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

const getWeeklyReport = async ({
	fromDate = "",
	toDate = "",
	logType = "",
	projectStatus = "",
	client = ""
}) => {
	try {
		let response = await API.post(
			`${Apis.TimeLogs}/weeklyreport/?fromDate=${fromDate}&toDate=${toDate}&logType=${logType}&projectStatus=${projectStatus}&client=${client}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export {
	getAllTimeLogs,
	getLogTypes,
	deleteTimeLog,
	getWeeklyTimeLogSummary,
	getTodayTimeLogSummary,
	addLogTime,
	updateTimeLog,
	addUserTimeLog,
	getWeeklyReport
};
