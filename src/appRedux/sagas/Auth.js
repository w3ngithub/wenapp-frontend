import {all, call, fork, put, takeLatest} from 'redux-saga/effects'

import {SIGNIN_USER, SIGNOUT_USER} from 'constants/ActionTypes'
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess,
} from '../../appRedux/actions/Auth'
import {loginInUsers, logoutUser} from 'services/users/userDetails'
import instance from 'helpers/api'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await loginInUsers({email, password})
    .then((authUser) => authUser)
    .catch((error) => error)

const signOutRequest = async () =>
  await logoutUser()
    .then((authUser) => authUser)
    .catch((error) => error)

function* signInUserWithEmailPassword({payload}) {
  const {email, password} = payload
  try {
    const signInUser = yield call(
      signInUserWithEmailPasswordRequest,
      email,
      password
    )

    if (!signInUser.status) {
      yield put(showAuthMessage(signInUser.data.message))
    } else {
      localStorage.setItem('token', signInUser.data.token)
      localStorage.setItem(
        LOCALSTORAGE_USER,
        JSON.stringify(signInUser.data.data?.user?._id)
      )
      instance.defaults.headers[
        'Authorization'
      ] = `Bearer ${signInUser.data.token}`
      yield put(userSignInSuccess(signInUser.data.data))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest)
    if (signOutUser.status) {
      localStorage.removeItem(LOCALSTORAGE_USER)
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      yield put(userSignOutSuccess(signOutUser))
    } else {
      yield put(showAuthMessage(signOutUser.data.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

// export function* createUserAccount() {
//   yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
// }

export function* signInUser() {
  yield takeLatest(SIGNIN_USER, signInUserWithEmailPassword)
}

export function* signOutUser() {
  yield takeLatest(SIGNOUT_USER, signOut)
}

export default function* rootSaga() {
  yield all([fork(signInUser), fork(signOutUser)])
}
