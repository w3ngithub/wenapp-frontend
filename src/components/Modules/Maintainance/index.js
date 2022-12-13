import {Switch} from 'antd'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {useLocation} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import {updateMaintenance} from 'services/configurations'
import {handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'

const MaintainanceBar = () => {
  const userDetail = useSelector(selectAuthUser)
  const [isOn, setIsOn] = useState(false)
  const location = useLocation()
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
          localStorage.setItem('isAdmin', true)
        } else {
          localStorage.removeItem('isAdmin')
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

  return userDetail?.role?.key === 'admin' ||
    localStorage.getItem('isAdmin') ? (
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
