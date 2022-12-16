import React, {useState} from 'react'
import {Button, Form, Input, Col, Row} from 'antd'
import RolePermissionBox from './RolePermissionBox'
import {permissionRole} from 'constants/RolePermission'

const CommonRolePermission = ({
  setEmptyObj,
  checkedAllRoles,
  allAccess,
  toggle,
}) => {
  const [form] = Form.useForm()
  let titleName = Object.keys(permissionRole)
  console.log('commonerolepermission', toggle)

  return (
    <Form form={form}>
      <Row gutter={[12, 12]}>
        {titleName?.map((title) => (
          <Col span={12}>
            <RolePermissionBox
              data={permissionRole[title]}
              title={title}
              setEmptyObj={setEmptyObj}
              checkedAllRoles={checkedAllRoles}
              allAccess={allAccess}
              toggle={toggle}
            />
          </Col>
        ))}
      </Row>
    </Form>
  )
}

export default CommonRolePermission
