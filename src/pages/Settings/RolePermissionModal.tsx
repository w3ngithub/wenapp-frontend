import React, {useState, useEffect, useContext} from 'react'
import {Button, Form, Input, Modal, Spin, Checkbox} from 'antd'
import CommonRolePermission from './CommonRolePermission'
import {permissionRole, RESET, SET_EDIT_DATA} from 'constants/RolePermission'
import {RolePermissionContext} from 'context/RolePermissionConext'

interface modalInterface {
  toggle: boolean
  duplicateValue: boolean
  setDuplicateValue: (a: boolean) => void
  onSubmit: (name: string) => void
  onCancel: (setDuplicateValue: any) => void
  width: number
  isLoading: boolean
  isEditMode: boolean
  editData: any
  currentData: any
}
const RolePermissionModal = ({
  toggle,
  onSubmit,
  onCancel,
  duplicateValue,
  setDuplicateValue,
  width,
  currentData,
  isEditMode,
  editData,
  isLoading,
}: modalInterface) => {
  const [form] = Form.useForm()
  const [checkedAllRoles, setCheckedAllRoles] = useState<boolean>(false)
  const [allAccess, setAllAccess] = useState<boolean>(false)
  const {state, dispatch} = useContext(RolePermissionContext)

  let rolePermissions: any = permissionRole

  const formattingFunc = (data: any) => {
    let formattedData: any
    data.forEach((d: any) => {
      formattedData = {
        ...formattedData,
        ...d,
      }
    })
    return formattedData
  }

  useEffect(() => {
    let data = Object.keys(rolePermissions)
    let allRoles: any = []
    data.forEach((d) => {
      if (rolePermissions[d]?.length !== state?.checkedList?.[d]?.length) {
        allRoles.push(true)
      }
    })
    if (allRoles.includes(true)) {
      setAllAccess(false)
    } else setAllAccess(true)
  }, [state.checkedList])

  const handleSubmit = () => {
    let payloadData = Object.keys(rolePermissions)
    let finalObj = payloadData.map((d) => {
      return {
        [d]: rolePermissions[d].reduce((prevObj: any, currentObj: any) => {
          if (d in state.checkedList) {
            return Object.assign(prevObj, {
              [currentObj.name]: state.checkedList[d]?.includes(
                currentObj.name
              ),
            })
          } else {
            return Object.assign(prevObj, {
              [currentObj.name]: false,
            })
          }
        }, {}),
      }
    })

    let permission = formattingFunc(finalObj)

    let payloadDatas: any = {
      key: form.getFieldValue('name').toLowerCase().replaceAll(' ', ''),
      value: form.getFieldValue('name'),
      permission: JSON.stringify([permission]),
    }

    form.validateFields().then(() => onSubmit(payloadDatas))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode) {
        const permission = editData?.hasOwnProperty('permission')
          ? JSON.parse(editData?.permission || '{}')
          : ''

        let editedCheckData = Object.keys(permission[0] || []).map((d) => {
          const editCheck = Object.keys(permission[0][d]).filter((x) => {
            if (permission[0][d][x]) return x
          })
          return {
            [d]: editCheck,
          }
        })

        let editCheckAllData = Object.keys(permission[0] || []).map((d) => {
          const editCheck = Object.keys(permission[0][d]).filter((x) => {
            if (permission[0][d][x]) return x
          })
          return {
            [d]: Object.keys(permission[0][d]).length === editCheck.length,
          }
        })

        let editIndeterminate = Object.keys(permission[0] || []).map((d) => {
          const editCheck = Object.keys(permission[0][d]).filter((x) => {
            if (permission[0][d][x]) return x
          })
          return {
            [d]:
              !!editCheck.length &&
              editCheck.length < Object.keys(permission[0][d]).length,
          }
        })

        let dataChecked = formattingFunc(editedCheckData)
        let dataCheckedAll = formattingFunc(editCheckAllData)
        let dataIndeterminate = formattingFunc(editIndeterminate)

        dispatch({
          type: SET_EDIT_DATA,
          payload: {
            checkedList: dataChecked,
            checkAll: dataCheckedAll,
            indeterminate: dataIndeterminate,
          },
        })

        form.setFieldValue('name', editData?.name)
      }
    }
    if (!toggle) {
      form.resetFields()
      dispatch({type: RESET})
    }
  }, [toggle])

  return (
    <Modal
      title={isEditMode ? `Update Role` : `Add Role`}
      visible={toggle}
      onOk={handleSubmit}
      mask={false}
      width={width}
      onCancel={(value) => {
        onCancel(setDuplicateValue)
      }}
      footer={[
        <Button key="back" onClick={() => onCancel(setDuplicateValue)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form form={form} name="control-hooks" style={{width: '500'}}>
        <div className="role-box-header">
          <Form.Item
            name="name"
            label="Role"
            style={{width: '20%', marginLeft: '15px'}}
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) {
                      throw new Error(`Role is required.`)
                    }
                    if (value?.trim() === '') {
                      throw new Error(`Please enter a valid role.`)
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input placeholder={'Enter Role'} />
          </Form.Item>
          <Checkbox
            onChange={() => {
              setCheckedAllRoles(!allAccess)
              setAllAccess(!allAccess)
            }}
            checked={allAccess}
          >
            Select All
          </Checkbox>
        </div>
      </Form>
      <div>
        <CommonRolePermission
          checkedAllRoles={checkedAllRoles}
          allAccess={allAccess}
        />
      </div>
      {duplicateValue && (
        <p style={{color: 'red'}}>Duplicate values cannot be accepted.</p>
      )}
    </Modal>
  )
}

export default RolePermissionModal
