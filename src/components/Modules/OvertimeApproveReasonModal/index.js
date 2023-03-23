import React, {useEffect, useState} from 'react'
import {Button, Modal, Form, Input, Row, Col, Spin} from 'antd'
import 'moment/locale/en-gb'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import {useSelector} from 'react-redux'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import useWindowsSize from 'hooks/useWindowsSize'

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}

const formItemLayout = {
  labelCol: {
    xs: {span: 0},
    sm: {span: 16},
  },
  wrapperCol: {
    xs: {span: 0},
    sm: {span: 24},
  },
}

function OvertimeApproveReasonModal({
  open,
  onClose,
  approveReason,
  title = '',
  label = '',
  name = '',
}) {
  const [form] = Form.useForm()
  const {themeType} = useSelector((state) => state.settings)
  const darkCalendar = themeType === THEME_TYPE_DARK

  useEffect(() => {
    form.setFieldsValue({overtimeApproveReason: approveReason})
    if (!open) {
      form.resetFields()
    }
  }, [open])

  return (
    <Modal
      width={1100}
      title={title}
      style={{flexDirection: 'row'}}
      visible={open}
      mask={false}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        layout="vertical"
        className="padding-lt-0"
      >
        <Row>
          <Col xs={24} sm={24} xl={24}>
            <Form.Item
              {...formItemLayout}
              label={label}
              name="overtimeApproveReason"
            >
              <Input.TextArea
                disabled={true}
                allowClear
                rows={10}
                defaultValue={approveReason}
                style={{
                  background: darkCalendar ? '#434f5a' : '',
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default OvertimeApproveReasonModal
