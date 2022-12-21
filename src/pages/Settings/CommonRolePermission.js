import React, {useState, useContext} from 'react'
import {Form, Col, Row} from 'antd'
import RolePermissionBox from './RolePermissionBox'
import {permissionRole} from 'constants/RolePermission'
import useWindowsSize from 'hooks/useWindowsSize'
import {RolePermissionContext} from 'context/RolePermissionConext'

const CommonRolePermission = ({allAccess}) => {
  const [form] = Form.useForm()
  let titleName = Object.keys(permissionRole)
  const {innerWidth} = useWindowsSize()
  const [activeKey, setActiveKey] = useState([
    'Navigation',
    'Dashboard',
    'Attendance',
    'Leave Management',
    'Blog',
    'Notice Board',
  ])

  const handleDefaultKeys = (title, data) => {
    if (title === 'Navigation') {
      console.log(title, data)
      const activeKeys = permissionRole['Navigation']
        .filter((d) => data.includes(d.name))
        .map((d) => d.label)
      let dataaaa = [...activeKeys, 'Navigation', 'Dashboard']
      console.log('activekeys', activeKeys)
      setActiveKey(dataaaa)
    }
  }

  const handleOpenCollapse = (key) => {
    console.log('handleKeys0,', key)
    setActiveKey(key)
  }

  return (
    <Form form={form}>
      <Row>
        <Col xl={8} md={12} sm={24} xs={24}>
          {titleName?.map((title, index) => {
            if (innerWidth > 1200 && (index + 1) % 3 === 1) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else if (innerWidth < 1200 && (index + 1) % 2 !== 0) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else if (innerWidth < 765) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else {
              return null
            }
          })}
        </Col>
        <Col xl={8} md={12} sm={24} xs={24}>
          {titleName?.map((title, index) => {
            if (innerWidth > 1200 && (index + 1) % 3 === 2) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else if (
              innerWidth > 765 &&
              innerWidth < 1200 &&
              (index + 1) % 2 === 0
            ) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else if (innerWidth < 765) {
              return null
            } else return null
          })}
        </Col>
        <Col xl={8} md={12} sm={24} xs={24}>
          {titleName?.map((title, index) => {
            if (
              innerWidth > 765 &&
              innerWidth > 1200 &&
              (index + 1) % 3 === 0
            ) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  allAccess={allAccess}
                  activeKey={activeKey}
                  handleDefaultKeys={handleDefaultKeys}
                  handleOpenCollapse={handleOpenCollapse}
                />
              )
            } else if (innerWidth < 765) {
              return null
            } else return null
          })}
        </Col>
      </Row>
    </Form>
  )
}

export default CommonRolePermission
