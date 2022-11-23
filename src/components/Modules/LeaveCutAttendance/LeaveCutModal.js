import {Modal, Button, Radio, Form} from 'antd'
import React, {useEffect} from 'react'
const FormItem = Form.Item

const LeaveCutModal = ({open, onSubmit, onClose}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open])

  const handleSubmit = () => {
    onSubmit(form.getFieldValue('leaveType') ?? 1)
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      className="rounded-modal"
      title="Select Leave Cut Day"
      mask={false}
      visible={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form}>
        <FormItem name="leaveType">
          <Radio.Group defaultValue={1}>
            <Radio value={1} checked>
              Full Day
            </Radio>
            <Radio value={2}>Half Day</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default LeaveCutModal
