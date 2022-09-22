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
    form.validateFields().then(values => onSubmit(form.getFieldsValue()))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode) {
        const {firstQuarter, secondQuarter, thirdQuarter} = editData
        form.setFieldsValue({
          firstendDate: moment(firstQuarter.toDate),
          firststartDate: moment(firstQuarter.fromDate),
          secondendDate: moment(secondQuarter.toDate),
          secondstartDate: moment(secondQuarter.fromDate),
          thirdstartDate: moment(thirdQuarter.fromDate),
          thirdendDate: moment(thirdQuarter.toDate),
        })
      }
    }
    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
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
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="firststartDate"
                  label="Start"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="firstendDate"
                  label="End"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {' '}
              <div className="gx-mb-1">Second Quarter</div>
            </Row>
            <Row>
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="secondstartDate"
                  label="Start"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="secondendDate"
                  label="End"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {' '}
              <div className="gx-mb-1">Third Quarter</div>
            </Row>

            <Row>
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="thirdstartDate"
                  label="Start"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={12} xs={24} md={12}>
                <Form.Item
                  name="thirdendDate"
                  label="End"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <DatePicker />
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
