import {Button, Form, Input, Modal, Spin} from 'antd'
import React, {useEffect} from 'react'

interface modalInterface {
  isEditMode: boolean
  toggle: boolean
  currentData: any
  duplicateValue: boolean,
  setDuplicateValue:(a:boolean)=>void
  onSubmit: (name: string) => void
  onCancel: (setDuplicateValue: any) => void
  type: string
  isLoading: boolean
  editData: any
}

const layout = {
  // labelCol: { span: 8 },
  // wrapperCol: { span: 16 }
}

function CommonLogTimeModal({
  isEditMode,
  toggle,
  currentData,
  onSubmit,
  setDuplicateValue,
  duplicateValue,
  onCancel,
  type,
  isLoading,
  editData,
}: modalInterface) {
  const [form] = Form.useForm()
  const handleSubmit = () => {
    form.validateFields();
    let availableData
    if (currentData?.hasOwnProperty('data')) {
      availableData = currentData?.data?.data?.data?.map(
        (item: {id: any; name: any}) => item?.name?.toLowerCase()
      )
    } else {
      availableData = currentData.map((item: {id: any; name: any}) =>
        item?.name?.toLowerCase()
      )
    }
    if (availableData?.includes(form.getFieldValue('name').toLowerCase())) {
      setDuplicateValue(true)
      return
    }
    form.validateFields().then((values) => onSubmit(form.getFieldValue('name')))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode) form.setFieldValue('name', editData?.name)
    }
    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      title={isEditMode ? `Update ${type}` : `Add ${type}`}
      visible={toggle}
      onOk={handleSubmit}
      mask={false}
      onCancel={() => onCancel(setDuplicateValue)}
      footer={[
        <Button key="back" onClick={() => onCancel(setDuplicateValue)}>
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
            label={type}
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) {
                      throw new Error(`${type} is required.`)
                    }
                    if(value?.trim() === ''){
                      throw new Error(`Please enter a valid ${type}.`)
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
              placeholder={type}
              // onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Select Color"
            rules={[{required:true, message:'Color for log type is required.'}]}
          >
            <Input />
          </Form.Item>
          {duplicateValue && (
            <p style={{color: 'red'}}>Duplicate values cannot be accepted.</p>
          )}
        </Form>
      </Spin>
    </Modal>
  )
}

export default CommonLogTimeModal
