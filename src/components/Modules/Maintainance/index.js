import {isAdmin} from '@firebase/util'
import {Switch} from 'antd'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import {MAINTAINANCE_MODE} from 'helpers/routePath'
import React, {useEffect, useState} from 'react'
import {BsFillSunFill} from 'react-icons/bs'
import {FaMoon} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {getMyProfile} from 'services/users/userDetails'

const MaintainanceBar = () => {
  let userId = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '')
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await getMyProfile(userId)
      if (response.status) {
        let checkAdmin = response?.data?.data?.data[0]?.role?.value === 'Admin'
        setIsAdmin(checkAdmin)
      }
    }
    getUserProfile()
  }, [])

  const handleMaintainance = async (e) => {
    if (e) {
      localStorage.setItem('isAdmin', isAdmin)
      navigate(MAINTAINANCE_MODE)
    }
  }

  return (
    isAdmin && (
      <li className="gx-notify">
        <span
          style={{
            fontSize: '19px',
            marginRight: '5px',
          }}
        >
          Maintenance
        </span>
        <Switch
          className="maintain-dark"
          checkedChildren="ON"
          unCheckedChildren="OFF"
          defaultChecked={false}
          onChange={handleMaintainance}
        />
      </li>
    )
  )
}

export default MaintainanceBar
