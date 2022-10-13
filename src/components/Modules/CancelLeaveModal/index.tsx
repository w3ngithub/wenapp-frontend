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

function CancelLeaveModal({
  open,
  onClose,
  onSubmit,
  leaveData,
  loader,
  setLoader,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (param: any) => any
  leaveData: {}
  loader: boolean
  setLoader: (param: boolean) => void
}) {
  const [form] = Form.useForm()
  const {themeType} = useSelector((state: any) => state.settings)
  const darkCalendar = themeType === THEME_TYPE_DARK

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open])

  const onFinish = (values: any) => {
    form.validateFields().then(values => {
      setLoader(true)
      onSubmit({...leaveData, ...values})
    })
  }

  return (
    <Modal
      width={1100}
      title="Cancel Leave"
      style={{flexDirection: 'row'}}
      visible={open}
      mask={false}
      onOk={onFinish}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onFinish}>
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={loader}>
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
                name="leaveCancelReason"
                label="Cancel Leave Reason"
                rules={[
                  {
                    required: true,
                    validator: async (rule, value) => {
                      try {
                        if (!value) throw new Error('Required!')

                        const trimmedValue = value && value.trim()
                        if (trimmedValue?.length < 10) {
                          throw new Error(
                            'Reason should be at least 10 letters!'
                          )
                        }
                      } catch (err) {
                        throw new Error(err.message)
                      }
                    },
                  },
                ]}
              >
                <Input.TextArea
                  allowClear
                  rows={10}
                  style={{
                    background: darkCalendar ? '#434f5a' : '',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default CancelLeaveModal
