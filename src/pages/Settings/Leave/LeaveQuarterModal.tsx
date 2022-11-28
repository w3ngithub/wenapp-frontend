import {Button, DatePicker, Form, Input, Modal, Spin} from 'antd'
import React, {useEffect} from 'react'
import {Row} from 'antd'
import {Col} from 'antd'
import moment from 'moment'

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

function LeaveQuarterModal({
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
      if (isEditMode) {
        const {firstQuarter, secondQuarter, thirdQuarter, fourthQuarter} =
          editData
        form.setFieldsValue({
          firstendDate: moment(firstQuarter?.toDate),
          firststartDate: moment(firstQuarter?.fromDate),
          secondendDate: moment(secondQuarter?.toDate),
          secondstartDate: moment(secondQuarter?.fromDate),
          thirdstartDate: moment(thirdQuarter?.fromDate),
          thirdendDate: moment(thirdQuarter?.toDate),
          fourthstartDate: moment(fourthQuarter?.fromDate),
          fourthendDate: moment(fourthQuarter?.toDate),
          firstleaves: firstQuarter?.leaves,
          secondleaves: secondQuarter?.leaves,
          thirdleaves: thirdQuarter?.leaves,
          fourthleaves: fourthQuarter?.leaves,
        })
      }
    }
    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      width={800}
      title={isEditMode ? `Update Leave Quarter` : `Add Leave Quarters`}
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
        <div className="leaveQuarterForm">
          <Form form={form} layout="horizontal">
            <Row>
              {' '}
              <div className="gx-mb-1">First Quarter</div>
            </Row>
            <Row>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="firststartDate"
                  label="Start"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="firstendDate"
                  label="End"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form.getFieldValue('firststartDate')?.endOf('day')
                            ) &&
                            form.getFieldValue('firststartDate')
                          ) {
                            throw new Error(
                              'End Date should be after Start Date.'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="firstleaves"
                  label="Leaves"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {' '}
              <div className="gx-mb-1">Second Quarter</div>
            </Row>
            <Row>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="secondstartDate"
                  label="Start"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value <
                              form
                                .getFieldValue('firstendDate')
                                ?.endOf('day') &&
                            form.getFieldValue('firstendDate')
                          ) {
                            throw new Error(
                              'Second quarter should start after first quarter ends'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="secondendDate"
                  label="End"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form
                                .getFieldValue('secondstartDate')
                                ?.endOf('day')
                            ) &&
                            form.getFieldValue('secondstartDate')
                          ) {
                            throw new Error(
                              'End Date should be after Start Date.'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="secondleaves"
                  label="Leaves"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {' '}
              <div className="gx-mb-1">Third Quarter</div>
            </Row>

            <Row>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="thirdstartDate"
                  label="Start"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form.getFieldValue('secondendDate')?.endOf('day')
                            ) &&
                            form.getFieldValue('secondendDate')
                          ) {
                            throw new Error(
                              'Third quarter should start after second quarter ends'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="thirdendDate"
                  label="End"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form.getFieldValue('thirdstartDate')?.endOf('day')
                            ) &&
                            form.getFieldValue('thirdstartDate')
                          ) {
                            throw new Error(
                              'End Date should be after Start Date.'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="thirdleaves"
                  label="Leaves"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {' '}
              <div className="gx-mb-1">Fourth Quarter</div>
            </Row>
            <Row>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="fourthstartDate"
                  label="Start"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form.getFieldValue('thirdendDate')?.endOf('day')
                            ) &&
                            form.getFieldValue('thirdendDate')
                          ) {
                            throw new Error(
                              'Fourth quarter should start after third quarter ends'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="fourthendDate"
                  label="End"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: async (rule, value) => {
                        try {
                          if (!value) {
                            throw new Error('Required!')
                          }
                          if (
                            value.isBefore(
                              form
                                .getFieldValue('fourthstartDate')
                                ?.endOf('day')
                            ) &&
                            form.getFieldValue('fourthstartDate')
                          ) {
                            throw new Error(
                              'End Date should be after Start Date.'
                            )
                          }
                        } catch (err) {
                          throw new Error(err.message)
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} md={8}>
                <Form.Item
                  name="fourthleaves"
                  label="Leaves"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

export default LeaveQuarterModal
