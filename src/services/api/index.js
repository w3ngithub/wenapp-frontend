import { BASE_API_PATH } from "helpers/api";

// Users
const BASE_API_PATH_USERS = `${BASE_API_PATH}users`;
const BASE_API_PATH_ROLES = `${BASE_API_PATH_USERS}/roles`;
const BASE_API_PATH_POSITIONS = `${BASE_API_PATH_USERS}/positions`;
const BASE_API_PATH_UPDATE_PROFILE = `${BASE_API_PATH_USERS}/updateMe`;

// TimeLogs
const BASE_API_PATH_TIMELOGS = `${BASE_API_PATH}timelogs`;

// Projects
const BASE_API_PATH_PROJECTS = `${BASE_API_PATH}projects`;
const BASE_API_PATH_PROJECTS_TAGS = `${BASE_API_PATH_PROJECTS}/tags`;

// Leaves
const BASE_API_PATH_LEAVES = `${BASE_API_PATH}leaves`;

// Resources
const BASE_API_PATH_RESOURCES = `${BASE_API_PATH}resources`;

// NoticeBoard
const BASE_API_PATH_NOTICEBOARD = `${BASE_API_PATH}notices`;

export const Apis = {
	// Users
	Users: `${BASE_API_PATH_USERS}`,
	Roles: `${BASE_API_PATH_ROLES}`,
	Positions: `${BASE_API_PATH_POSITIONS}`,
	Profile: `${BASE_API_PATH_UPDATE_PROFILE}`,

	// TimeLogs
	TimeLogs: `${BASE_API_PATH_TIMELOGS}`,

	// Projects
	Projects: `${BASE_API_PATH_PROJECTS}`,
	ProjectTags: `${BASE_API_PATH_PROJECTS_TAGS}`,

	// Leaves
	Leaves: `${BASE_API_PATH_LEAVES}`,

	// Resources
	Resources: `${BASE_API_PATH_RESOURCES}`,

	// Noticeboard
	NoticeBoard: `${BASE_API_PATH_NOTICEBOARD}`
};
