import {Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

function AccessRoute({
  roles,
  children,
}: {
  roles: string[]
  children: JSX.Element
}) {
  const {
    role: {key},
  } = useSelector(selectAuthUser)

  if (roles.includes(key)) {
    return children
  }
  return <Navigate to="/" />
}

export default AccessRoute
