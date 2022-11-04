import {GET_USER_PROFILE} from 'constants/ActionTypes'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import {getLocalStorageData} from 'helpers/utils'

const localData = getLocalStorageData(LOCALSTORAGE_USER) || {}
const INIT_STATE = {
  name: localData?.name,
  position: localData?.position?.name,
}

const UserProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state,
        name: action.payload.name,
        position: action.payload.position,
      }

    default:
      return state
  }
}

export default UserProfile
