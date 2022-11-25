import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  ON_SWITCHED_USER,
  ON_SWITCH_USER,
  SET_PROFILE_PHOTO,
  SHOW_MESSAGE,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER_SUCCESS,
} from 'constants/ActionTypes'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const INIT_STATE = {
  showLoader: false,
  switchingUser: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',
  authUser: JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)),
}

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SIGNUP_USER_SUCCESS: {
      return {
        ...state,
        showLoader: false,
        authUser: action.payload,
      }
    }
    case SIGNIN_USER_SUCCESS: {
      return {
        ...state,
        showLoader: false,
        authUser: action.payload,
      }
    }
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload,
      }
    }
    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        authUser: null,
        initURL: '/',
        showLoader: false,
      }
    }

    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        showLoader: false,
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        showLoader: false,
      }
    }

    case ON_SHOW_LOADER: {
      return {
        ...state,
        showLoader: true,
      }
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        showLoader: false,
      }
    }
    case ON_SWITCH_USER: {
      return {
        ...state,
        switchingUser: true,
      }
    }
    case ON_SWITCHED_USER: {
      return {
        ...state,
        switchingUser: false,
      }
    }
    case SET_PROFILE_PHOTO: {
      return {
        ...state,
        authUser: {
          ...state.authUser,
          user: {...state.authUser.user, photoURL: action.payload},
        },
      }
    }
    default:
      return state
  }
}

export default reducer
