import {
  CHANGE_SINGLE_CHECKBOX,
  DESELECT_ALL,
  GLOBAL_SELECT_ALL,
  RESET,
  SELECT_ALL_CHECKBOX,
  SET_EDIT_DATA,
} from 'constants/RolePermission'
import React, {useReducer} from 'react'
import {SET_COLLAPSE_OPEN} from '../constants/RolePermission'

const initialState = {
  checkAll: {},
  indeterminate: {},
  checkedList: {
    Navigation: [
      'attendance',
      'noticeBoard',
      'resources',
      'leaveManagement',
      'blog',
    ],
  },
  defauleCollapseOpen: [
    'Navigation',
    'Dashboard',
    'Attendance',
    'Leave Management',
    'Blog',
    'Notice Board',
    'Resources',
  ],
}

const reducer = (state, action) => {
  switch (action.type) {
    case RESET:
      return initialState

    case DESELECT_ALL:
      return {...initialState, checkedList: []}

    case CHANGE_SINGLE_CHECKBOX:
      return {
        ...state,
        checkedList: {
          ...state.checkedList,
          [action.payload.checkedList.title]: action.payload.checkedList.list,
        },
        indeterminate: {
          ...state.indeterminate,
          [action.payload.indeterminate.title]:
            action.payload.indeterminate.check,
        },
        checkAll: {
          ...state.checkAll,
          [action.payload.checkAll.title]: action.payload.checkAll.check,
        },
      }

    case SELECT_ALL_CHECKBOX:
      return {
        ...state,
        checkedList: {
          ...state.checkedList,
          [action.payload.checkedList.title]: action.payload.checkedList.list,
        },
        indeterminate: {
          ...state.indeterminate,
          [action.payload.indeterminate.title]:
            action.payload.indeterminate.check,
        },
        checkAll: {
          ...state.checkAll,
          [action.payload.checkAll.title]: action.payload.checkAll.check,
        },
      }

    case GLOBAL_SELECT_ALL:
      return {
        ...state,
        checkedList: {
          ...state.checkedList,
          [action.payload.checkedList.title]: action.payload.checkedList.list,
        },
        indeterminate: {
          ...state.indeterminate,
          [action.payload.indeterminate.title]:
            action.payload.indeterminate.check,
        },
        checkAll: {
          ...state.checkAll,
          [action.payload.checkAll.title]: action.payload.checkAll.check,
        },
      }

    case SET_EDIT_DATA:
      return {
        ...state,
        checkedList: action.payload.checkedList,
        checkAll: action.payload.checkAll,
        indeterminate: action.payload.indeterminate,
      }

    case SET_COLLAPSE_OPEN:
      return {
        ...state,
        defauleCollapseOpen: action.payload,
      }

    // case RESET_COLLAPSE_KEY:
    //   return {
    //     ...state,

    //   }

    default:
      return state
  }
}

const RolePermissionContext = React.createContext()

const RolePermissionProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <RolePermissionContext.Provider value={{state, dispatch}}>
      {children}
    </RolePermissionContext.Provider>
  )
}

export {RolePermissionProvider, RolePermissionContext}
