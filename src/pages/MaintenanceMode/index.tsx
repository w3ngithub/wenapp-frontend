import React from 'react'
import {ReactComponent as MaintenanceModeIcon} from 'assets/images/maintenance.svg'
import MaintainanceBar from 'components/Modules/Maintainance'
import {useQuery} from '@tanstack/react-query'
import {getMaintenance} from 'services/configurations'
import {useNavigate} from 'react-router-dom'
import {DASHBOARD} from 'helpers/routePath'
import CircularProgress from 'components/Elements/CircularProgress'

function MaintenanceMode() {
  const navigate = useNavigate()
  const configurations = useQuery(['configurations'], getMaintenance, {
    onSuccess: (configurations) => {
      if (!configurations?.data?.data?.data?.[0]?.isMaintenanceEnabled) {
        navigate(`/${DASHBOARD}`)
      }
    },
  })

  if (configurations?.isLoading) return <CircularProgress className="" />

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
        <MaintainanceBar />
      </div>
      <MaintenanceModeIcon style={{width: '450px'}} />
    </div>
  )
}

export default MaintenanceMode
