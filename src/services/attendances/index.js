import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllAttendances = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	userId,
	fromDate,
	toDate
}) => {
	try {
		let response = await API.get(
			`${Apis.Attendances}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&user=${userId}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getAttendance = async attendanceId => {
	try {
		let response = await API.get(`${Apis.Attendances}/${attendanceId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addAttendance = async attendance => {
	try {
		let response = await API.post(`${Apis.Attendances}`, attendance);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateAttendance = async (id, attendance) => {
	try {
		let response = await API.patch(`${Apis.Attendances}/${id}`, attendance);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const deleteAttendance = async id => {
	try {
		let response = await API.delete(`${Apis.Attendances}/${id}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updatePunchout = async (userId, payload) => {
	try {
		let response = await API.patch(
			`${Apis.Attendances}/${userId}/punchout`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const addUserAttendance = async (userId, payload) => {
	try {
		let response = await API.post(
			`${Apis.Users}/${userId}/attendances`,
			payload
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getAttendacentOfUser = async userId => {
	try {
		let response = await API.get(`${Apis.Attendances}?user=${userId}`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const searchAttendacentOfUser = async ({
	userId = "",
	fromDate = "",
	toDate = "",
	page = "",
	sort = "",
	limit = "",
	fields = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.Attendances}/search?user=${userId}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&sort=${sort}&limit=${limit}&fields=${fields}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const searchLateAttendacentOfUser = async ({
	userId = "",
	fromDate = "",
	toDate = "",
	page = "",
	sort = "",
	limit = "",
	fields = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.Attendances}/lateArrival?user=${userId}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&sort=${sort}&limit=${limit}&fields=${fields}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updatePunchReqestCount = async userId => {
	try {
		let response = await API.patch(
			`${Apis.Attendances}/${userId}/updatepunchinrequestcount`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const getTodaysUserAttendanceCount = async userId => {
	try {
		let response = await API.get(`${Apis.Attendances}/today/count`);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

const updateLateAttendance = async attendance => {
	try {
		let response = await API.post(
			`${Apis.Attendances}/updateLateAttendace`,
			attendance
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err?.response);
	}
};

export {
	getAllAttendances,
	getAttendance,
	deleteAttendance,
	addAttendance,
	updateAttendance,
	addUserAttendance,
	updatePunchout,
	getAttendacentOfUser,
	searchAttendacentOfUser,
	updatePunchReqestCount,
	getTodaysUserAttendanceCount,
	searchLateAttendacentOfUser,
	updateLateAttendance
};
