import React, {useContext, useEffect} from 'react'
import {Form, Col, Row} from 'antd'
import RolePermissionBox from './RolePermissionBox'
import {permissionRole, SET_COLLAPSE_OPEN} from 'constants/RolePermission'
import useWindowsSize from 'hooks/useWindowsSize'
import {RolePermissionContext} from 'context/RolePermissionConext'
import {notification} from 'helpers/notification'

const CommonRolePermission = ({allAccess, isEditMode}) => {
  const {state, dispatch} = useContext(RolePermissionContext)
  const [form] = Form.useForm()
  let titleName = Object.keys(permissionRole)
  const {innerWidth} = useWindowsSize()

  const handleDefaultKeys = (title, checkedList) => {
    if (title === 'Navigation') {
      const activeKeys = permissionRole['Navigation']
        .filter((d) => checkedList?.includes(d.name))
        .map((d) => d.label)
      let dataaaa = [...activeKeys, 'Navigation', 'Dashboard']
      dispatch({type: SET_COLLAPSE_OPEN, payload: dataaaa})
    }
  }

  const handleOpenCollapse = (key) => {
    let activeKeyData = []
    const activeKeys = permissionRole['Navigation']
      .filter((d) => state?.checkedList?.Navigation?.includes(d.name))
      .map((d) => d.label)
    const selectedActivekeys = key.filter((d) => activeKeys.includes(d))

    let keyTitle = key.filter(
      (d) => ![...activeKeys, 'Dashboard', 'Navigation'].includes(d)
    )
    if (keyTitle?.length > 0) {
      return notification({
        type: 'info',
        message: `Select ${keyTitle} Checkbox In Navigation Permission`,
      })
    }
    if (!key.includes('Dashboard') && !key.includes('Navigation')) {
      activeKeyData = [...selectedActivekeys]
    } else if (!key.includes('Navigation') && key.includes('Dashboard')) {
      activeKeyData = [...selectedActivekeys, 'Dashboard']
    } else if (key.includes('Navigation') && !key.includes('Dashboard')) {
      activeKeyData = [...selectedActivekeys, 'Navigation']
    } else activeKeyData = [...selectedActivekeys, 'Navigation', 'Dashboard']

    dispatch({type: SET_COLLAPSE_OPEN, payload: activeKeyData})
  }

  const handleEditCollapse = () => {
    const activeKeys = permissionRole['Navigation']
      .filter((d) => state?.checkedList?.Navigation?.includes(d.name))
      .map((d) => d.label)
    let activeKeyArray = [...activeKeys, 'Navigation', 'Dashboard']
    dispatch({type: SET_COLLAPSE_OPEN, payload: activeKeyArray})
  }

  useEffect(() => {
    if (isEditMode) {
      handleEditCollapse()
    }
  }, [state?.checkedList])

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
