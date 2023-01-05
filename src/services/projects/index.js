import API from 'helpers/api'
import {Apis} from 'services/api'
import {getAPIResponse} from 'helpers/getApiResponse'

const getAllProjects = async ({
  page = '',
  sort = '',
  limit = '',
  fields = '',
  projectStatus = '',
  projectTags = '',
  projectType = '',
  projectClient = '',
  project = '',
  developer = '',
  designer = '',
  qa = '',
  endDate = '',
}) => {
  try {
    let response = await API.get(
      `${Apis.Projects}?search=${project}&page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&projectStatus=${projectStatus}&projectTags=${projectTags}&projectTypes=${projectType}&client=${projectClient}&developers=${developer}&designers=${designer}&qa=${qa}&endDate=${endDate}`
    )
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const getProject = async (projectId) => {
  try {
    let response = await API.get(`${Apis.Projects}/${projectId}`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const getProjectTypes = async () => {
  try {
    let response = await API.get(`${Apis.Projects}/types`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const getProjectStatus = async () => {
  try {
    let response = await API.get(`${Apis.Projects}/status`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const getProjectTags = async () => {
  try {
    let response = await API.get(`${Apis.ProjectTags}`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const getProjectClients = async () => {
  try {
    let response = await API.get(`${Apis.Projects}/clients`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const addProject = async (project) => {
  try {
    let response = await API.post(`${Apis.Projects}`, project)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const updateProject = async (id, project) => {
  try {
    let response = await API.patch(`${Apis.Projects}/${id}`, project)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

const deleteProject = async (projectId) => {
  try {
    let response = await API.delete(`${Apis.Projects}/${projectId}`)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err.response)
  }
}

export {
  getAllProjects,
  getProjectTypes,
  getProjectStatus,
  getProjectTags,
  getProjectClients,
  getProject,
  deleteProject,
  addProject,
  updateProject,
}
