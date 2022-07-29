const getAPIResponse = response => {
	const status = response?.status === 200 || response?.status === 201;

	return {
		status,
		messageType: status ? "Sucess" : "Danger",
		data: response?.data
	};
};

export { export };
