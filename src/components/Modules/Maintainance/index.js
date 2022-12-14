import {Switch} from 'antd'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {useLocation, useNavigate} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import {updateMaintenance} from 'services/configurations'
import {handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import {
  ADMIN_KEY,
  SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY,
} from 'constants/Common'
import {DASHBOARD} from 'helpers/routePath'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const MaintainanceBar = () => {
  const userDetail = useSelector(selectAuthUser)
  const [isOn, setIsOn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const maintenanceMutation = useMutation(
    (payload) => updateMaintenance(payload),
    {
      onSuccess: (response) => {
        const res = response?.data?.data
        handleResponse(
          response,
          `Maintenance mode ${res?.isMaintenanceEnabled ? 'on' : 'off'}`,
          'Maintenance mode change failed',
          []
        )
        if (res?.isMaintenanceEnabled) {
          localStorage.setItem(
            SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY,
            JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)) + ADMIN_KEY
          )
        } else {
          localStorage.removeItem(SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY)
          navigate(`/${DASHBOARD}`)
        }
      },
      onError: (error) => {
        notification({message: 'Maintenance mode change failed', type: 'error'})
      },
    }
  )

  const handleMaintainance = (isActive) => {
    maintenanceMutation.mutate({isMaintenanceEnabled: isActive})
    setIsOn(isActive)
  }

  const showMaintenanceButton = () => {
    return (
      localStorage.getItem(SHOW_MAINTENANCE_BUTTON_TO_ADMIN_ONLY) ===
      JSON.parse(localStorage.getItem(LOCALSTORAGE_USER)) + ADMIN_KEY
    )
  }

  return userDetail?.role?.key === 'admin' || showMaintenanceButton() ? (
    <>
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
        defaultChecked={location.pathname.includes('maintenance')}
        onChange={handleMaintainance}
        loading={maintenanceMutation.isLoading}
      />
    </>
  ) : (
    <></>
  )
}

export default MaintainanceBar
