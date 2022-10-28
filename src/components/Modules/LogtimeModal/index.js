import React, {useEffect, useState} from 'react'
import '@ant-design/compatible/assets/index.css'
import {Button, DatePicker, Input, Modal, Select, Spin, Form} from 'antd'
import moment from 'moment'
import {useQuery} from '@tanstack/react-query'
import {getAllProjects} from 'services/projects'
import {filterOptions} from 'helpers/utils'

const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input

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

function LogtimeModal({
  toggle,
  onClose,
  logTypes,
  onSubmit,
  initialValues = {},
  loading = false,
  isEditMode,
  isUserLogtime = false,
}) {
  // const { getFieldDecorator, validateFieldsAndScroll } = rest.form;
  const [searchValue, setSearchValue] = useState('')

  const [form] = Form.useForm()
  const [types, setTypes] = useState([])
  const projectsQuery = useQuery(['projects'], getAllProjects, {
    enabled: false,
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(
        isEditMode
          ? {...initialValues, ...values, user: initialValues?.user._id}
          : {...values}
      )
    })
  }

  useEffect(() => {
    if (toggle) {
      setTypes(logTypes.data?.data?.data)
      projectsQuery.refetch()
      form.setFieldsValue({
        hours: '0',
        minutes: '0',
      })
      if (isEditMode) {
        form.setFieldsValue(
          isUserLogtime
            ? {
                logDate: moment(initialValues?.logDate),
                hours: initialValues?.hours,
                minutes: initialValues?.minutes,
                logType: initialValues?.logType._id,
                remarks: initialValues?.remarks,
                project:
                  initialValues?.project?._id ||
                  process.env.REACT_APP_OTHER_PROJECT_ID,
              }
            : {
                logDate: moment(initialValues?.logDate),
                hours: initialValues?.hours,
                minutes: initialValues?.minutes,
                logType: initialValues?.logType._id,
                remarks: initialValues?.remarks,
              }
        )
      }
    }

    if (!toggle) form.resetFields()
  }, [toggle])
  return (
    <Modal
      title={isEditMode ? 'Update Log Time' : 'Add Log Time'}
      visible={toggle}
      mask={false}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form form={form}>
          <FormItem
            {...formItemLayout}
            label="Date"
            hasFeedback
            name="logDate"
            rules={[
              {
                message: 'Required!',
                required: true,
              },
            ]}
          >
            <DatePicker
              className=" gx-w-100"
              placeholder="Select Date"
              disabledDate={(current) =>
                (current &&
                  current < moment().subtract(1, 'days').startOf('day')) ||
                current > moment().endOf('day')
              }
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Hours"
            hasFeedback
            name="hours"
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) throw new Error('Required!')

                    if (value < 0) {
                      throw new Error('Log Hours cannot be below 0.')
                    }

                    if (value > 9) {
                      throw new Error('Log Hours cannot exceed 9')
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input placeholder="Enter Hours" type="number" min={0} max={9} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Minutes"
            hasFeedback
            name="minutes"
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) throw new Error('Required!')

                    if (
                      value !== '0' &&
                      value !== '15' &&
                      value !== '30' &&
                      value !== '45'
                    ) {
                      throw new Error(
                        'Minutes should be either 0, 15, 30 or 45.'
                      )
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <Input
              placeholder="Enter Minutes"
              type="number"
              step={15}
              min={0}
              max={45}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Log Type"
            hasFeedback
            name="logType"
            rules={[{required: true, message: 'Required!'}]}
          >
            <Select
              showSearch
              filterOption={filterOptions}
              placeholder="Select Log Type"
            >
              {types.map((logType) => (
                <Option value={logType._id} key={logType._id}>
                  {logType.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          {isUserLogtime && (
            <FormItem
              {...formItemLayout}
              label="Project Name"
              hasFeedback
              name="project"
              rules={[{required: true, message: 'Required!'}]}
            >
              <Select
                showSearch
                filterOption={filterOptions}
                placeholder="Select Project"
                onSearch={(e) => {
                  setSearchValue(e)
                }}
                open={searchValue.length ? true : false}
                onSelect={() => {
                  setSearchValue('')
                }}
              >
                {[
                  ...(projectsQuery?.data?.data?.data?.data || []),
                  {_id: process.env.REACT_APP_OTHER_PROJECT_ID, name: 'Other'},
                ].map((project) => (
                  <Option value={project._id} key={project._id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}

          <FormItem
            {...formItemLayout}
            label="Remarks"
            hasFeedback
            name="remarks"
            rules={[
              {
                required: true,
                validator: async (rule, value) => {
                  try {
                    if (!value) throw new Error('Required!')

                    const trimmedValue = value && value.trim()
                    if (trimmedValue?.length < 10) {
                      throw new Error('Remarks should be at least 10 letters!')
                    }
                  } catch (err) {
                    throw new Error(err.message)
                  }
                },
              },
            ]}
          >
            <TextArea placeholder="Enter Remarks" rows={2} />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

export default LogtimeModal
