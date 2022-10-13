import {LOCALSTORAGE_USER} from 'constants/Settings'
import {getLocalStorageData} from 'helpers/utils'
import RoleAccess from 'constants/RoleAccess'

interface AccessWrapperInterface {
  noAccessRoles: string[]
  children: JSX.Element
}

function AccessWrapper({noAccessRoles, children}: AccessWrapperInterface) {
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  if (!noAccessRoles.includes(key) && Object.values(RoleAccess).includes(key))
    return children
  return null
}

export default AccessWrapper
