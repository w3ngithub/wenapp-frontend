import React, {useState, useEffect, useContext} from 'react'
import {Button, Form, Input, Modal, Spin, Checkbox} from 'antd'
import CommonRolePermission from './CommonRolePermission'
import {permissionRole} from 'constants/RolePermission'
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
  const [emptyObj, setEmptyObj] = useState<any>({})
  const [checkedAllRoles, setCheckedAllRoles] = useState<boolean>(false)
  const [allAccess, setAllAccess] = useState<boolean>(false)
  const {state, dispatch} = useContext(RolePermissionContext)

  let rolePermissions: any = permissionRole

  useEffect(() => {
    let data = Object.keys(rolePermissions)
    let allRoles: any = []
    data.forEach((d) => {
      if (rolePermissions[d]?.length !== emptyObj[d]?.length) {
        allRoles.push(true)
      }
    })
    if (allRoles.includes(true)) {
      setAllAccess(false)
    } else setAllAccess(true)
  }, [emptyObj])

  const handleSubmit = () => {
    let PayloadData = Object.keys(rolePermissions)
    let finalObj = PayloadData.map((d) => {
      return rolePermissions[d].reduce((prevObj: any, currentObj: any) => {
        if (d in emptyObj) {
          return Object.assign(prevObj, {
            [currentObj.name]: emptyObj[d]?.includes(currentObj.label),
          })
        } else {
          return Object.assign(prevObj, {
            [currentObj.name]: false,
          })
        }
      }, {})
    })

    let permission = {}
    PayloadData.forEach((d, i) => {
      permission = {
        ...permission,
        [d]: finalObj[i],
      }
    })
    let payloadData: any = {
      key: form.getFieldValue('name').toLowerCase().replaceAll(' ', ''),
      value: form.getFieldValue('name'),
      permission: JSON.stringify([permission]),
    }
    form.validateFields().then(() => onSubmit(payloadData))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode) form.setFieldValue('name', editData?.name)
    }
    if (!toggle) {
      form.resetFields()
      setEmptyObj([])
      setCheckedAllRoles(false)
    }
  }, [toggle])

  // console.log('checkedAllRoles', checkedAllRoles)
  // console.log('toggle', toggle)
  // console.log('empty', emptyObj)

  return (
    <Modal
      title={isEditMode ? `Update Role` : `Add Role`}
      visible={toggle}
      onOk={handleSubmit}
      mask={false}
      width={width}
      onCancel={(value) => {
        console.log('cancel value', value)
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
      <Form
        form={form}
        name="control-hooks"
        layout="vertical"
        style={{width: '500'}}
      >
        <Form.Item
          name="name"
          label="Role"
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
      </Form>
      <div>
        <CommonRolePermission
          setEmptyObj={setEmptyObj}
          checkedAllRoles={checkedAllRoles}
          allAccess={allAccess}
          toggle={toggle}
        />
      </div>

      {duplicateValue && (
        <p style={{color: 'red'}}>Duplicate values cannot be accepted.</p>
      )}
    </Modal>
  )
}

export default RolePermissionModal
