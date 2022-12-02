import {
  UPDATE_USER_PROFILE,
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  ON_SWITCHED_USER,
  ON_SWITCH_USER,
  SHOW_MESSAGE,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  UPDATE_JOIN_DATE,
} from 'constants/ActionTypes'

export const userSignUp = (user) => {
  return {
    type: SIGNUP_USER,
    payload: user,
  }
}
export const userSignIn = (user) => {
  return {
    type: SIGNIN_USER,
    payload: user,
  }
}
export const userSignOut = () => {
  return {
    type: SIGNOUT_USER,
  }
}
export const userSignUpSuccess = (authUser) => {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload: authUser,
  }
}

export const userSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: authUser,
  }
}
export const userSignOutSuccess = () => {
  return {
    type: SIGNOUT_USER_SUCCESS,
  }
}

export const showAuthMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  }
}

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url,
  }
}

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  }
}

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  }
}
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  }
}

export const switchUser = () => {
  return {
    type: ON_SWITCH_USER,
  }
}
export const switchedUser = () => {
  return {
    type: ON_SWITCHED_USER,
  }
}
export const getUserProfile = (userData) => {
  return {
    type: UPDATE_USER_PROFILE,
    payload: userData,
  }
}

export const updateJoinDate = (joinDate) => {
  console.log('action running')
  return {
    type: UPDATE_JOIN_DATE,
    payload: joinDate,
  }
}
