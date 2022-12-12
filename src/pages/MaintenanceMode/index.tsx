import React from 'react'
import {ReactComponent as MaintenanceModeIcon} from 'assets/images/maintenance.svg'

function MaintenanceMode() {
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
      <MaintenanceModeIcon style={{width: '450px'}} />
    </div>
  )
}

export default MaintenanceMode
