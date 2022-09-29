import {getLocalStorageData} from 'helpers/utils'
import {Navigate} from 'react-router-dom'
import {LOCALSTORAGE_USER} from 'constants/Settings'

function AccessRoute({
  roles,
  children,
}: {
  roles: string[]
  children: JSX.Element
}) {
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  if (roles.includes(key)) {
    return children
  }
  return <Navigate to="/" />
}

export default AccessRoute
