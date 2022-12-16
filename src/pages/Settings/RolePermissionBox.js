import React, {useEffect, useState, useContext} from 'react'
import {Checkbox, Col, Divider, Form, Row} from 'antd'
import {RolePermissionContext} from 'context/RolePermissionConext'

const RolePermissionBox = ({
  data,
  title,
  setEmptyObj,
  checkedAllRoles,
  allAccess,
  toggle,
}) => {
  // const [form] = Form.useForm()
  console.log('from toggle', toggle)
  const arrayDatas = data?.map((d) => d.label)

  const [checkedList, setCheckedList] = useState([])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const {state, dispatch} = useContext(RolePermissionContext)
  console.log('state frin rayksf sfkhsdkjfhkjashf kjs', state)

  const onChange = (list) => {
    setCheckedList(list)
    setEmptyObj((prev) => ({...prev, [title]: list}))
    setIndeterminate(!!list.length && list.length < arrayDatas.length)
    setCheckAll(list.length === arrayDatas.length)
    // dispatch({
    //   type: 'CHANGE_SINGLE_CHECKBOX',
    //   payload: {
    //     checkedList: list,
    //     emptyObj: {[title]: list},
    //     indeterminate: !!list.length && list.length < arrayDatas.length,
    //     checkAll: list.length === arrayDatas.length,
    //   },
    // })
  }
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? arrayDatas : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    if (e.target.checked)
      setEmptyObj((prev) => ({...prev, [title]: arrayDatas}))
    else setEmptyObj((prev) => ({...prev, [title]: []}))
  }

  useEffect(() => {
    if (checkedAllRoles && allAccess) {
      console.log('hello world from final component')
      setCheckAll(true)
      setIndeterminate(false)
      setCheckedList(arrayDatas)
      setEmptyObj((prev) => ({...prev, [title]: arrayDatas}))
    } else if (!checkedAllRoles) {
      console.log('hello world from final component false')
      setCheckAll(false)
      setIndeterminate(true)
      setCheckedList([])
      setEmptyObj([])
    }
  }, [checkedAllRoles, allAccess])

  useEffect(() => {
    if (toggle) {
      console.log('hello world from toggle')
      setCheckAll(false)
      setIndeterminate(true)
      setCheckedList([])
      setEmptyObj([])
    }
  }, [toggle])

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
          interminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Select All
        </Checkbox>
      </div>
      <Divider />
      <Checkbox.Group value={checkedList} onChange={onChange}>
        <Row gutter={[6, 10]}>
          {data?.map((d) => (
            <Col span={12} spacing>
              <Checkbox value={d.label}>{d.label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  )
}

export default RolePermissionBox
