import {Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

function AccessRoute({
  roles,
  children,
}: {
  roles: string[]
  children: JSX.Element
}) {
  const {
    role: {key},
  } = useSelector((state: any) => state?.auth?.authUser?.user)

  if (roles.includes(key)) {
    return children
  }
  return <Navigate to="/" />
}

export default AccessRoute
