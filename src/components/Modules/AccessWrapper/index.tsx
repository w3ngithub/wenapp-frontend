import {LOCALSTORAGE_USER} from 'constants/Settings'
import {getLocalStorageData} from 'helpers/utils'

interface AccessWrapperInterface {
  noAccessRoles: string[]
  children: JSX.Element
}

function AccessWrapper({noAccessRoles, children}: AccessWrapperInterface) {
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  if (!noAccessRoles.includes(key)) return children
  return null
}

export default AccessWrapper
