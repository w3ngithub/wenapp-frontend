import React from 'react'
import {Form, Col, Row} from 'antd'
import RolePermissionBox from './RolePermissionBox'
import {permissionRole} from 'constants/RolePermission'
import useWindowsSize from 'hooks/useWindowsSize'

const CommonRolePermission = ({checkedAllRoles, allAccess}) => {
  const [form] = Form.useForm()
  let titleName = Object.keys(permissionRole)
  const {innerWidth} = useWindowsSize()

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
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
                />
              )
            } else if (innerWidth < 1200 && (index + 1) % 2 !== 0) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
                />
              )
            } else if (innerWidth < 765) {
              return (
                <RolePermissionBox
                  data={permissionRole[title]}
                  title={title}
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
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
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
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
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
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
                  checkedAllRoles={checkedAllRoles}
                  allAccess={allAccess}
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
