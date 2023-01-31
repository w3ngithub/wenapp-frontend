import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Table,
} from 'antd'
import {EDIT_HOLIDAY_COLUMNS} from 'constants/Holidays'
import {notification} from 'helpers/notification'
import useWindowsSize from 'hooks/useWindowsSize'
import moment from 'moment'
import React, {useEffect, useState} from 'react'

interface modalType {
  dataSource: any
  isEditMode: boolean
  toggle: boolean
  onSubmit: (holiday: any) => void
  onCancel: React.MouseEventHandler<HTMLElement>
  isLoading: boolean
  editData: any
}

interface holidayType {
  date: string
  title: string
  remarks: string
}

const CommonModal = (props: modalType) => {
  const [form] = Form.useForm()
  const {
    isEditMode,
    toggle = true,
    onCancel,
    onSubmit,
    isLoading,
    editData,
    dataSource,
  } = props

  const [indexes, setIndexes] = useState<boolean[]>([])

  const {innerWidth} = useWindowsSize()

  const handleSubmit = () => {
    let values = form.getFieldsValue()
    console.log('holidays values', values)
    // let holidays = values?.holidays?.map(
    //   (data: {date: any; title: string; remarks: string}, index: number) => {
    //     if (data?.date || data?.title || data?.remarks) {
    //       return true
    //     } else return false
    //   }
    // )
    // if (holidays.length === 0) {
    //   return notification({type: 'info', message: 'Please Add Holiday Field'})
    // }
    // if (!holidays.includes(true)) {
    //   holidays[0] = true
    // }
    // setIndexes(holidays)
    // form
    //   .validateFields()
    //   .then((values) => {
    //     onSubmit({
    //       holidays: form
    //         .getFieldsValue()
    //         .holidays.filter((holiday: holidayType) => holiday)
    //         .map((holiday: holidayType) => ({
    //           ...holiday,
    //           date: moment.utc(holiday.date).format(),
    //         })),
    //     })
    //   })
    //   .catch((err) => console.log(err))
  }

  useEffect(() => {
    if (toggle) {
      if (isEditMode)
        form.setFieldsValue({
          holidays: editData?.map((holiday: any) => ({
            ...holiday,
            date: moment(holiday.date),
          })),
        })
    }
    if (!toggle) form.resetFields()
  }, [toggle])

  // useEffect(() => {
  //   if (toggle) {
  //     if (isEditMode)
  //       editData.forEach((item: any, index: number) => {
  //         form.setFieldsValue({
  //           [`${item?._id}date`]: moment(item?.date),
  //           [`${item?._id}title`]: item?.title,
  //           [`${item?._id}remarks`]: item?.remarks,
  //           [`${item?._id}allowLeaveApply`]: item?.allowLeaveApply,
  //         })
  //       })
  //   }
  //   if (!toggle) form.resetFields()
  // }, [toggle])

  return (
    <Modal
      width={900}
      title={isEditMode ? `Update Holidays` : `Add Holidays`}
      visible={toggle}
      onOk={handleSubmit}
      onCancel={onCancel}
      mask={false}
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
        <Form
          form={form}
          name="dynamic_form_nest_item"
          autoComplete="off"
          style={{marginLeft: 10}}
          className="add-holiday"
        >
          {/* <Table
            className="gx-table-responsive"
            columns={EDIT_HOLIDAY_COLUMNS()}
            dataSource={dataSource}
            // onChange={handleTableChange}
            pagination={false}
            loading={isLoading}
          /> */}
          <Row
            style={{
              columnGap: 6,
              marginLeft: innerWidth <= 748 ? '' : '1rem',
            }}
          >
            <Col>
              <label>Date</label>
            </Col>
            <Col>
              <label>Title</label>
            </Col>
            <Col>
              <label>Remarks</label>
            </Col>
            <Col>
              <label>Allow Leave Application</label>
            </Col>
          </Row>
          <Form.List
            name="holidays"
            initialValue={[
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]}
          >
            {(fields, {add, remove}) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      columnGap: 6,
                      marginLeft: innerWidth <= 748 ? '' : '1rem',
                    }}
                  >
                    <Col span={24} sm={7}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.area !== curValues.area ||
                          prevValues.sights !== curValues.sights
                        }
                      >
                        <Form.Item
                          {...field}
                          // label="Date"
                          name={[field.name, 'date']}
                          required={false}
                          rules={[
                            {
                              required: indexes[index],
                              message: 'Date is required.',
                            },
                          ]}
                        >
                          <DatePicker className=" gx-w-100" />
                        </Form.Item>
                      </Form.Item>
                    </Col>
                    <Col span={24} sm={7}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.area !== curValues.area ||
                          prevValues.sights !== curValues.sights
                        }
                      >
                        <Form.Item
                          {...field}
                          // label="Title"
                          name={[field.name, 'title']}
                          required={false}
                          rules={[
                            {
                              required: indexes[index],
                              message: 'Title is required.',
                            },
                            {
                              whitespace: true,
                              message: 'Please enter a valid title',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Form.Item>
                    </Col>
                    <Col span={24} sm={9}>
                      <Row align="middle">
                        <Col span={24} sm={20}>
                          <Form.Item
                            {...field}
                            // label="Remarks"
                            name={[field.name, 'remarks']}
                            // rules={[{ required: true, message: "required!" }]}
                          >
                            <Input.TextArea rows={1} />
                          </Form.Item>
                        </Col>
                        <Col span={24} sm={2}>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{marginBottom: 20}}
                            className="svg-clear"
                          />
                        </Col>
                      </Row>
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

export default CommonModal
