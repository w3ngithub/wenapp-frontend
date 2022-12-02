import API from 'helpers/api'
import {Apis} from 'services/api'
import {getAPIResponse} from 'helpers/getApiResponse'

export const getActivityLogs = async ({
  page = 1,
  sort = '',
  limit = 40,
  fields = '',
  status = '',
  module = '',
  fromDate = '',
  toDate = '',
}) => {
  try {
    let response = await API.get(
      `${Apis.ActivityLogs}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&status=${status}&module=${module}&fromDate=${fromDate}&toDate=${toDate}`
    )
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}

export const updateActivityLogs = async (payload: any) => {
  try {
    let response = await API.patch(`${Apis.ActivityLogs}`, payload)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}
