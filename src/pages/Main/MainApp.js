import React, {useEffect} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {connect, useDispatch} from 'react-redux'
import socketIOClient from 'socket.io-client'
import Sidebar from 'containers/Sidebar/index'
import Topbar from 'containers/Topbar/index'
import {footerText} from 'util/config'
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
} from 'constants/ThemeSetting'
import {fetchLoggedInUserAttendance} from 'appRedux/actions/Attendance'

const {Content, Footer} = Layout

export const socket = socketIOClient(process.env.REACT_APP_API_ENDPOINT, {
  transports: ['websocket'],
})

export const MainApp = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (props?.authUser)
      dispatch(fetchLoggedInUserAttendance(props?.authUser?.user?._id))
  }, [dispatch, props?.authUser])

  useEffect(() => {
    const timeout = setInterval(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {},
          () => {},
          {maximumAge: 60000, timeout: 15000, enableHighAccuracy: true}
        )
      }
    }, 1000 * 60 * 5)
    return () => clearInterval(timeout)
  }, [])

  const getContainerClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DARK_HORIZONTAL:
        return 'gx-container-wrap'
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return 'gx-container-wrap'
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return 'gx-container-wrap'
      case NAV_STYLE_BELOW_HEADER:
        return 'gx-container-wrap'
      case NAV_STYLE_ABOVE_HEADER:
        return 'gx-container-wrap'
      default:
        return ''
    }
  }

  const {navStyle} = props

  return (
    <Layout className="gx-app-layout">
      <Sidebar />
      <Layout>
        <Topbar />
        <Content
          className={`gx-layout-content ${getContainerClass(navStyle)} `}
        >
          <div className="gx-main-content-wrapper">
            <Outlet />
          </div>
          <Footer>
            <div className="gx-layout-footer-content">{footerText}</div>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = ({settings, auth}) => {
  const {width, navStyle} = settings
  const {authUser} = auth
  return {width, navStyle, authUser}
}
export default connect(mapStateToProps)(MainApp)
