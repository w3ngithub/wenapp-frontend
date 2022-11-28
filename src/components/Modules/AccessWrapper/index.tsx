import RoleAccess from 'constants/RoleAccess'
import {useSelector} from 'react-redux'

interface AccessWrapperInterface {
  noAccessRoles: string[]
  children: JSX.Element
}

function AccessWrapper({noAccessRoles, children}: AccessWrapperInterface) {
  const {
    role: {key},
  } = useSelector((state: any) => state?.auth?.authUser?.user)

  if (!noAccessRoles.includes(key) && Object.values(RoleAccess).includes(key))
    return children
  return null
}

export default AccessWrapper
