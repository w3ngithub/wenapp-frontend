import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import Settings from './Settings'
import Auth from './Auth'
import Common from './Common'
import Attendance from './Attendance'
import UserProfile from './UserProfile'

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  common: Common,
  attendance: Attendance,
  userProfile: UserProfile,
})

export default reducers
