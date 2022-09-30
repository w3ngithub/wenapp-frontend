import React from 'react'
import {Menu} from 'antd'
import {Link, useLocation} from 'react-router-dom'

import CustomScrollbars from 'util/CustomScrollbars'
import SidebarLogo from './SidebarLogo'

import Auxiliary from 'util/Auxiliary'
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from 'constants/ThemeSetting'
import IntlMessages from 'util/IntlMessages'
import {connect} from 'react-redux'
import {SIDEBAR_ITEMS} from 'constants/sideBarItems'
import {REPORTS, RESOURCES} from 'helpers/routePath'
import {getLocalStorageData} from 'helpers/utils'
import RoleAccess from 'constants/RoleAccess'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const SubMenu = Menu.SubMenu

function SidebarContent(props) {
  const {themeType, navStyle, collapse} = props
  const location = useLocation()
  const paths = location.pathname.split('/')
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  const selectedOpenKeys =
    paths[1] === REPORTS || paths[1] === RESOURCES ? paths[2] : paths[1]

  const collapseNav = collapse ? collapse : () => {}
  const getNoHeaderClass = navStyle => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return 'gx-no-header-notifications'
    }
    return ''
  }

  const getNavStyleSubMenuClass = navStyle => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return 'gx-no-header-submenu-popup'
    }
    return ''
  }

  return (
    <Auxiliary>
      <SidebarLogo />
      <div className="gx-sidebar-content">
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            selectedKeys={[selectedOpenKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline"
          >
            {SIDEBAR_ITEMS.filter(
              item =>
                item.roles.includes(key) || item.roles.includes(RoleAccess.All)
            ).map(item =>
              item.isExpandable ? (
                <SubMenu
                  key={item.url}
                  className={getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span style={{display: 'flex', alignItems: 'center'}}>
                      <i className={`icon icon-${item.icon} gx-fs-xlxl`} />
                      <IntlMessages id={item.name} />
                    </span>
                  }
                >
                  {item.subItems
                    .filter(subitem => {
                      if (subitem.roles) {
                        return subitem.roles.includes(key)
                      }
                      return true
                    })
                    .map(subItem => (
                      <Menu.Item key={subItem.url}>
                        <Link
                          to={`${item.url}/${subItem.url}`}
                          onClick={collapseNav}
                        >
                          {/* <i className={`icon ${item.icon}`} /> */}
                          <IntlMessages id={subItem.name} />
                        </Link>
                      </Menu.Item>
                    ))}
                </SubMenu>
              ) : (
                <Menu.Item key={item.url}>
                  <Link
                    to={`/${item.url}`}
                    style={{display: 'flex', alignItems: 'center'}}
                    onClick={collapseNav}
                  >
                    <i className={`icon icon-${item.icon} gx-fs-xlxl`} />
                    <IntlMessages id={item.name} />
                  </Link>
                </Menu.Item>
              )
            )}
          </Menu>
        </CustomScrollbars>
      </div>
    </Auxiliary>
  )
}

SidebarContent.propTypes = {}
const mapStateToProps = ({settings}) => {
  const {navStyle, themeType, locale, pathname} = settings
  return {navStyle, themeType, locale, pathname}
}
export default connect(mapStateToProps)(SidebarContent)
