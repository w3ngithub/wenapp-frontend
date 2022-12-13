import React from 'react'
import {ReactComponent as MaintenanceModeIcon} from 'assets/images/maintenance.svg'
import {Switch} from 'antd'
import {useNavigate} from 'react-router-dom'
import {DASHBOARD} from 'helpers/routePath'

function MaintenanceMode() {
  const checkAdmin = localStorage.getItem('isAdmin')
  const navigate = useNavigate()
  const handleChange = (e: boolean) => {
    if (!e) {
      localStorage.removeItem('isAdmin')
      navigate(`../${DASHBOARD}`)
    }
  }
  return (
    <div
      className="center-text"
      style={{
        margin: 'auto',
        width: '30%',
        paddingTop: '50px',
      }}
    >
      <h1
        className="center-text"
        style={{fontWeight: 'bold', letterSpacing: '2px'}}
      >
        The site currently down for maintenance
      </h1>
      <p className="center-text" style={{opacity: '0.7'}}>
        We apologize for any inconvenience caused. Meanwhile you can reload the
        page or try again later
      </p>
      <div>
        {checkAdmin && (
          <>
            <span style={{fontSize: '19px', marginRight: '5px'}}>
              Maintenance
            </span>
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              defaultChecked
              onChange={handleChange}
            />
          </>
        )}
      </div>
      <MaintenanceModeIcon style={{width: '450px'}} />
    </div>
  )
}

export default MaintenanceMode
