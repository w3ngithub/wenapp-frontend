import React, {useEffect} from 'react'
import '@ant-design/compatible/assets/index.css'
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Spin,
  Form,
  TimePicker,
} from 'antd'
import moment from 'moment'
import {dateToDateFormat, filterOptions, scrollForm} from 'helpers/utils'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

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

function UserDetailForm({
  toggle,
  onToggleModal,
  roles,
  position,
  positionTypes,
  onSubmit,
  intialValues,
  readOnly = false,
  loading = false,
  currentQuarter,
}) {
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    onToggleModal({})
  }

  const user = useSelector(selectAuthUser)

  const handleSubmit = () => {
    const data = intialValues?.allocatedLeaves

    form.validateFields().then((values) => {
      onSubmit({
        ...intialValues,
        ...values,
        officeTime: {
          utcDate: moment(values.officeTime._d).utc().format(),
          hour: moment(values.officeTime._d).add(10, 'm').utc().format('h'),
          minute: moment(values.officeTime._d).add(10, 'm').utc().format('m'),
        },
        allocatedLeaves: {
          ...data,
          [currentQuarter?.data?.name]: values?.allocatedLeaves,
        },
      })
    })
  }

  const handleStatusChange = (value) => {
    if (value === 'Probation')
      form.setFieldValue('allocatedLeaves', currentQuarter?.data?.leaves - 1)
    else form.setFieldValue('allocatedLeaves', currentQuarter?.data?.leaves)
  }
  const disableDate = (current) => {
    return current && current > moment().endOf('day')
  }

  const disableJoinDate = (current) => {
    return (
      (current && current < moment('2012-1-2')) ||
      (current && current > moment().endOf('day'))
    )
  }

  const disableReviewDate = (current) => {
    return (
      (current && current > moment().endOf('day')) ||
      (intialValues?.lastReviewDate.length > 0 &&
        current <
          moment(
            intialValues?.lastReviewDate[
              intialValues?.lastReviewDate?.length - 1
            ]
          ))
    )
  }

  const handlePositionChange = (value) => {
    const isIntern =
      form.getFieldValue('position') ===
      position?.data?.data?.data?.find((pos) => pos?.name === 'Intern')._id
    const isTrainee =
      form.getFieldValue('position') ===
      position?.data?.data?.data?.find((pos) => pos?.name === 'Trainee')._id

    const isOnProbation = form.getFieldValue('status') === 'Probation'

    if (isIntern || isTrainee || isOnProbation)
      form.setFieldValue('allocatedLeaves', currentQuarter?.data?.leaves - 1)
    else form.setFieldValue('allocatedLeaves', currentQuarter?.data?.leaves)
  }
  useEffect(() => {
    if (toggle) {
      form.setFieldsValue({
        name: intialValues.name ? intialValues.name : '',
        role:
          intialValues.role && intialValues.role._id
            ? intialValues.role._id
            : undefined,
        position:
          intialValues.position && intialValues.position._id
            ? intialValues.position._id
            : undefined,
        positionType:
          intialValues.positionType && intialValues.positionType._id
            ? intialValues.positionType._id
            : undefined,
        status: intialValues?.status && intialValues?.status,
        allocatedLeaves:
          intialValues?.allocatedLeaves?.[currentQuarter?.data?.name],

        panNumber: intialValues.panNumber && intialValues.panNumber,
        citNumber: intialValues.citNumber && intialValues.citNumber,
        bankAccNumber: intialValues.bankAccNumber && intialValues.bankAccNumber,
        bankName: intialValues.bankName && intialValues.bankName,
        lastReviewDate:
          intialValues?.lastReviewDate?.length > 0 &&
          moment(
            intialValues.lastReviewDate[intialValues.lastReviewDate.length - 1]
          ),
        joinDate:
          intialValues.joinDate &&
          moment(dateToDateFormat(intialValues.joinDate)),
        exitDate: intialValues.exitDate && moment(intialValues.exitDate),
        officeTime: intialValues?.officeTime?.utcDate
          ? moment(new Date(intialValues?.officeTime?.utcDate), 'h:mm:ss a')
          : moment('09:00:00 AM', 'HH:mm:ss a'),
      })
    }

    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      title={readOnly ? 'Details' : 'Update Co-worker'}
      visible={toggle}
      mask={false}
      onOk={handleSubmit}
      onCancel={handleCancel}
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
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </Button>,
            ]
      }
    >
      <Spin spinning={loading}>
        <Form form={form}>
          <FormItem
            {...formItemLayout}
            label="Name"
            hasFeedback={readOnly ? false : true}
            name="name"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  try {
                    if (!value) {
                      throw new Error('Name is required.')
                    }
                    const regex = /^[A-Za-z ]+$/
                    const isValid = regex.test(value)
                    if (value.trim().length === 0) {
                      throw new Error('Please enter a valid Name.')
                    }

                    if (!isValid) {
                      throw new Error('Please enter a valid Name.')
                    }
                  } catch (err) {
                    scrollForm(form, 'name')
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input placeholder="Enter Name" disabled={readOnly} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Role"
            hasFeedback={readOnly ? false : true}
            name="role"
            rules={[{required: true, message: 'Role is required.'}]}
          >
            <Select
              showSearch
              placeholder="Select Role"
              disabled={readOnly}
              filterOption={filterOptions}
            >
              {roles &&
                roles?.data?.data?.data
                  ?.filter((role) => {
                    return !(
                      user?.role?.key !== 'admin' && role?.key === 'admin'
                    )
                  })
                  .map((role) => (
                    <Option value={role._id} key={role._id}>
                      {role.value}
                    </Option>
                  ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Office Start Time"
            name="officeTime"
            hasFeedback={readOnly ? false : true}
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) {
                      throw new Error('Office Start Time is required.')
                    }
                  } catch (err) {
                    scrollForm(form, 'officeTime')
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <TimePicker
              disabled={readOnly}
              style={{width: '100%'}}
              format="h:mm:ss A"
              initialValues={moment('09:00:00 AM', 'HH:mm:ss a')}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Position"
            hasFeedback={readOnly ? false : true}
            name="position"
            rules={[
              {
                required: true,
                message: 'Position is required.',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Position"
              disabled={readOnly}
              filterOption={filterOptions}
              onChange={handlePositionChange}
            >
              {position &&
                position?.data?.data?.data?.map((position) => (
                  <Option value={position._id} key={position._id}>
                    {position.name}
                  </Option>
                ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Position Type"
            hasFeedback={readOnly ? false : true}
            name="positionType"
            rules={[
              {
                required: true,
                message: 'Position Type is required.',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Position Type"
              disabled={readOnly}
              filterOption={filterOptions}
            >
              {positionTypes &&
                positionTypes?.data?.data?.data?.map((positionType) => (
                  <Option value={positionType._id} key={positionType._id}>
                    {positionType.name}
                  </Option>
                ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Status"
            hasFeedback={readOnly ? false : true}
            name="status"
            rules={[
              {
                required: true,
                message: 'Status is required.',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Status"
              disabled={readOnly}
              filterOption={filterOptions}
              onChange={handleStatusChange}
            >
              {['Permanent', 'Probation'].map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Allocated Leaves"
            hasFeedback={readOnly ? false : true}
            name="allocatedLeaves"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  try {
                    if (!value) {
                      throw new Error('Allocated Leaves is required.')
                    }
                    const regex = /^[0-9]+$/
                    const isValid = regex.test(value)
                    if (!isValid) {
                      throw new Error('Allocated Leaves must be a number')
                    }
                  } catch (error) {
                    scrollForm(form, 'allocatedLeaves')
                    throw new Error(error.message)
                  }
                },
              },
            ]}
          >
            <Input placeholder="Enter Allocated Leaves" disabled={readOnly} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Last Review Date"
            hasFeedback={readOnly ? false : true}
            name="lastReviewDate"
            rules={[
              {
                type: 'object',
                message: 'Last Review Date is required.',
                whitespace: true,
              },
            ]}
          >
            <DatePicker
              disabledDate={disableReviewDate}
              className=" gx-w-100"
              disabled={readOnly}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Join Date"
            hasFeedback={readOnly ? false : true}
            name="joinDate"
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) {
                      throw new Error('Join Date is required.')
                    }
                  } catch (err) {
                    scrollForm(form, 'joinDate')
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <DatePicker
              disabledDate={disableJoinDate}
              className=" gx-w-100"
              disabled={readOnly}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Exit Date"
            hasFeedback={readOnly ? false : true}
            name="exitDate"
          >
            <DatePicker
              disabledDate={disableDate}
              className=" gx-w-100"
              disabled={readOnly}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="PAN Number"
            hasFeedback={readOnly ? false : true}
            name="panNumber"
            rules={[
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: 'PAN must be a number.',
              },
            ]}
          >
            <Input
              placeholder="Enter Pan Number"
              type="number"
              disabled={readOnly}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="CIT Number"
            hasFeedback={readOnly ? false : true}
            name="citNumber"
            rules={[
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: 'CIT must be a number!',
              },
            ]}
          >
            <Input
              placeholder="Enter Cit Number"
              type="number"
              disabled={readOnly}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Bank Name"
            hasFeedback={readOnly ? false : true}
            name="bankName"
          >
            <Input placeholder="Enter Bank Name" disabled={readOnly} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Bank Account Number"
            hasFeedback={readOnly ? false : true}
            name="bankAccNumber"
          >
            <Input
              placeholder="Enter Bank Account Number"
              disabled={readOnly}
            />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

export default UserDetailForm
