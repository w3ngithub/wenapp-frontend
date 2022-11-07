import {useQuery} from '@tanstack/react-query'
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  TimePicker,
  Form,
} from 'antd'
import moment from 'moment'
import {useEffect} from 'react'
import {filterOptions} from 'helpers/utils'
import {getNoticeTypes} from 'services/noticeboard'

const FormItem = Form.Item
const {TextArea} = Input

function NoticeModal({
  toggle,
  onClose,
  types,
  statuses,
  onSubmit,
  initialValues,
  readOnly = false,
  loading = false,
  isEditMode = false,
}) {
  const noticeTypesQuery = useQuery(['noticeTypes'], getNoticeTypes, {
    enabled: false,
  })
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
      onSubmit(values)
    })
  }
  const dateFormat = 'YYYY/MM/DD';

  useEffect(() => {
    if (toggle) {
      noticeTypesQuery.refetch()
      if (isEditMode) {
        form.setFieldsValue({
          title: initialValues?.title,
          details: initialValues?.details,
          noticeType: initialValues?.noticeType?._id,
          startDate: initialValues?.startDate
            ? moment(initialValues?.startDate)
            : null,
          endDate: initialValues?.endDate
            ? moment(initialValues?.endDate)
            : null,
          startTime: initialValues?.startTime
            ? moment(initialValues?.startTime)
            : null,
          endTime: initialValues?.endTime
            ? moment(initialValues?.endTime)
            : null,
        })
      }
    }
    if (!toggle) form.resetFields()
  }, [toggle])

  return (
    <Modal
      width={900}
      title={readOnly ? 'Notice' : isEditMode ? 'Update Notice' : 'Add Notice'}
      visible={toggle}
      onOk={handleSubmit}
      onCancel={handleCancel}
      mask={false}
      footer={
        readOnly
          ? [
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
            ]
          : [
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>
                Submit
              </Button>,
            ]
      }
    >
      <Spin spinning={loading}>
        <Form layout="vertical" form={form}>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Title"
                hasFeedback={readOnly ? false : true}
                name="title"
                rules={[{required: true, message: 'Required!'}]}
              >
                <Input placeholder="Enter Title" disabled={readOnly} />
              </FormItem>
            </Col>

            <Col span={24} sm={12}>
              <FormItem
                label="Category"
                hasFeedback={readOnly ? false : true}
                name="noticeType"
                rules={[{required: true, message: 'Required!'}]}
              >
                <Select
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Category"
                  disabled={readOnly}
                >
                  {noticeTypesQuery.data &&
                    noticeTypesQuery?.data?.data?.data?.data?.map((tag) => (
                      <Select.Option value={tag._id} key={tag._id}>
                        {tag.name}
                      </Select.Option>
                    ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Start Date"
                hasFeedback={readOnly ? false : true}
                name="startDate"
                
                rules={[ 
                  {required: true, message: 'Required!'},

                  ({ getFieldValue }) => ({
                    validator(_, value) {
            
                      if (!value.isSameOrBefore(getFieldValue('endDate')) && getFieldValue('endDate')) {
                        return Promise.reject(new Error('The Start Date should be before End Time')); 
                      }

                      return Promise.resolve()
                      
                    },
                  }),
                ]}

              >
                <DatePicker className=" gx-w-100" disabled={readOnly} format={dateFormat}/>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="End Date"
                hasFeedback={readOnly ? false : true}
                name="endDate"

                rules={[ 
                  {required: true, message: 'Required!'},
                  ({ getFieldValue }) => ({
                    validator(_, value) {

                     if(value.isBefore(getFieldValue('startDate')) && getFieldValue('startDate')){
                      return Promise.reject(new Error('End Date should not be before startDate'))
                     }
                     return Promise.resolve()

                    },
                  }),
                ]}
              >
                <DatePicker className=" gx-w-100" disabled={readOnly}  format={dateFormat}/>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Start Time"
                hasFeedback={readOnly ? false : true}
                name="startTime"

                rules={[ 
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                     if(getFieldValue('startDate').isSame(getFieldValue('endDate')) && value && getFieldValue('endTime')){
                      if(!value.isBefore(getFieldValue('endTime'))){
                        return Promise.reject(new Error('End Time should not exceed startTime'))
                      }
                     }
                     if(!value && getFieldValue('endTime')){
                      return Promise.reject(new Error('Only endTime is not allowed'))
                     }

                     return Promise.resolve()

                    },
                  }),
                ]}

              >
                <TimePicker className=" gx-w-100" disabled={readOnly} />
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="End Time"
                hasFeedback={readOnly ? false : true}
                name="endTime"

                rules={[ 
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                     if(getFieldValue('startDate').isSame(getFieldValue('endDate')) && value && getFieldValue('startTime')){
                      if(value.isBefore(getFieldValue('startTime'))){
                        return Promise.reject(new Error('End Time should not exceed startTime'))
                      }
                     }
                    if(getFieldValue('startTime') && !value){
                      return Promise.reject(new Error('Only startTime is not allowed'))
                    }

                     return Promise.resolve()

                    },
                  }),
                ]}

              >
                <TimePicker className=" gx-w-100" disabled={readOnly} />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={24}>
              <FormItem
                label="Details"
                hasFeedback={readOnly ? false : true}
                name="details"
                rules={[
                  {required: true, message: 'Required!'},
                  {
                    min: 10,
                    message: 'Must be equal to or greater than 10 characters',
                  },
                ]}
              >
                <TextArea
                  placeholder="Enter Details"
                  rows={5}
                  disabled={readOnly}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default NoticeModal
