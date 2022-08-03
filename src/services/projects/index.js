import API from "helpers/api";
import { Apis } from "services/api";
import { getAPIResponse } from "helpers/getApiResponse";

const getAllProjects = async ({
	page = "",
	sort = "",
	limit = "",
	fields = "",
	name = "",
	role = "",
	position = "",
	active = ""
}) => {
	try {
		let response = await API.get(
			`${Apis.Projects}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&name=${name}&role=${role}&position=${position}&active=${active}`
		);
		return getAPIResponse(response);
	} catch (err) {
		return getAPIResponse(err.response);
	}
};

export { getAllProjects };
