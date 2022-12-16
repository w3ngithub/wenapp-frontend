import React, {useReducer} from 'react'

const initialState = {
  checkAll: false,
  indeterminate: false,
  checkedList: [],
  emptyObj: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return initialState
    case 'CHANGE_SINGLE_CHECKBOX':
      return {
        ...state,
        checkedList: action.payload.checkedList,
        emptyObj: [...state.emptyObj, action.payload.emptyObj],
        indeterminate: action.payload.indeterminate,
        checkAll: action.payload.checkAll,
      }
    default:
      return state
  }
}

const RolePermissionContext = React.createContext()

const RolePermissionProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // console.log(watch)
  return (
    <RolePermissionContext.Provider value={{state, dispatch}}>
      {children}
    </RolePermissionContext.Provider>
  )
}

export {RolePermissionProvider, RolePermissionContext}
