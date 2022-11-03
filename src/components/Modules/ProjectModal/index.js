import '@ant-design/compatible/assets/index.css'
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
import {filterOptions} from 'helpers/utils'
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

  const handleSubmit = () => {
    form.validateFields().then((values) =>
      onSubmit({
        ...values,
        maintenance: [
          {
            ...maintenance[0],
            selectMonths:
              maintenance[0]?.selectMonths.length === 13
                ? [...maintenance[0]?.selectMonths.slice(1)]
                : maintenance[0]?.selectMonths,
          },
        ],
      })
    )
  }
  useEffect(() => {
    if (toggle) {
      setProjectStatuses(statuses.data.data.data)
      setProjectTypes(types.data.data.data)
      refetch()
      if (isEditMode) {
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
            monthly:
              initialValues.maintenance?.length > 0
                ? initialValues.maintenance[0].monthly
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
          client:  initialValues?.client?.hasOwnProperty('_id')
          ? initialValues.client?._id
          : undefined,
          developers:
            initialValues.developers?.length > 0
              ? initialValues.developers?.map((developer) => developer._id)
              : undefined,
          designers:
            initialValues.designers?.length > 0
              ? initialValues.designers?.map((designer) => designer._id)
              : undefined,
          devOps:
            initialValues.devOps?.length > 0
              ? initialValues.devOps?.map((devop) => devop._id)
              : undefined,
          qa:
            initialValues.qa?.length > 0
              ? initialValues.qa?.map((q) => q._id)
              : undefined,
          stagingUrls:
            initialValues.stagingUrls?.length > 0
              ? initialValues.stagingUrls
              : undefined,
          liveUrl: initialValues.liveUrl,
          notes: initialValues.notes,
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
      title={isEditMode ? 'Update Project' : 'Add Project'}
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
                label="Name"
                hasFeedback={readOnly ? false : true}
                name="name"
                rules={[{required: true, message: 'Required!'}]}
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
              >
                <Input placeholder="Enter Path" disabled={readOnly} />
              </FormItem>
            </Col>
            <Col span={24} sm={12}>
              <FormItem
                label="Estimated Hours"
                hasFeedback={readOnly ? false : true}
                name="estimatedHours"
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
                rules={[{required: true, message: 'Required!'}]}
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
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Type"
                  disabled={readOnly}
                >
                  {projectTypes.map((type) => (
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
                    message: 'Required!',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Status"
                  disabled={readOnly}
                >
                  {projectStatuses.map((status) => (
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
                  filterOption={filterOptions}
                  placeholder="Select Tags"
                  disabled={readOnly}
                  mode="tags"
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
                  placeholder="Select Client"
                  disabled={readOnly}
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
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Developers"
                  disabled={readOnly}
                  mode="tags"
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
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Designers"
                  disabled={readOnly}
                  mode="tags"
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
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select QA"
                  disabled={readOnly}
                  mode="tags"
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
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select DevOps"
                  disabled={readOnly}
                  mode="tags"
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
                  tagRender={(props)=>{
                    return <a href={props.value} target='_blank'><span className='staging-urls'>{props.value}</span></a>
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
                tagRender={(props)=>{
                  return <a href={props.value} target='_blank'>{props.value}</a>
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
