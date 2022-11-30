import {Button, Form, Input, Modal, Spin} from 'antd'
import React, {useEffect, useState} from 'react'

interface modalInterface {
  isEditMode: boolean
  toggle: boolean
  currentData: any
  duplicateValue: boolean
  setDuplicateValue: (a: boolean) => void
  onSubmit: (leave: {name: string; leaveDays: string}) => void
  onCancel: (setDuplicateValue: any) => void
  isLoading: boolean
  editData: any
}

const layout = {
  // labelCol: { span: 8 },
  // wrapperCol: { span: 16 }
}

function LeaveModal({
  isEditMode,
  toggle,
  currentData,
  onSubmit,
  duplicateValue,
  setDuplicateValue,
  onCancel,
  isLoading,
  editData,
}: modalInterface) {
  const [form] = Form.useForm()

  const [nameChanged, setNameChanged] = useState<boolean | undefined>()

  const formFieldChanges = (values: {name?: string}) => {
    if (values?.hasOwnProperty('name')) {
      if (values?.name?.toLowerCase() === editData?.name?.toLowerCase()) {
        setNameChanged(false)
      } else if (values?.name === editData?.name) {
        setNameChanged(true)
      } else {
        setNameChanged(true)
      }
    }
  }

  const handleSubmit = () => {
    form.validateFields()
    const availableData = currentData?.data?.data?.data?.map(
      (item: {id: any; name: any}) => item?.name?.toLowerCase()
    )
    if (
      !isEditMode &&
      availableData?.includes(form.getFieldValue('name').toLowerCase())
    ) {
      setDuplicateValue(true)
      return
    }
    if (
      isEditMode &&
      nameChanged &&
      availableData
        ?.filter(
          (item: string) =>
            item?.toLowerCase() !== editData?.name?.toLowerCase()
        )
        ?.includes(form.getFieldValue('name').toLowerCase())
    ) {
      setDuplicateValue(true)
      return
    }
    if (
      isEditMode &&
      nameChanged === false &&
      editData?.name !== form.getFieldValue('name') &&
      availableData?.includes(form.getFieldValue('name').toLowerCase())
    ) {
      setDuplicateValue(true)
      return
    }
    form.validateFields().then((values) => onSubmit(form.getFieldsValue()))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode)
        form.setFieldsValue({
          name: editData?.name,
          leaveDays: editData?.leaveDays,
        })
    }
    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      title={isEditMode ? `Update Leave Type` : `Add Leave Type`}
      visible={toggle}
      onOk={handleSubmit}
      onCancel={() => {
        setNameChanged(undefined)
        onCancel(setDuplicateValue)
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setNameChanged(undefined)
            onCancel(setDuplicateValue)
          }}
        >
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
      <Spin spinning={isLoading}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          layout="vertical"
          onValuesChange={(allValues) => formFieldChanges(allValues)}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                whitespace: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) {
                      throw new Error('Leave name is required.')
                    }
                    if (value?.trim() === '') {
                      throw new Error('Please enter a valid name.')
                    }
                    if (value?.trim()?.length < 10) {
                      throw new Error(
                        'Leave name should be at least 10 characters.'
                      )
                    }
                    if (value?.trim()?.length > 1000) {
                      throw new Error(
                        'Leave name cannot exceed more than 100 characters'
                      )
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input
              // value={input}
              placeholder="Name"
              // onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="leaveDays"
            label="Leave Days"
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value)
                      throw new Error('Number of leave days is required.')
                    if (value < 0) {
                      throw new Error('Leave Days cannot be negative.')
                    }
                    if (value < 1) {
                      throw new Error('At least 1 leave day is required.')
                    }
                    if (value - Math.floor(value) !== 0) {
                      throw new Error('Leave Days cannot be decimal.')
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input
              // value={input}
              placeholder="Leave days"
              type="number"
              min={1}
              // onChange={handleInputChange}
            />
          </Form.Item>
          {duplicateValue && (
            <p style={{color: 'red'}}>Duplicate values cannot be accepted.</p>
          )}
        </Form>
      </Spin>
    </Modal>
  )
}

export default LeaveModal
