import React, {useEffect, useState} from 'react'
import '@ant-design/compatible/assets/index.css'
import {Button, DatePicker, Input, Modal, Select, Spin, Form} from 'antd'
import moment from 'moment'
import DragAndDropFile from 'components/Modules/DragAndDropFile'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: {span: 0},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 0},
    sm: {span: 16},
  },
}

function UserProfileModal({user, toggle, onToggle, onSubmit, isLoading}) {
  const [form] = Form.useForm()
  const [files, setFiles] = useState([])
  const [removedFile, setRemovedFile] = useState(null)

  const handleCancel = () => {
    form.resetFields()
    setFiles([])
    onToggle()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) =>
      onSubmit(
        {
          ...values,
          photoURL: files.length > 0 ? files[0] : null,
        },
        removedFile
      )
    )
  }

  useEffect(() => {
    if (toggle) {
      form.setFieldsValue({
        name: user.name,
        dob: moment(user.dob),
        gender: user.gender,
        primaryPhone: String(user.primaryPhone),
        secondaryPhone: String(user.secondaryPhone || ''),
        joinDate: moment(user.joinDate),
        maritalStatus: user.maritalStatus,
      })
      setFiles(
        user?.photoURL
          ? [{uid: '1', url: user?.photoURL, name: 'Profile Photo'}]
          : []
      )
    }

    if (!toggle) {
      setFiles([])
      setRemovedFile(null)
    }
  }, [toggle])
  return (
    <Modal
      title="Details"
      visible={toggle}
      onOk={handleSubmit}
      onCancel={handleCancel}
      mask={false}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={isLoading}>
        <Form form={form}>
          <FormItem
            {...formItemLayout}
            label="Name"
            hasFeedback
            name="name"
            rules={[{required: true, message: 'Required!'}]}
          >
            <Input placeholder="Enter Name" />
          </FormItem>
          <FormItem {...formItemLayout} label="Profile Photo">
            <DragAndDropFile
              files={files}
              setFiles={setFiles}
              onRemove={setRemovedFile}
              displayType="picture-card"
              allowMultiple={false}
              accept="image/png, image/jpeg"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="DOB"
            hasFeedback
            name="dob"
            rules={[
              {
                type: 'object',
                required: true,
                message: 'required!',
                whitespace: true,
              },
            ]}
          >
            <DatePicker className=" gx-w-100" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Gender"
            hasFeedback
            name="gender"
            rules={[
              {
                required: true,
                message: 'Required!',
                whitespace: true,
              },
            ]}
          >
            <Select placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Primary Phone"
            hasFeedback
            name="primaryPhone"
            rules={[
              {
                required: true,
                message: 'Required!',
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Enter Primary Phone" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Secondary Phone"
            name="secondaryPhone"
            rules={[
              {
                message: 'field must be a number!',
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Enter Secondary Phone" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Join Date"
            hasFeedback
            name="joinDate"
            rules={[
              {
                type: 'object',
                required: true,
                message: 'Required!',
                whitespace: true,
              },
            ]}
          >
            <DatePicker className=" gx-w-100" disabled={true} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Marital Status"
            hasFeedback
            name="maritalStatus"
            rules={[
              {
                required: true,
                message: 'Required!',
                whitespace: true,
              },
            ]}
          >
            <Select placeholder="Select Marital Status">
              <Option value="Married">Married</Option>
              <Option value="Unmarried">Unmarried</Option>
            </Select>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

export default UserProfileModal
