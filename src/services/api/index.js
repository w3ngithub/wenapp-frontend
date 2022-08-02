import { BASE_API_PATH } from "helpers/api";

// Users
const BASE_API_PATH_USERS = `${BASE_API_PATH}users`;
const BASE_API_PATH_ROLES = `${BASE_API_PATH_USERS}/roles`;
const BASE_API_PATH_POSITIONS = `${BASE_API_PATH_USERS}/positions`;

export const Apis = {
	// Users
	Users: `${BASE_API_PATH_USERS}`,
	Roles: `${BASE_API_PATH_ROLES}`,
	Positions: `${BASE_API_PATH_POSITIONS}`
};
