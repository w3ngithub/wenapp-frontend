import {Switch} from 'antd'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {useLocation} from 'react-router-dom'

const MaintainanceBar = () => {
  const userDetail = useSelector(selectAuthUser)
  const [isOn, setIsOn] = useState(false)
  const location = useLocation()

  const handleMaintainance = async (e) => {
    if (e) {
      localStorage.setItem('isAdmin', userDetail?.role?.key === 'admin')
      setIsOn(e)
    } else {
      setIsOn(e)
    }
  }

  return userDetail?.role?.key === 'admin' ? (
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
      />
    </>
  ) : (
    <></>
  )
}

export default MaintainanceBar
