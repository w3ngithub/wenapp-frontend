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
import {
  ADMIN_KEY,
  SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY,
} from 'constants/Common'

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

      if (signInUser.data.data?.user?.role?.key === 'admin')
        localStorage.setItem(
          SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY,
          signInUser.data.data?.user?._id + ADMIN_KEY
        )
      instance.defaults.headers[
        'Authorization'
      ] = `Bearer ${signInUser.data.token}`

      const signuser = signInUser.data.data

      const updatedParsed = {
        ...signuser,
        user: {
          ...signuser?.user,
          role: {
            ...signuser?.user?.role,
            permission: JSON.parse(signuser?.user?.role?.permission)[0],
          },
        },
      }

      yield put(userSignInSuccess(updatedParsed))
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
      localStorage.removeItem('showMaintenanceButtonToAdminOnly')
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
