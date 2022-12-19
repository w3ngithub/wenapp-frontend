import React from 'react'
import {Form, Col, Row} from 'antd'
import RolePermissionBox from './RolePermissionBox'
import {permissionRole} from 'constants/RolePermission'

const CommonRolePermission = ({checkedAllRoles, allAccess}) => {
  const [form] = Form.useForm()
  let titleName = Object.keys(permissionRole)

  return (
    <Form form={form}>
      <Row gutter={[12, 12]}>
        {titleName?.map((title) => (
          <Col span={8}>
            <RolePermissionBox
              data={permissionRole[title]}
              title={title}
              checkedAllRoles={checkedAllRoles}
              allAccess={allAccess}
            />
          </Col>
        ))}
      </Row>
    </Form>
  )
}

export default CommonRolePermission
