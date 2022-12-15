import API from 'helpers/api'
import {Apis} from 'services/api'
import {getAPIResponse} from 'helpers/getApiResponse'

export const updateMaintenance = async (payload: any) => {
  try {
    let response = await API.patch(`${Apis.Configurations}/update`, payload)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}
export const getMaintenance = async (payload: any) => {
  try {
    let response = await API.get(`${Apis.Configurations}`, payload)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}
