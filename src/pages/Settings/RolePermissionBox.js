import React, {useEffect, useContext, useState} from 'react'
import {Checkbox, Col, Collapse, Divider, Row} from 'antd'
import {RolePermissionContext} from 'context/RolePermissionConext'
import {
  CHANGE_SINGLE_CHECKBOX,
  GLOBAL_SELECT_ALL,
  SELECT_ALL_CHECKBOX,
} from 'constants/RolePermission'

const {Panel} = Collapse

const RolePermissionBox = ({
  data,
  title,
  allAccess,
  handleDefaultKeys,
  handleOpenCollapse,
}) => {
  const arrayDatas = data?.map((d) => d.name)
  let emptyArray = []
  const {state, dispatch} = useContext(RolePermissionContext)

  const onChange = (list) => {
    dispatch({
      type: CHANGE_SINGLE_CHECKBOX,
      payload: {
        checkedList: {title, list},
        emptyObj: {[title]: list},
        indeterminate: {
          title,
          check: !!list.length && list.length < arrayDatas.length,
        },
        checkAll: {title, check: list.length === arrayDatas.length},
      },
    })
    handleDefaultKeys(title, list)
  }
  const onCheckAllChange = (e) => {
    let activeData = e.target.checked ? data.map((d) => d.name) : []
    handleDefaultKeys(title, activeData)
    dispatch({
      type: SELECT_ALL_CHECKBOX,
      payload: {
        checkedList: e.target.checked
          ? {title, list: arrayDatas}
          : {title, list: emptyArray},
        indeterminate: {title, check: false},
        checkAll: {title, check: e.target.checked},
      },
    })
  }

  useEffect(() => {
    if (allAccess) {
      let activeData = data.map((d) => d.name)
      handleDefaultKeys(title, activeData)
      dispatch({
        type: GLOBAL_SELECT_ALL,
        payload: {
          checkAll: {title, check: true},
          indeterminate: {title, check: false},
          checkedList: {title, list: arrayDatas},
        },
      })
    }
  }, [allAccess])

  return (
    <Collapse
      activeKey={state?.defauleCollapseOpen}
      onChange={(key) => handleOpenCollapse(key)}
      style={{marginBottom: '20px'}}
    >
      <Panel header={`${title} permisson`} key={`${title}`}>
        <div className="role-box">
          <div className="role-box-header">
            <p>
              <span className="role-box-title">{title} permisson</span>
            </p>
            <Checkbox
              indeterminate={
                state?.indeterminate?.[title]
                  ? state?.indeterminate[title]
                  : false
              }
              onChange={onCheckAllChange}
              checked={state?.checkAll?.[title] ?? false}
            >
              Select All
            </Checkbox>
          </div>
          <Divider />
          <Checkbox.Group
            value={state?.checkedList?.[title]}
            onChange={onChange}
          >
            <Row gutter={[6, 10]}>
              {data?.map((d) => (
                <Col span={12} spacing>
                  <Checkbox value={d.name}>{d.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </Panel>
    </Collapse>
  )
}

export default RolePermissionBox
