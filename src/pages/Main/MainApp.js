import React, {useEffect} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {connect, useDispatch} from 'react-redux'
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
import {LOCALSTORAGE_USER} from 'constants/Settings'
import {useQuery} from '@tanstack/react-query'
import {getUserProfile, getUserRolePermission} from 'appRedux/actions'
import {getMyProfile} from 'services/users/userDetails'
import CircularProgress from 'components/Elements/CircularProgress'
import {getRoles} from 'services/settings/coworkers/roles'

const {Content, Footer} = Layout

export const MainApp = (props) => {
  const dispatch = useDispatch()
  const userId =
    localStorage.getItem(LOCALSTORAGE_USER) &&
    localStorage.getItem(LOCALSTORAGE_USER) !== 'undefined'
      ? JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '')
      : ''

  const {data: details, isFetching} = useQuery(
    ['userDetail', userId],
    () => getMyProfile(userId),
    {
      onSuccess: (data) => {
        if (data.status) {
          localStorage.setItem(
            LOCALSTORAGE_USER,
            JSON.stringify(data?.data?.data?.data[0]?._id)
          )
          dispatch(
            getUserProfile({
              user: data?.data?.data?.data[0],
            })
          )
        }
      },
      enabled: !!userId,
    }
  )

  const {data: roles} = useQuery(['roles'], getRoles, {
    // onSuccess: (data) => {
    //   console.log(data)
    //   dispatch(getUserRolePermission())
    // },
  })

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

  const {navStyle, switchingUser} = props
  if (isFetching || switchingUser) return <CircularProgress />

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
  const {authUser, switchingUser} = auth
  return {width, navStyle, authUser, switchingUser}
}
export default connect(mapStateToProps)(MainApp)
