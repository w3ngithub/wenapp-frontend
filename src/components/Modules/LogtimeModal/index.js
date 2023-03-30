import React, {useEffect, useState, useCallback} from 'react'
import '@ant-design/compatible/assets/index.css'
import {Button, DatePicker, Input, Modal, Select, Spin, Form} from 'antd'
import moment from 'moment'
import {useQuery} from '@tanstack/react-query'
import {getAllProjects, getProject} from 'services/projects'
import {filterOptions, filterSpecificUser} from 'helpers/utils'
import {LOG_TIME_OLD_EDIT} from 'constants/RoleAccess'
import {SearchOutlined} from '@ant-design/icons'
import {debounce} from 'helpers/utils'
import {notification} from 'helpers/notification'
import {emptyText} from 'constants/EmptySearchAntd'
import {getAllUsers} from 'services/users/userDetails'
import {ADMINISTRATOR} from 'constants/UserNames'
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
  isAdminTimeLog = false,
  role,
}) {
  const Option = Select.Option

  // const { getFieldDecorator, validateFieldsAndScroll } = rest.form;
  const [searchValue, setSearchValue] = useState('')

  const [form] = Form.useForm()
  const [types, setTypes] = useState([])
  const [zeroHourMinutes, setZeroHourMinutes] = useState(false)
  const [project, setProject] = useState()
  const [projectArray, setProjectArray] = useState([])
  const [user, setUser] = useState(undefined)
  const projectsQuery = useQuery(['projects'], getAllProjects, {
    enabled: false,
  })
  const {data: users} = useQuery(
    ['userForAttendances'],
    () => getAllUsers({fields: 'name', active: 'true', sort: 'name'}),
    {
      enabled: !!isAdminTimeLog,
    }
  )

  const dateFormat = 'YYYY-MM-DD'
  const handleCancel = () => {
    setZeroHourMinutes(false)
    form.resetFields()
    onClose()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!parseInt(values?.hours) && !parseInt(values?.minutes)) {
        setZeroHourMinutes(true)
        return
      } else {
        setZeroHourMinutes(false)
      }
      onSubmit(
        isEditMode
          ? {...initialValues, ...values, user: initialValues?.user._id}
          : {...values}
      )
    })
  }

  const handleSearch = async (projectName) => {
    if (!projectName) {
      setProjectArray([])
      return
    } else {
      setSearchValue(projectName)
      const projects = await getAllProjects({project: projectName})
      setProjectArray(projects?.data?.data?.data)
    }
    //else fetch projects from api
  }

  const optimizedFn = useCallback(debounce(handleSearch, 100), [])

  const handleUserChange = (name, detail) => {
    setUser(detail?.id)
  }

  useEffect(() => {
    if (toggle) {
      setTypes(logTypes.data?.data?.data)
      form.setFieldsValue({
        hours: '0',
        minutes: '0',
      })
      if (isEditMode) {
        if (initialValues?.project?._id && isUserLogtime) {
          setProjectArray([
            {
              _id: initialValues?.project._id,
              name: initialValues?.project?.name,
            },
          ])
        }

        form.setFieldsValue(
          isUserLogtime
            ? {
                logDate: moment(initialValues?.logDate),
                hours: initialValues?.hours || '0',
                minutes: initialValues?.minutes || '0',
                logType: initialValues?.logType._id,
                remarks: initialValues?.remarks,
                project:
                  initialValues?.project?._id ||
                  process.env.REACT_APP_OTHER_PROJECT_ID,
              }
            : {
                logDate: moment(initialValues?.logDate),
                hours: initialValues?.hours || '0',
                minutes: initialValues?.minutes || '0',
                logType: initialValues?.logType._id,
                remarks: initialValues?.remarks,
              }
        )
      } else {
        form.setFieldValue('logDate', moment())
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
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
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
                message: 'Date is required.',
                required: true,
              },
            ]}
          >
            <DatePicker
              className=" gx-w-100"
              placeholder="Select Date"
              format={dateFormat}
              disabledDate={
                LOG_TIME_OLD_EDIT.includes(role) || isAdminTimeLog
                  ? false
                  : (current) => {
                      if (+moment().format('d') === 1) {
                        return (
                          [0, 6].includes(+current.format('d')) ||
                          current <
                            moment().subtract(3, 'days').startOf('day') ||
                          current > moment().endOf('day')
                        )
                      }
                      return (
                        (current &&
                          current <
                            moment().subtract(1, 'days').startOf('day')) ||
                        current > moment().endOf('day')
                      )
                    }
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
                validator: async (rule, value) => {
                  try {
                    if (form.getFieldValue('minutes') && !value) return

                    if (value < 0) {
                      throw new Error('Log Hours cannot be below 0.')
                    }

                    if (value > 9) {
                      throw new Error('Log Hours cannot exceed 9')
                    }
                    if (value - Math.floor(value) !== 0) {
                      throw new Error('Log Hours cannot contain decimal value')
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
                validator: async (rule, val) => {
                  let value = val + ''
                  try {
                    if (form.getFieldValue('hours') && !parseInt(value)) return

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
          {isAdminTimeLog && (
            <FormItem
              {...formItemLayout}
              label="Co-Workers"
              name="user"
              rules={[{required: true, message: 'Co-Worker is required.'}]}
            >
              <Select
                notFoundContent={emptyText}
                showSearch
                placeholder="Select Co-worker"
                onChange={handleUserChange}
                filterOption={filterOptions}
              >
                {' '}
                {filterSpecificUser(
                  users?.data?.data?.data,
                  ADMINISTRATOR
                )?.map((user) => (
                  <Option value={user._id} key={user._id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}
          <FormItem
            {...formItemLayout}
            label="Log Type"
            hasFeedback
            name="logType"
            rules={[{required: true, message: 'Log Type is required'}]}
          >
            <Select
              notFoundContent={emptyText}
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
              rules={[{required: true, message: 'Project Name is required.'}]}
            >
              <Select
                notFoundContent={emptyText}
                showSearch
                suffixIcon={<SearchOutlined />}
                filterOption={filterOptions}
                placeholder="Search Project"
                onSearch={optimizedFn}
                value={project}
                allowClear
                onChange={(e) => setProject(e)}
                open={searchValue.length ? true : false}
                onSelect={() => {
                  setSearchValue('')
                }}
                onBlur={(e) => setSearchValue('')}
              >
                {/* {[
                  ...(projectsQuery?.data?.data?.data?.data || []),
                  {_id: process.env.REACT_APP_OTHER_PROJECT_ID, name: 'Other'},
                ].map((project) => (
                  <Option value={project._id} key={project._id}>
                    {project.name}
                  </Option>
                ))} */}

                {[
                  ...(projectArray || []),
                  {_id: process.env.REACT_APP_OTHER_PROJECT_ID, name: 'Other'},
                ].map((project) => (
                  <Option value={project._id} key={project._id}>
                    {project?.name}
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
                    if (!value) throw new Error('Remarks is required.')

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
            <TextArea placeholder="Enter Remarks" rows={6} />
          </FormItem>
          {zeroHourMinutes && (
            <p className="suggestion-text">
              Hours and minutes cannot be 0 simultaneously.
            </p>
          )}
        </Form>
      </Spin>
    </Modal>
  )
}

export default LogtimeModal
