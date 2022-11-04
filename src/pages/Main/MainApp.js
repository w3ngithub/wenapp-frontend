import React, {useEffect} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {connect, useDispatch} from 'react-redux'
import Sidebar from 'containers/Sidebar/index'
import HorizontalDefault from 'containers/Topbar/HorizontalDefault/index'
import HorizontalDark from 'containers/Topbar/HorizontalDark/index'
import InsideHeader from 'containers/Topbar/InsideHeader/index'
import AboveHeader from 'containers/Topbar/AboveHeader/index'
import BelowHeader from 'containers/Topbar/BelowHeader/index'
import Topbar from 'containers/Topbar/index'
import {footerText} from 'util/config'
// import Customizer from "containers/Customizer";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
} from 'constants/ThemeSetting'
import NoHeaderNotification from 'containers/Topbar/NoHeaderNotification/index'
import {fetchLoggedInUserAttendance} from 'appRedux/actions/Attendance'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const {Content, Footer} = Layout

export const MainApp = (props) => {
  const dispatch = useDispatch()

  const {user} = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '{}')

  useEffect(() => {
    dispatch(fetchLoggedInUserAttendance(user._id))
  }, [dispatch, user._id])

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
  const getNavStyles = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return <HorizontalDefault />
      case NAV_STYLE_DARK_HORIZONTAL:
        return <HorizontalDark />
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return <InsideHeader />
      case NAV_STYLE_ABOVE_HEADER:
        return <AboveHeader />
      case NAV_STYLE_BELOW_HEADER:
        return <BelowHeader />
      case NAV_STYLE_FIXED:
        return <Topbar />
      case NAV_STYLE_DRAWER:
        return <Topbar />
      case NAV_STYLE_MINI_SIDEBAR:
        return <Topbar />
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <NoHeaderNotification />
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <NoHeaderNotification />
      default:
        return null
    }
  }

  const getSidebar = (navStyle, width) => {
    if (width < TAB_SIZE) {
      return <Sidebar />
    }
    switch (navStyle) {
      case NAV_STYLE_FIXED:
        return <Sidebar />
      case NAV_STYLE_DRAWER:
        return <Sidebar />
      case NAV_STYLE_MINI_SIDEBAR:
        return <Sidebar />
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <Sidebar />
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <Sidebar />
      default:
        return null
    }
  }

  const {width, navStyle} = props

  return (
    <Layout className="gx-app-layout">
      {getSidebar(navStyle, width)}
      <Layout>
        {getNavStyles(navStyle)}
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
      {/* <Customizer /> */}
    </Layout>
  )
}

const mapStateToProps = ({settings}) => {
  const {width, navStyle} = settings
  return {width, navStyle}
}
export default connect(mapStateToProps)(MainApp)
