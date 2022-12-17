import React, {useEffect, useContext} from 'react'
import {Checkbox, Col, Divider, Row} from 'antd'
import {RolePermissionContext} from 'context/RolePermissionConext'
import {
  CHANGE_SINGLE_CHECKBOX,
  GLOBAL_SELECT_ALL,
  RESET,
  SELECT_ALL_CHECKBOX,
} from 'constants/RolePermission'

const RolePermissionBox = ({data, title, checkedAllRoles, allAccess}) => {
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
  }
  const onCheckAllChange = (e) => {
    dispatch({
      type: SELECT_ALL_CHECKBOX,
      payload: {
        checkedList: e.target.checked
          ? {title, list: arrayDatas}
          : {title, list: emptyArray},
        indeterminate: {title, check: false},
        checkAll: {title, check: e.target.checked},
        emptyObj: e.target.checked
          ? {[title]: arrayDatas}
          : {[title]: emptyArray},
      },
    })
  }

  useEffect(() => {
    if (checkedAllRoles && allAccess) {
      dispatch({
        type: GLOBAL_SELECT_ALL,
        payload: {
          checkAll: {title, check: true},
          indeterminate: {title, check: false},
          checkedList: {title, list: arrayDatas},
          emptyObj: {[title]: arrayDatas},
        },
      })
    } else if (!checkedAllRoles) {
      dispatch({type: RESET})
    }
  }, [checkedAllRoles, allAccess])

  return (
    <div
      style={{
        backgroundColor: 'rgb(3 143 222 / 10%)',
        padding: '20px',
        borderRadius: '4px',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <p>
          <span style={{fontWeight: '500', fontSize: '16px'}}>{title}</span>{' '}
          permisson
        </p>
        <Checkbox
          indeterminate={state.indeterminate[title]}
          onChange={onCheckAllChange}
          checked={state.checkAll[title]}
        >
          Select All
        </Checkbox>
      </div>
      <Divider />
      <Checkbox.Group value={state.checkedList[title]} onChange={onChange}>
        <Row gutter={[6, 10]}>
          {data?.map((d) => (
            <Col span={12} spacing>
              <Checkbox value={d.name}>{d.label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  )
}

export default RolePermissionBox
