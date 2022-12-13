import API from 'helpers/api'
import {Apis} from 'services/api'
import {getAPIResponse} from 'helpers/getApiResponse'

export const getNotifications = async ({
  page = 1,
  sort = '',
  limit = 40,
  fields = '',
  role = '',
  userId = '',
}) => {
  try {
    let response = await API.get(
      `${Apis.Notification}?page=${page}&sort=${sort}&limit=${limit}&fields=${fields}&role=${role}&userId=${userId}`
    )
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}

export const updateNotifications = async (payload: any) => {
  try {
    let response = await API.patch(`${Apis.ActivityLogs}`, payload)
    return getAPIResponse(response)
  } catch (err) {
    return getAPIResponse(err?.response)
  }
}
