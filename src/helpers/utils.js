import { notification } from "./notification";

export const handleSort = (
	currentState,
	stateSetter,
	sortField,
	sortMethod
) => {
	let sorted = [...currentState];

	if (sortMethod === "asc") {
		sorted.sort((a, b) =>
			a[sortField]?.toString().localeCompare(b[sortField]?.toString())
		);
	}

	if (sortMethod === "desc") {
		sorted.sort((a, b) =>
			b[sortField]?.toString().localeCompare(a[sortField]?.toString())
		);
	}

	stateSetter(sorted);

	return true;
};

export const sortData = (data, sortField, sortMethod) => {
	let sorted = [...data];

	sorted.sort((a, b) =>
		a[sortField]?.toString().localeCompare(b[sortField]?.toString())
	);

	if (sortMethod === "desc") sorted = sorted.reverse();

	return sorted;
};

export const handleLocalValidate = (schema, checkField, checkData) => {
	return schema
		.validateAt(checkField, { [checkField]: checkData })
		.then(() => {
			// Passes validation
			return { valid: true };
		})
		.catch(err => {
			// Failed validation
			if (err.name === "ValidationError") {
				return { valid: false, error: err.errors };
			}

			return { valid: true };
		});
};

export const handleValidateObj = async (schema, inputObj) => {
	const getValids = async items => {
		return Promise.all(
			items.map(item => {
				return handleLocalValidate(schema, item, inputObj[item]).then(res => {
					return { ...res, input: item };
				});
			})
		);
	};

	return await getValids(Object.keys(inputObj));
};

export const generateErrorState = localValidationArr => {
	let newErrors = {};

	localValidationArr.forEach(validated => {
		if (validated.valid) {
			newErrors[validated.input] = null;
		} else {
			newErrors[validated.input] = validated.error;
		}
	});

	return newErrors;
};

export const checkIsFileImageType = fileName => {
	const splittedFile = fileName?.split(".");
	const fileType = splittedFile[splittedFile?.length - 1];
	const imageTypes = ["gif", "jpeg", "png", "jpg"];
	return imageTypes.includes(fileType);
};

export const changeDateFormat = date => {
	const oldFormat = date.split("T");
	const newDate = oldFormat[0].split("-");
	const time = oldFormat[1].split(".");
	return `${newDate[1]}/${newDate[2]}/${newDate[0]} ${time[0]}`;
};

export function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	let strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}

export const isoDateWithoutTimeZone = date => {
	if (date == null) return date;
	date = new Date(date);

	const localDateAndTime = `${changeDate(date)} ${formatAMPM(date)}`;
	return localDateAndTime;
};

export const checkIfVisibleInViewPort = el => {
	const rect = el?.getBoundingClientRect();
	if (rect) {
		const viewHeight = Math.max(
			document.documentElement.clientHeight,
			window.innerHeight
		);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	}
	return false;
};

export const getFormattedLink = link => {
	let formattedlink = link?.trim();
	if (!/^https?:\/\//i.test(link)) {
		formattedlink = "https://" + link;
	}
	return formattedlink;
};

export const sortFromDate = (data = [], sortField) => {
	return data?.sort(function(a, b) {
		return new Date(a[sortField]) - new Date(b[sortField]);
	});
};

export const csvFileToArray = string => {
	const csvHeader = string?.slice(0, string?.indexOf("\n"))?.split(",");
	const csvRows = string?.slice(string?.indexOf("\n") + 1)?.split("\n");

	const array = csvRows?.map(i => {
		const values = i?.split(",");
		const obj = csvHeader?.reduce((object, header, index) => {
			if (header && values[index]) {
				object[header?.replaceAll('"', "")] = values[index]?.replaceAll(
					'"',
					""
				);
			}
			return object;
		}, {});
		return obj;
	});

	return array;
};

export const convertDateToUTC = date => {
	return new Date(date.getTime()).toJSON();
};

export const debounce = (func, delay) => {
	let timer;
	return function() {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

export function roundedToFixed(input, digits) {
	var rounded = Math.pow(10, digits);
	return Math.round(input * rounded) / rounded;
}

export function currentUTCDateTime() {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	now.setSeconds(0);
	now.setMilliseconds(0);
	return now.toISOString().slice(0, -1);
}

export function MuiFormatDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${yyyy}-${mm}-${dd}`;
}

export const getLocalStorageData = type => {
	let storage = sessionStorage.getItem(type) || localStorage.getItem(type);

	try {
		return JSON.parse(storage);
	} catch (error) {
		storage = JSON.stringify(
			sessionStorage.getItem(type) || localStorage.getItem(type)
		);
		return JSON.parse(storage);
	}
};

export const dateDifference = (end, start) => {
	if (end === null || start === null) return "";
	// get total seconds between the times
	let delta = Math.abs(new Date(end) - new Date(start)) / 1000;

	// calculate (and subtract)  days
	let days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract)  hours
	let hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract)  minutes
	let minutes = Math.floor(delta / 60) % 60;

	return `${days === 0 ? "" : days === 1 ? `${days} day` : `${days} days`} ${
		hours === 0 ? "" : hours === 1 ? `${hours} hr` : `${hours} hrs`
	} ${
		minutes === 0
			? "0 mins"
			: minutes === 1
			? `${minutes} min`
			: `${minutes} mins`
	} `;
};

export function toRoundoff(number) {
	const toSingle = Number.isInteger(number) ? number : +number.toFixed(1);
	return toSingle;
}

export function formatBytes(bytes, decimals = 2) {
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function changeDate(d) {
	const date = new Date(d);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${dd}/${mm}/${yyyy}`;
}

export const handleResponse = (
	response,
	successMessage,
	errorMessage,
	queries
) => {
	if (response.status) {
		console.log("running");
		queries.forEach(query => {
			query();
		});

		notification({
			message: `${successMessage}!`,
			type: "success"
		});
	} else {
		notification({
			message: response?.data?.message || `${errorMessage}!`,
			type: "error"
		});
	}
};
