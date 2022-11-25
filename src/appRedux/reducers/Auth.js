import {
  UPDATE_USER_PROFILE,
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER_SUCCESS,
} from 'constants/ActionTypes'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const INIT_STATE = {
  loader: false,
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
        loader: false,
        authUser: action.payload,
      }
    }
    case SIGNIN_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
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
        loader: false,
      }
    }

    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false,
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false,
      }
    }

    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true,
      }
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false,
      }
    }

    case UPDATE_USER_PROFILE:
      return {
        ...state,
        authUser: {
          ...state.authUser,
          user: {...action.payload.user},
        },
      }

    default:
      return state
  }
}

export default reducer
