import React, {useEffect, useState} from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Spin,
  DatePicker,
  Radio,
  ConfigProvider,
} from 'antd'
import en_GB from 'antd/lib/locale-provider/en_GB'
import 'moment/locale/en-gb'
import {Calendar, DateObject} from 'react-multi-date-picker'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  createLeaveOfUser,
  getLeavesOfUser,
  getLeaveTypes,
  updateLeave,
} from 'services/leaves'
import {
  filterHalfDayLeaves,
  filterOptions,
  handleResponse,
  MuiFormatDate,
  specifyParticularHalf,
} from 'helpers/utils'
import leaveTypeInterface from 'types/Leave'
import {notification} from 'helpers/notification'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import {useSelector} from 'react-redux'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import useWindowsSize from 'hooks/useWindowsSize'
import moment from 'moment'
import {immediateApprovalLeaveTypes} from 'constants/LeaveTypes'
import {disabledDate} from 'util/antDatePickerDisabled'
import {LEAVES_TYPES} from 'constants/Leaves'

const {Option} = Select

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}

const formItemLayout = {
  labelCol: {
    xs: {span: 0},
    sm: {span: 16},
  },
  wrapperCol: {
    xs: {span: 0},
    sm: {span: 24},
  },
}

moment.locale('en-gb')

