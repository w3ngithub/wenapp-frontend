import API from 'helpers/api'
import {Apis} from 'services/api'
import {getAPIResponse} from 'helpers/getApiResponse'

export const getActivityLogs = async ({
  page = 1,
  sort = '',
  limit = 40,
  fields = '',
}) => {
  try {
    let response = await API.get(
      `${Apis.ActivityLogs}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}`
    )
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}
