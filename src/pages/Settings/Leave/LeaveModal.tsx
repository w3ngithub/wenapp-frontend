import {Button, Form, Input, Modal, Spin} from 'antd'
import React, {useEffect} from 'react'

interface modalInterface {
  isEditMode: boolean
  toggle: boolean
  onSubmit: (leave: {name: string; leaveDays: string}) => void
  onCancel: React.MouseEventHandler<HTMLElement>
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
  onSubmit,
  onCancel,
  isLoading,
  editData,
}: modalInterface) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
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
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={isLoading}>
        <Form {...layout} form={form} name="control-hooks" layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{required: true, message: 'Required!'}]}
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
                validator: async (rule, value) => {
                  try {
                    if (!value) throw new Error('Required!')
                    if (value < 0) {
                      throw new Error('Leave Days cannot be negative.')
                    }
                    if (value < 1) {
                      throw new Error('At least 1 leave day is required.')
                    }
                    if(value - Math.floor(value) !== 0){
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
              type='number'
              min={1}
              // onChange={handleInputChange}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default LeaveModal
