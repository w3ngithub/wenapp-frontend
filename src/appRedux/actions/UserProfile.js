import {GET_USER_PROFILE} from 'constants/ActionTypes'

export const getUserProfile = (user) => {
  return {
    type: GET_USER_PROFILE,
    payload: user,
  }
}
