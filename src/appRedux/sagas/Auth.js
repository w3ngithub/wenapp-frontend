import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { SIGNIN_USER, SIGNOUT_USER, SIGNUP_USER } from "constants/ActionTypes";
import {
	showAuthMessage,
	userSignInSuccess,
	userSignOutSuccess,
	userSignUpSuccess
} from "../../appRedux/actions/Auth";
import API from "helpers/api";
import { Apis } from "services/api";
import { loginInUsers } from "services/users/userDetails";

// const createUserWithEmailPasswordRequest = async (email, password) =>
//   await  auth.createUserWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
	await loginInUsers({ email, password })
		.then(authUser => authUser)
		.catch(error => error);

// const signOutRequest = async () =>
//   await  auth.signOut()
//     .then(authUser => authUser)
//     .catch(error => error);

// function* createUserWithEmailPassword({payload}) {
//   const {email, password} = payload;
//   try {
//     const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password);
//     if (signUpUser.message) {
//       yield put(showAuthMessage(signUpUser.message));
//     } else {
//       localStorage.setItem('user_id', signUpUser.user.uid);
//       yield put(userSignUpSuccess(signUpUser.user.uid));
//     }
//   } catch (error) {
//     yield put(showAuthMessage(error));
//   }
// }

function* signInUserWithEmailPassword({ payload }) {
	const { email, password } = payload;
	try {
		const signInUser = yield call(
			signInUserWithEmailPasswordRequest,
			email,
			password
		);

		if (!signInUser.status) {
			yield put(showAuthMessage(signInUser.data.message));
		} else {
			localStorage.setItem("user_id", signInUser.user);
			yield put(userSignInSuccess(signInUser.user));
		}
	} catch (error) {
		yield put(showAuthMessage(error));
	}
}

// function* signOut() {
//   try {
//     const signOutUser = yield call(signOutRequest);
//     if (signOutUser === undefined) {
//       localStorage.removeItem('user_id');
//       yield put(userSignOutSuccess(signOutUser));
//     } else {
//       yield put(showAuthMessage(signOutUser.message));
//     }
//   } catch (error) {
//     yield put(showAuthMessage(error));
//   }
// }

// export function* createUserAccount() {
//   yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
// }

export function* signInUser() {
	yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

// export function* signOutUser() {
//   yield takeEvery(SIGNOUT_USER, signOut);
// }

export default function* rootSaga() {
	yield all([fork(signInUser)]);
}
