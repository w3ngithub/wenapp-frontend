import {Button, DatePicker, Form, Input, InputNumber, Modal, Spin} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import React, {useEffect} from 'react'
import {Row} from 'antd'
import {Col} from 'antd'
import moment from 'moment'
import {notification} from 'helpers/notification'

interface modalInterface {
  isEditMode: boolean
  toggle: boolean
  onSubmit: (leave: {name: string; leaveDays: string}) => void
  onCancel: React.MouseEventHandler<HTMLElement>
  isLoading: boolean
  editData: any
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
    const values = form.getFieldsValue()
    const quarters = values?.quaterlyLeaves?.map((d: any) => {
      if (!!d) {
        const valueArray = Object.values(d)
        const isValuePresent = valueArray.some((d) => !!d === true)
        return isValuePresent
      } else return false
    })

    form.validateFields().then((values) => {
      if (quarters?.length === 0) {
        return notification({type: 'info', message: 'Please Add Quarters'})
      }
      const quaterTempLeaves = values?.quaterlyLeaves?.map((data: any) => ({
        quarterName: data?.quarterName,
        fromDate: moment.utc(data?.firststartDate).startOf('day').format(),
        toDate: moment.utc(data?.firstendDate).startOf('day').format(),
        leaves: data?.leaves,
      }))
      onSubmit(quaterTempLeaves)
    })
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode)
        form.setFieldsValue({
          quaterlyLeaves: editData?.quarters?.map((quarterData: any) => ({
            ...quarterData,
            firststartDate: moment(quarterData.fromDate),
            firstendDate: moment(quarterData.toDate),
          })),
        })
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
        <Row
          style={{
            columnGap: 5,
            marginBottom: '0.4rem',
          }}
        >
          <Col lg={6} md={6} sm={6} xs={6}>
            <label>Quarter</label>
          </Col>
          <Col lg={5} md={5} sm={5} xs={5}>
            <label>Start</label>
          </Col>
          <Col lg={5} md={5} sm={5} xs={5}>
            <label>End</label>
          </Col>
          <Col lg={5} md={5} sm={5} xs={5}>
            <label style={{whiteSpace: 'nowrap'}}>Leaves</label>
          </Col>
        </Row>
        <Form form={form} layout="horizontal">
          <Form.List name="quaterlyLeaves" initialValue={[null]}>
            {(fields, {add, remove}) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      marginLeft: 1,
                      columnGap: 5,
                    }}
                  >
                    <Col span={6} sm={6} md={6} lg={6} xs={5}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'quarterName']}
                        rules={[
                          {
                            required: true,
                            validator: async (rule, value) => {
                              try {
                                if (!value) {
                                  throw new Error('Required!')
                                }
                                const regex = /^[^*|\":<>[\]{}`\\';@&$!#%^]+$/
                                const isValid = regex.test(value)
                                if (value.trim().length === 0) {
                                  throw new Error('Please enter a valid Name.')
                                }

                                if (
                                  value?.split('')[0] === '-' ||
                                  value?.split('')[0] === '(' ||
                                  value?.split('')[0] === ')' ||
                                  !isValid
                                ) {
                                  throw new Error(
                                    'Please do not use special characters.'
                                  )
                                }
                              } catch (err) {
                                throw new Error(err.message)
                              }
                            },
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={5} sm={5} md={5} lg={5}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'firststartDate']}
                        // rules={[{required: true, message: 'Required!'}]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            validator: async (rule, value) => {
                              console.log(
                                form.getFieldValue([
                                  'quaterlyLeaves',
                                  field.name - 1,
                                  'firstendDate',
                                ])
                              )
                              try {
                                if (!value) {
                                  throw new Error('Required!')
                                }
                                if (
                                  value.isAfter(
                                    form
                                      .getFieldValue([
                                        'quaterlyLeaves',
                                        field.name,
                                        'firstendDate',
                                      ])
                                      ?.endOf('day')
                                  ) &&
                                  form.getFieldValue([
                                    'quaterlyLeaves',
                                    field.name,
                                    'firstendDate',
                                  ])
                                ) {
                                  throw new Error(
                                    'Start Date should be before End Date.'
                                  )
                                }
                                if (
                                  field.name > 0 &&
                                  value.isBefore(
                                    form
                                      .getFieldValue([
                                        'quaterlyLeaves',
                                        field.name - 1,
                                        'firstendDate',
                                      ])
                                      ?.endOf('day')
                                  ) &&
                                  form.getFieldValue([
                                    'quaterlyLeaves',
                                    field.name - 1,
                                    'firstendDate',
                                  ])
                                ) {
                                  throw new Error(
                                    `Start Date should be after ${form.getFieldValue(
                                      [
                                        'quaterlyLeaves',
                                        field.name - 1,
                                        'quarterName',
                                      ]
                                    )} `
                                  )
                                }
                              } catch (err) {
                                throw new Error(err.message)
                              }
                            },
                          },
                        ]}
                      >
                        <DatePicker className=" gx-w-100" />
                      </Form.Item>
                    </Col>
                    <Col span={5} sm={5} md={5} lg={5}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'firstendDate']}
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
                                      .getFieldValue([
                                        'quaterlyLeaves',
                                        field.name,
                                        'firststartDate',
                                      ])
                                      ?.endOf('day')
                                  ) &&
                                  form.getFieldValue([
                                    'quaterlyLeaves',
                                    field.name,
                                    'firststartDate',
                                  ])
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
                        <DatePicker className=" gx-w-100" />
                      </Form.Item>
                    </Col>
                    <Col span={4} sm={3} md={4} lg={4} xs={4}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'leaves']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            validator: async (rule, value) => {
                              try {
                                if (!value) {
                                  throw new Error('Required!')
                                }
                                if (value < 1 || value > 20) {
                                  throw new Error(
                                    'Please  enter number between 1 and 20'
                                  )
                                }
                              } catch (err) {
                                throw new Error(err.message)
                              }
                            },
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={2} sm={1} md={2} lg={2} xs={1}>
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        style={{marginBottom: 20, marginTop: 10}}
                        className="svg-clear"
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add More
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  )
}

export default LeaveQuarterModal
