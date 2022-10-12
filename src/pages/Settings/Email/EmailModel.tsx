import {Button, Form, Input, Modal, Spin} from 'antd'
import React, {useEffect} from 'react'

interface modalInterface {
  isEditMode: boolean
  toggle: boolean
  onSubmit: (input: {title: string; body: string; module: string}) => void
  onCancel: React.MouseEventHandler<HTMLElement>
  isLoading: boolean
  editData: any
}

const layout = {
  // labelCol: { span: 8 },
  // wrapperCol: { span: 16 }
}

function EmailModal({
  isEditMode,
  toggle,
  onSubmit,
  onCancel,
  isLoading,
  editData,
}: modalInterface) {
  const [form] = Form.useForm()
  const {TextArea} = Input

  const handleSubmit = () => {
    form.validateFields().then(values => onSubmit(values))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode) {
        form.setFieldValue('title', editData?.title)
        form.setFieldValue('body', editData?.body)
        form.setFieldValue('module', editData?.module)
      }
    }
    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      title={isEditMode ? `Update Email` : `Add Email`}
      visible={toggle}
      onOk={handleSubmit}
      mask={false}
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
            name="title"
            label="Title"
            rules={[{required: true, message: 'Required!'}]}
          >
            <Input
              // value={editData?.title ?? ""}
              placeholder={`Enter Email Title`}
              // onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="module"
            label="Module"
            rules={[{required: true, message: 'Required!'}]}
          >
            <Input
              // value={editData?.title ?? ""}
              placeholder={`Enter Email Module`}
              // onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="body"
            label="Description"
            rules={[
              {required: true, message: 'Required!'},
              {min: 10, message: 'At least 10 characters required'},
            ]}
          >
            <TextArea
              placeholder={`Enter Email Description`}
              rows={10}
              //   value={editData?.content ?? ''}
            />
            {/* // value={input}
							placeholder={type}
							// onChange={handleInputChange}
						/> */}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default EmailModal
