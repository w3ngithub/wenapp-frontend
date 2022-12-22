import '@ant-design/compatible/assets/index.css'
import {async} from '@firebase/util'
import {useQuery} from '@tanstack/react-query'
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Form,
  Spin,
} from 'antd'
import {emptyText} from 'constants/EmptySearchAntd'
import {filterOptions, scrollForm} from 'helpers/utils'
import moment from 'moment'
import Maintenance from 'pages/Projects/Maintainance'
import {useEffect, useState} from 'react'
import {getProjectTags} from 'services/projects'
import './style.css'

const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input

function ProjectModal({
  toggle,
  onClose,
  types,
  statuses,
  onSubmit,
  initialValues,
  readOnly = false,
  loading = false,
  isEditMode = false,
  client,
  developers,
  designers,
  qas,
  devops,
  isFromLog = false,
}) {
  const [form] = Form.useForm()
  const [projectTypes, setProjectTypes] = useState([])
  const [projectStatuses, setProjectStatuses] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const {data, refetch} = useQuery(['tags'], getProjectTags, {
    enabled: false,
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }
  const currentDesigners = designers?.data?.data?.data?.map((item) => item?._id)
  const currentDevelopers = developers?.data?.data?.data?.map(
    (item) => item?._id
  )
  const currentQas = qas?.data?.data?.data?.map((item) => item?._id)
  const currentDevOps = devops?.data?.data?.data?.map((item) => item?._id)

  const changedRoleChecker = (type, key) => {
    const newList = type?.map((item) => {
      if (item.includes(' ')) {
        return initialValues?.[key]?.filter((val) => val?.name === item)?.[0]
          ?._id
      } else return item
    })
    return newList
  }
  const handleSubmit = (type) => {
    form.validateFields().then((values) => {
      const updatedDesigners = changedRoleChecker(
        values?.designers,
        'designers'
      )
      const updatedQAs = changedRoleChecker(values?.qa, 'qa')
      const updatedDevelopers = changedRoleChecker(values?.developers, 'devOps')
      const updatedDevOps = changedRoleChecker(values?.devOps, 'devOps')
      const updatedLiveUrl =
        typeof values?.liveUrl === 'string'
          ? values?.liveUrl
          : values?.liveUrl?.join('')
      onSubmit({
        ...values,
        name: values?.name?.trim()?.[0].toUpperCase() + values?.name?.trim()?.slice(1),
        designers: updatedDesigners,
        qa: updatedQAs,
        developers: updatedDevelopers,
        devOps: updatedDevOps,
        liveUrl: updatedLiveUrl,
        maintenance: [
          {
            ...maintenance[0],
            selectMonths:
              maintenance[0]?.selectMonths?.length === 13
                ? [...maintenance[0]?.selectMonths?.slice(1)]
                : maintenance[0]?.selectMonths,
          },
        ],
      })
    })
  }

  useEffect(() => {
    if (toggle) {
      // setProjectStatuses(statuses.data.data.data)
      setProjectTypes(types?.data?.data?.data)
      refetch()
      if (isEditMode) {
        setStartDate(moment(initialValues.startDate))
        setEndDate(moment(initialValues.endDate))
        setMaintenance([
          {
            selectMonths:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].selectMonths.length === 12
                  ? ['Toggle All', ...initialValues.maintenance[0].selectMonths]
                  : initialValues.maintenance[0].selectMonths
                : [],
            emailDay:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].emailDay
                : undefined,
            sendEmailTo:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].sendEmailTo
                : undefined,
            enabled:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].enabled
                : undefined,
          },
        ])

        form.setFieldsValue({
          name: initialValues.name ?? '',
          priority: initialValues.priority,
          path: initialValues.path,
          estimatedHours: initialValues.estimatedHours,
          startDate: initialValues.startDate
            ? moment(initialValues.startDate)
            : null,
          endDate: initialValues.endDate ? moment(initialValues.endDate) : null,
          projectTypes: initialValues.projectTypes?.map((type) => type._id),
          projectStatus: initialValues.projectStatus?._id,
          projectTags:
            initialValues.projectTags?.length > 0
              ? initialValues.projectTags?.map((tags) => tags._id)
              : undefined,
          client: initialValues?.client?.hasOwnProperty('_id')
            ? initialValues.client?._id
            : undefined,
          developers:
            initialValues.developers?.length > 0
              ? initialValues.developers?.map((developer) =>
                  developer?.positionType?.name === 'Developer' &&
                  currentDevelopers?.includes(developer?._id)
                    ? developer._id
                    : developer.name
                )
              : undefined,
          designers:
            initialValues.designers?.length > 0
              ? initialValues.designers?.map((designer) =>
                  designer?.positionType?.name === 'Designer' &&
                  currentDesigners?.includes(designer?._id)
                    ? designer._id
                    : designer.name
                )
              : undefined,
          devOps:
            initialValues.devOps?.length > 0
              ? initialValues.devOps?.map((devop) =>
                  devop?.positionType?.name === 'devOps' &&
                  currentDevOps?.includes(devop?._id)
                    ? devop._id
                    : devop.name
                )
              : undefined,
          qa:
            initialValues.qa?.length > 0
              ? initialValues.qa?.map((q) =>
                  q?.positionType?.name === 'QA' && currentQas?.includes(q?._id)
                    ? q._id
                    : q.name
                )
              : undefined,
          stagingUrls:
            initialValues.stagingUrls?.length > 0
              ? initialValues.stagingUrls
              : undefined,
          liveUrl: initialValues.liveUrl,
          notes: initialValues?.notes?.replace(/<\/?[^>]+(>|$)/g, '') || '',
          emailDay:
            initialValues.maintenance?.length > 0
              ? initialValues.maintenance[0].emailDay
              : undefined,
        })
      }
      if (isFromLog) {
        setMaintenance([
          {
            selectMonths:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].selectMonths.length === 12
                  ? ['Toggle All', ...initialValues.maintenance[0].selectMonths]
                  : initialValues.maintenance[0].selectMonths
                : [],
            emailDay:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].emailDay
                : undefined,
            sendEmailTo:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].sendEmailTo
                : undefined,
            enabled:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].enabled
                : undefined,
          },
        ])

        form.setFieldsValue({
          name: initialValues.name ?? '',
          priority: initialValues.priority,
          path: initialValues.path,
          estimatedHours: initialValues.estimatedHours,
          startDate: initialValues.startDate
            ? moment(initialValues.startDate)
            : null,
          endDate: initialValues.endDate ? moment(initialValues.endDate) : null,
          projectTypes: initialValues.projectTypes?.map((type) => type.name),
          projectStatus: initialValues.projectStatus?.name,
          projectTags:
            initialValues.projectTags?.length > 0
              ? initialValues.projectTags?.map((tags) => tags.name)
              : undefined,
          client: initialValues?.client?.hasOwnProperty('_id')
            ? initialValues.client?.name
            : undefined,
          developers:
            initialValues.developers?.length > 0
              ? initialValues.developers?.map((developer) => developer.name)
              : undefined,
          designers:
            initialValues.designers?.length > 0
              ? initialValues.designers?.map((designer) => designer.name)
              : undefined,
          devOps:
            initialValues.devOps?.length > 0
              ? initialValues.devOps?.map((devop) => devop.name)
              : undefined,
          qa:
            initialValues.qa?.length > 0
              ? initialValues.qa?.map((q) => q.name)
              : undefined,
          stagingUrls:
            initialValues.stagingUrls?.length > 0
              ? initialValues.stagingUrls
              : undefined,
          liveUrl: initialValues.liveUrl,
          notes: initialValues?.notes?.replace(/<\/?[^>]+(>|$)/g, '') || '',
          emailDay:
            initialValues.maintenance?.length > 0
              ? initialValues.maintenance[0].emailDay
              : undefined,
        })
      }
    }

    if (!toggle) {
      setMaintenance([])
      setStartDate(undefined)
      setEndDate(undefined)
      form.resetFields()
    }
  }, [toggle])

  useEffect(() => {
    if (moment() < moment(startDate) || startDate === undefined) {
      let removeCompleted = statuses?.data?.data?.data?.filter(
        (data) => data.name !== 'Completed'
      )
      let selectedStatus = statuses?.data?.data?.data?.filter(
        (status) => status._id === form.getFieldValue('projectStatus')
      )
      setProjectStatuses(removeCompleted)
      if (selectedStatus?.[0]?.name === 'Completed') {
        form.setFieldValue('projectStatus', null)
      }
    } else {
      setProjectStatuses(statuses?.data?.data?.data)
    }
  }, [startDate])

  const handleDateChange = (e, time) => {
    if (time === 'start') setStartDate(e)
    else setEndDate(e)
  }

  const disableDate = (current, date, time) => {
    if (time === 'start' && date) {
      return current && current > date
    } else if (time === 'end' && date) {
      return current && current < date
    }
  }
  return (
    <Modal
      width={900}
      mask={false}
      title={
        (isEditMode && readOnly) || isFromLog
          ? 'Project Details'
          : isEditMode
          ? 'Update Project'
          : 'Add Project'
      }
      visible={toggle}
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
        <Form layout="vertical" form={form}>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Name"
                hasFeedback={readOnly ? false : true}
                name="name"
                rules={[
                  {
                    required: true,
                    validator: async (rule, value) => {
                      try {
                        if (!value) {
                          throw new Error('Name is required.')
                        }
                        const regex = /^[^*|\":<>[\]{}`\\';@&$!#%^]+$/
                        const isValid = regex.test(value)
                        if (value.trim().length === 0) {
                          throw new Error('Please enter a valid Name.')
                        }
                        if (
                          value?.split('')[0] === '-' ||
                          value?.split('')[0] === '(' ||
                          value?.split('')[0] === ')'
                        ) {
                          throw new Error(
                            'Please do not use special characters before project name.'
                          )
                        }

                        if (!isValid) {
                          throw new Error(
                            'Please do not use special characters.'
                          )
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
            </Col>
            <Col span={24} sm={12}>
              <FormItem label="Priority" name="priority">
                <Radio.Group buttonStyle="solid" disabled={readOnly}>
                  <Radio.Button value={true}>Yes</Radio.Button>
                  <Radio.Button value={false}>No</Radio.Button>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Path"
                hasFeedback={readOnly ? false : true}
                name="path"
                rules={[
                  {
                    required: true,
                    validator: async (rule, value) => {
                      try {
                        if (!value) {
                          throw new Error('Path is required.')
                        }
                        if (value.trim().length === 0) {
                          throw new Error('Please enter a valid Path.')
                        }
                      } catch (err) {
                        scrollForm(form, 'path')
                        throw new Error(err.message)
                      }
                    },
                  },
                ]}
              >
                <Input
                  className={`${readOnly ? 'path-disabled' : ''}`}
                  placeholder="Enter Path"
                  onFocus={readOnly ? (e) => e.target.select() : false}
                  readOnly={readOnly}
                />
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Estimated Hours"
                hasFeedback={readOnly ? false : true}
                name="estimatedHours"
                rules={[
                  {
                    whitespace: true,
                    validator: async (rule, value) => {
                      try {
                        if (value < 0) {
                          throw new Error(
                            'Please  enter a valid Estimated Hours'
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
                  placeholder="Enter Estimated Hours"
                  type="number"
                  disabled={readOnly}
                />
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
                  {
                    required: true,
                    validator: async (rule, value) => {
                      try {
                        if (!value) {
                          throw new Error('Start Date is required.')
                        }
                      } catch (err) {
                        scrollForm(form, 'startDate')
                        throw new Error(err.message)
                      }
                    },
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => handleDateChange(e, 'start')}
                  disabledDate={(current) =>
                    disableDate(current, endDate, 'start')
                  }
                  className=" gx-w-100"
                  disabled={readOnly}
                />
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="End Date"
                hasFeedback={readOnly ? false : true}
                name="endDate"
              >
                <DatePicker
                  onChange={(e) => handleDateChange(e, 'end')}
                  disabledDate={(current) =>
                    disableDate(current, startDate, 'end')
                  }
                  className=" gx-w-100"
                  disabled={readOnly}
                />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Type"
                hasFeedback={readOnly ? false : true}
                name="projectTypes"
              >
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Type"
                  disabled={readOnly}
                  mode="multiple"
                >
                  {projectTypes?.map((type) => (
                    <Option value={type._id} key={type._id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Status"
                hasFeedback={readOnly ? false : true}
                name="projectStatus"
                rules={[
                  {
                    required: true,
                    validator: async (rule, value) => {
                      try {
                        if (!value) {
                          throw new Error('Status is required.')
                        }
                      } catch (err) {
                        scrollForm(form, 'projectStatus')
                        throw new Error(err.message)
                      }
                    },
                  },
                ]}
              >
                <Select
                  showSearch
                  notFoundContent={emptyText}
                  filterOption={filterOptions}
                  placeholder="Select Status"
                  disabled={readOnly}
                >
                  {projectStatuses?.map((status) => (
                    <Option value={status._id} key={status._id}>
                      {status.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Tags"
                hasFeedback={readOnly ? false : true}
                name="projectTags"
              >
                <Select
                  showSearch
                  notFoundContent={emptyText}
                  filterOption={filterOptions}
                  placeholder="Select Tags"
                  disabled={readOnly}
                  mode="multiple"
                  size="large"
                >
                  {data &&
                    data.data.data.data.map((tag) => (
                      <Option value={tag._id} key={tag._id}>
                        {tag.name}
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Client"
                hasFeedback={readOnly ? false : true}
                name="client"
              >
                <Select
                  notFoundContent={emptyText}
                  placeholder="Select Client"
                  filterOption={filterOptions}
                  disabled={readOnly}
                  showSearch
                >
                  {client?.data?.data?.data?.map((tag) => (
                    <Option value={tag._id} key={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Developers"
                hasFeedback={readOnly ? false : true}
                name="developers"
              >
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Developers"
                  disabled={readOnly}
                  mode="multiple"
                >
                  {developers?.data?.data?.data?.map((tag) => (
                    <Option value={tag._id} key={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Designers"
                hasFeedback={readOnly ? false : true}
                name="designers"
              >
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Designers"
                  disabled={readOnly}
                  mode="multiple"
                >
                  {designers?.data?.data?.data?.map((tag) => (
                    <Option value={tag._id} key={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="QA"
                hasFeedback={readOnly ? false : true}
                name="qa"
              >
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select QA"
                  disabled={readOnly}
                  mode="multiple"
                >
                  {qas?.data?.data?.data?.map((tag) => (
                    <Option value={tag._id} key={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="DevOps"
                hasFeedback={readOnly ? false : true}
                name="devOps"
              >
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select DevOps"
                  disabled={readOnly}
                  mode="multiple"
                >
                  {devops?.data?.data?.data?.map((tag) => (
                    <Option value={tag._id} key={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={12}>
              <FormItem
                label="Staging URL"
                hasFeedback={readOnly ? false : true}
                name="stagingUrls"
              >
                <Select
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Staging Urls"
                  disabled={readOnly}
                  mode="tags"
                  tagRender={(props) => {
                    return (
                      <a href={props.value} target="_blank">
                        <span className="staging-urls">{props.value}</span>
                      </a>
                    )
                  }}
                >
                  {[].map((item) => (
                    <Option key={item} value={item} />
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Live URL"
                hasFeedback={readOnly ? false : true}
                name="liveUrl"
              >
                <Select
                  disabled={readOnly}
                  mode="tags"
                  open={false}
                  tagRender={(props) => {
                    return (
                      <a href={props.value} target="_blank">
                        {props.value}
                      </a>
                    )
                  }}
                />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={24}>
              <FormItem label="Notes" name="notes">
                <TextArea
                  placeholder="Enter Notes"
                  rows={6}
                  disabled={readOnly}
                  size="middle"
                />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} sm={24}>
              <Maintenance
                readOnly={readOnly}
                maintenance={maintenance}
                setMaintenance={setMaintenance}
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ProjectModal