function LeaveModal({
  leaveData,
  isEditMode,
  open,
  readOnly = false,
  onClose,
  users,
  showWorker = true,
}: {
  leaveData: any
  isEditMode: boolean
  open: boolean
  onClose: () => void
  users: any
  readOnly: boolean
  showWorker: boolean
}) {
  const queryClient = useQueryClient()

  const [form] = Form.useForm()
  const [leaveType, setLeaveType] = useState('')
  const [user, setUser] = useState('')
  const [leaveId, setLeaveId] = useState(null)
  const {innerWidth} = useWindowsSize()
  const {themeType} = useSelector((state: any) => state.settings)
  const [holidays, setHolidays] = useState([])
  const [firstHalfSelected, setFirstHalfSelected] = useState(false)
  const [secondHalfSelected, setSecondHalfSelected] = useState(false)
  const darkCalendar = themeType === THEME_TYPE_DARK

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type: leaveTypeInterface) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })

  const userLeavesQuery = useQuery(['userLeaves', user], () =>
    getLeavesOfUser(user)
  )

  const leaveMutation = useMutation((leave: any) => createLeaveOfUser(leave), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave created successfully',
        'Leave creation failed',
        [
          () => queryClient.invalidateQueries(['leaves']),
          () => queryClient.invalidateQueries(['leavesCalendar']),
          () => onClose(),
        ]
      ),
    onError: (error) => {
      notification({message: 'Leave creation failed!', type: 'error'})
    },
  })

  const leaveUpdateMutation = useMutation((leave: any) => updateLeave(leave), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave updated successfully',
        'Leave update failed',
        [() => queryClient.invalidateQueries(['leaves']), () => onClose()]
      ),
    onError: (error) => {
      notification({message: 'Leave update failed!', type: 'error'})
    },
  })

  const onFinish = (values: any) => {
    form.validateFields().then((values) => {
      const leaveTypeName = leaveTypeQuery?.data?.find(
        (type) => type?.id === values?.leaveType
      )?.value
      //calculation for maternity, paternity, pto leaves
      const numberOfLeaveDays =
        leaveTypeName.toLowerCase() === LEAVES_TYPES.Maternity ? 59 : 4 // 60 for maternity, 5 for other two
      const appliedDate = values?.leaveDatesPeriod?.startOf('day')?._d
      const newDate = new Date(values?.leaveDatesPeriod?._d)
      const endDate = new Date(
        newDate.setDate(appliedDate?.getDate() + numberOfLeaveDays)
      )
      const appliedDateUTC = appliedDate ? MuiFormatDate(appliedDate) : ''
      const endDateUTC = appliedDate ? MuiFormatDate(endDate) : ''

      //calculation for sick, casual leaves
      const casualLeaveDays = appliedDate
        ? []
        : values?.leaveDatesCasual?.join(',').split(',')
      const casualLeaveDaysUTC = casualLeaveDays.map((leave: string) =>
        MuiFormatDate(new Date(leave))
      )
      const newLeave = {
        ...values,
        leaveDates: appliedDate
          ? [appliedDateUTC, endDateUTC]
          : casualLeaveDaysUTC,
        reason: values.reason,
        leaveType: values.leaveType,
        halfDay: values.halfDay,
        leaveStatus: appliedDate ? 'approved' : 'pending',
      }
      if (isEditMode) leaveUpdateMutation.mutate({id: leaveId, data: newLeave})
      else
        leaveMutation.mutate({
          id: values.user,
          data: newLeave,
        })
    })
  }

  const handleLeaveTypeChange = (value: string) => {
    setLeaveType(leaveTypeQuery?.data?.find((type) => type.id === value).value)
  }

  const handleUserChange = (user: string) => {
    setUser(user)
  }
  
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        form.setFieldsValue({
          leaveType: leaveData.leaveType._id,
          leaveDatesCasual: leaveData?.leaveDates,
          leaveDatesPeriod: moment(leaveData),
          reason: leaveData.reason,
          user: leaveData.user._id,
          halfDay: leaveData.halfDay,
          cancelReason: leaveData?.cancelReason,
        })
        setUser(leaveData.user._id)
        setLeaveId(leaveData._id)
        setLeaveType(leaveData.leaveType.name)
      }
      setHolidays(
        queryClient
          .getQueryData<any>(['DashBoardHolidays'])
          ?.data?.data?.data?.[0]?.holidays?.map((holiday: any) => ({
            date: new DateObject(holiday?.date).format(),
            name: holiday?.title,
          }))
      )
    }

    if (!open) {
      form.resetFields()
      setLeaveType('')
      setUser('')
    }
  }, [open])

  let userLeaves: any[] = []

  userLeavesQuery?.data?.data?.data?.data?.forEach((leave: any) => {
    if (leave?.leaveDates.length > 1) {
      for (let i = 0; i < leave?.leaveDates.length; i++) {
        userLeaves.push({
          leaveStatus: leave?.leaveStatus,
          date: new DateObject(leave?.leaveDates[i]).format(),
          isHalfDay: leave?.halfDay,
        })
      }
    } else {
      userLeaves.push({
        leaveStatus: leave?.leaveStatus,
        date: new DateObject(leave?.leaveDates[0]).format(),
        isHalfDay: leave?.halfDay,
      })
    }
  })
  return (
    <Modal
      width={1100}
      title={!isEditMode ? 'Add Leave' : readOnly ? 'Details' : 'Update Leave'}
      style={{flexDirection: 'row'}}
      visible={open}
      mask={false}
      onOk={onFinish}
      onCancel={onClose}
      footer={
        readOnly
          ? [
              <Button key="back" onClick={onClose}>
                Cancel
              </Button>,
            ]
          : [
              <Button key="back" onClick={onClose}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={onFinish}>
                Submit
              </Button>,
            ]
      }
    >
      <Spin spinning={leaveMutation.isLoading || leaveUpdateMutation.isLoading}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          layout="vertical"
          className="padding-lt-0"
        >
          <Row>
            <Col span={6} xs={24} sm={16}>
              <Row>
                <Col span={6} xs={24} sm={12}>
                  <Form.Item
                    {...formItemLayout}
                    name="leaveType"
                    label="Leave Type"
                    rules={[{required: true, message: 'Required!'}]}
                  >
                    <Select
                      showSearch
                      filterOption={filterOptions}
                      placeholder="Select Leave Type"
                      allowClear
                      onChange={handleLeaveTypeChange}
                      disabled={readOnly}
                    >
                      {leaveTypeQuery?.data?.map((type) =>
                        readOnly ||
                        type.value.toLowerCase() !==
                          LEAVES_TYPES?.LateArrival ? (
                          <Option value={type.id} key={type.id}>
                            {type.value}
                          </Option>
                        ) : null
                      )}
                    </Select>
                  </Form.Item>
                  {(leaveType === 'Casual' ||
                    leaveType === 'Sick' ||
                    leaveType === 'Casual Leave' ||
                    leaveType === 'Sick Leave') && (
                    <Form.Item
                      {...formItemLayout}
                      label="Half Leave"
                      name="halfDay"
                    >
                      <Radio.Group disabled={readOnly}>
                        <Radio value="first-half" disabled={firstHalfSelected}>
                          First-Half
                        </Radio>
                        <Radio
                          value="second-half"
                          disabled={secondHalfSelected}
                        >
                          Second-Half
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  )}
                </Col>
                <Col span={6} xs={24} sm={12}>
                  {showWorker && (
                    <Form.Item
                      {...formItemLayout}
                      name="user"
                      label="Co-worker"
                      rules={[{required: true, message: 'Required!'}]}
                    >
                      <Select
                        showSearch
                        filterOption={filterOptions}
                        placeholder="Select Co-worker"
                        onChange={handleUserChange}
                        disabled={readOnly}
                        allowClear
                      >
                        {users?.map((user: any) => (
                          <Option value={user._id} key={user._id}>
                            {user?.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={6} xs={24} sm={24} xl={24}>
                  <Form.Item
                    {...formItemLayout}
                    name="reason"
                    label="Leave Reason"
                    rules={[
                      {
                        required: true,
                        validator: async (rule, value) => {
                          try {
                            if (!value) throw new Error('Required!')

                            const trimmedValue = value && value.trim()
                            if (
                              trimmedValue?.length < 10 ||
                              trimmedValue?.length > 250
                            ) {
                              throw new Error(
                                'Reason should be between 10 and 250 letters!'
                              )
                            }
                          } catch (err) {
                            throw new Error(err.message)
                          }
                        },
                      },
                    ]}
                  >
                    <Input.TextArea
                      allowClear
                      rows={10}
                      disabled={readOnly}
                      style={{
                        background: darkCalendar ? '#434f5a' : '',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {!showWorker && leaveData?.cancelReason && (
                <Row>
                  <Col span={6} xs={24} sm={24} xl={24}>
                    <Form.Item
                      {...formItemLayout}
                      name="cancelReason"
                      label="Cancel Leave Reason"
                    >
                      <Input.TextArea
                        allowClear
                        rows={10}
                        disabled={readOnly}
                        style={{
                          background: darkCalendar ? '#434f5a' : '',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>
            {user &&
              (immediateApprovalLeaveTypes.includes(leaveType) ? (
                <Col xs={24} sm={8}>
                  <ConfigProvider locale={en_GB}>
                    <Form.Item
                      style={{marginBottom: '0.5px'}}
                      label="Leave Start Date"
                      name="leaveDatesPeriod"
                      rules={[{required: true, message: 'Required!'}]}
                    >
                      <DatePicker
                        className="gx-mb-3 "
                        style={{width: innerWidth <= 1096 ? '100%' : '300px'}}
                        disabled={readOnly}
                        disabledDate={disabledDate}
                      />
                    </Form.Item>
                  </ConfigProvider>
                </Col>
              ) : (
                <Col span={6} xs={24} sm={8}>
                  <Form.Item
                    {...formItemLayout}
                    name="leaveDatesCasual"
                    label={!readOnly && 'Select Leave Date'}
                    rules={[{required: true, message: 'Required!'}]}
                  >
                    <Calendar
                      className={darkCalendar ? 'bg-dark' : 'null'}
                      buttons={readOnly ? false : true}
                      numberOfMonths={1}
                      disableMonthPicker
                      disableYearPicker
                      weekStartDayIndex={1}
                      multiple
                      minDate={
                        leaveType === 'Sick' ||
                        leaveType === 'Casual' ||
                        isEditMode
                          ? new DateObject().subtract(2, 'months')
                          : new Date()
                      }
                      
                      mapDays={({date}) => {
                        let isWeekend = [0, 6].includes(date.weekDay.index)
                        let holidayList: any[] = holidays?.filter(
                          (holiday: any) => date.format() === holiday?.date
                        )
                        let isHoliday = holidayList?.length > 0
                        let leaveDate = userLeaves?.filter(
                          (leave) => leave.date === date.format()
                        )
                        const isLeaveTaken = form.getFieldValue('leaveDatesCasual')?.[0]?.split('-')?.join('/')?.split('T')?.[0] === leaveDate?.[0]?.date
                        let leaveAlreadyTakenDates =
                          filterHalfDayLeaves(leaveDate)
                        if (readOnly && !isLeaveTaken) {
                          return {
                            disabled: true,
                            style: {
                              color: '#ccc',
                            },
                          }
                        }
                        if (isWeekend || isHoliday || leaveAlreadyTakenDates)
                          return {
                            disabled: true,
                            style: {
                              color:
                                isWeekend || leaveAlreadyTakenDates
                                  ? '#ccc'
                                  : 'rgb(237 45 45)',
                            },
                            onClick: () => {
                              if (isWeekend)
                                notification({message: 'Weekends are disabled'})
                              else if (isHoliday)
                                notification({
                                  message: `${holidayList[0]?.name} holiday`,
                                })
                              else if (leaveAlreadyTakenDates)
                                notification({message: `Leave already taken`})
                            },
                          }
                      }}
                      // disabled={readOnly}
                    />
                  </Form.Item>

                  <small
                    style={{
                      color: 'red',
                      fontSize: '14px',
                      width: '10%',
                      paddingLeft: 15,
                    }}
                  >
                    *Disabled dates are holidays
                  </small>
                </Col>
              ))}
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default LeaveModal
