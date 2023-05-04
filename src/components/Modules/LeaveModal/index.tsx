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
  pendingLeaves,
  filterSpecificUser,
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
import {FIRST_HALF, FULL_DAY, LEAVES_TYPES, SECOND_HALF} from 'constants/Leaves'
import {leaveInterval} from 'constants/LeaveDuration'
import {emptyText} from 'constants/EmptySearchAntd'
import {socket} from 'pages/Main'
import {ADMINISTRATOR} from 'constants/UserNames'
import {CANCEL_TEXT} from 'constants/Common'

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
  onClose: (
    setSpecificHalf: any,
    setHalfLeaveApproved: any,
    setHalfLeavePending: any,
    setMultipleDatesSelected: any,
    setCalendarClicked: any
  ) => void
  users: any
  readOnly: boolean
  showWorker: boolean
}) {
  const queryClient = useQueryClient()
  const [colorState, setColorState] = useState(true)
  const [form] = Form.useForm()
  const [leaveType, setLeaveType] = useState('')
  const [user, setUser] = useState('')
  const [leaveId, setLeaveId] = useState(null)
  const {innerWidth} = useWindowsSize()
  const {themeType} = useSelector((state: any) => state.settings)
  const [holidays, setHolidays] = useState([])
  const [specificHalf, setSpecificHalf] = useState<any>(false)
  const [halfLeaveApproved, setHalfLeaveApproved] = useState<any>(false)
  const [halfLeavePending, setHalfLeavePending] = useState<any>(false)
  const [multipleDatesSelected, setMultipleDatesSelected] = useState(false)
  const [calendarClicked, setCalendarClicked] = useState(false)

  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const [fromDate, setFromDate] = useState<any>(
    `${MuiFormatDate(firstDay)}T00:00:00Z`
  )

  const [toDate, setToDate] = useState<any>(
    `${MuiFormatDate(lastDay)}T00:00:00Z`
  )

  const monthChangeHandler = (date: any) => {
    const newMonthDate = new Date(date)
    const firstDay = new Date(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth(),
      1
    )
    const lastDay = new Date(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth() + 1,
      0
    )
    setFromDate(`${MuiFormatDate(firstDay)}T00:00:00Z`)
    setToDate(`${MuiFormatDate(lastDay)}T00:00:00Z`)
  }

  const darkCalendar = themeType === THEME_TYPE_DARK

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type: leaveTypeInterface) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
        leaveDays: type?.leaveDays,
      })),
    ],
  })

  const userLeavesQuery = useQuery(['userLeaves', fromDate, toDate, user], () =>
    getLeavesOfUser(user, '', undefined, 1, 30, fromDate, toDate)
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
          () => {
            socket.emit('CUD')
          },
          () =>
            onClose(
              setSpecificHalf,
              setHalfLeaveApproved,
              setHalfLeavePending,
              setMultipleDatesSelected,
              setCalendarClicked
            ),
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
        [
          () => queryClient.invalidateQueries(['leaves']),
          () => {
            socket.emit('CUD')
          },
          () =>
            onClose(
              setSpecificHalf,
              setHalfLeaveApproved,
              setHalfLeavePending,
              setMultipleDatesSelected,
              setCalendarClicked
            ),
        ]
      ),
    onError: (error) => {
      notification({message: 'Leave update failed!', type: 'error'})
    },
  })

  const onFinish = (values: any) => {
    form.validateFields().then((values) => {
      const leaveType = leaveTypeQuery?.data?.find(
        (type) => type?.id === values?.leaveType
      )
      //calculation for maternity, paternity, pto leaves
      const numberOfLeaveDays = leaveType?.leaveDays - 1 // duration is dynamic based on settings values
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
      const casualLeaveDaysUTC = casualLeaveDays.map(
        (leave: string) => `${MuiFormatDate(new Date(leave))}T00:00:00Z`
      )
      const newLeave = {
        ...values,
        leaveDates: appliedDate
          ? [appliedDateUTC, endDateUTC]
          : casualLeaveDaysUTC,
        reason: values.reason,
        leaveType: values.leaveType,
        halfDay:
          values?.halfDay === 'full-day' || values?.halfDay === 'Full Day'
            ? ''
            : values?.halfDay,
        leaveStatus: appliedDate ? 'approved' : 'pending',
      }
      setFromDate(`${MuiFormatDate(firstDay)}T00:00:00Z`)
      setToDate(`${MuiFormatDate(lastDay)}T00:00:00Z`)
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
          halfDay: leaveData.halfDay === '' ? 'full-day' : leaveData?.halfDay,
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

  const disableInterval = (index: number) => {
    if (multipleDatesSelected) {
      if (index !== 0) {
        return true
      }
    } else {
      if (index === 0 && (halfLeaveApproved || halfLeavePending)) {
        return true
      }
      if (index === 1 && specificHalf === FIRST_HALF) {
        return true
      }
      if (index === 2 && specificHalf === SECOND_HALF) {
        return true
      }
      return false
    }
  }
  const formFieldChanges = (values: {leaveDatesCasual: Array<string>}) => {
    if (values?.hasOwnProperty('leaveDatesCasual')) {
      if (values?.leaveDatesCasual?.length === 1) {
        setMultipleDatesSelected(false)
        const formattedDate = values?.leaveDatesCasual?.map((d) =>
          MuiFormatDate(new Date(d))
        )
        const newDate = formattedDate?.[0]?.split('-')?.join('/')
        let leaveDate = userLeaves?.filter((leave) => leave.date === newDate)
        setHalfLeaveApproved(
          specifyParticularHalf(leaveDate)?.halfLeaveApproved
        )
        setHalfLeavePending(specifyParticularHalf(leaveDate)?.halfLeavePending)
        setSpecificHalf(specifyParticularHalf(leaveDate)?.specificHalf)
      } else if (values?.leaveDatesCasual?.length === 0) {
        setHalfLeaveApproved(false)
        setHalfLeavePending(false)
        setSpecificHalf(false)
        setMultipleDatesSelected(false)
      } else {
        setMultipleDatesSelected(true)
        setHalfLeaveApproved(false)
        setHalfLeavePending(false)
      }
    }
  }

  const calendarClickHandler = () => {
    const selectedDates = form?.getFieldValue('leaveDatesCasual')
    if (selectedDates?.length > 0) {
      setCalendarClicked(true)
      if (selectedDates?.length > 1) {
        form.setFieldValue('halfDay', 'full-day')
      }
      if (selectedDates?.length === 1) {
        const formattedDate = selectedDates?.map((d: any) =>
          MuiFormatDate(new Date(d))
        )
        let leaveDate = userLeaves?.filter(
          (leave) => leave.date === formattedDate?.[0]?.split('-')?.join('/')
        )
        let specificHalf = specifyParticularHalf(leaveDate)?.specificHalf
        if (specificHalf === FIRST_HALF) {
          form.setFieldValue('halfDay', SECOND_HALF)
        } else if (specificHalf === SECOND_HALF) {
          form.setFieldValue('halfDay', FIRST_HALF)
        } else {
          form.setFieldValue('halfDay', FULL_DAY)
        }
      }
    } else {
      setCalendarClicked(false)
    }
  }
  return (
    <Modal
      width={1100}
      title={!isEditMode ? 'Add Leave' : readOnly ? 'Details' : 'Update Leave'}
      style={{flexDirection: 'row'}}
      visible={open}
      mask={false}
      onOk={onFinish}
      onCancel={() =>
        onClose(
          setSpecificHalf,
          setHalfLeaveApproved,
          setHalfLeavePending,
          setMultipleDatesSelected,
          setCalendarClicked
        )
      }
      footer={
        readOnly
          ? [
              <Button
                key="back"
                onClick={() =>
                  onClose(
                    setSpecificHalf,
                    setHalfLeaveApproved,
                    setHalfLeavePending,
                    setMultipleDatesSelected,
                    setCalendarClicked
                  )
                }
              >
                {CANCEL_TEXT}
              </Button>,
            ]
          : [
              <Button
                key="back"
                onClick={() =>
                  onClose(
                    setSpecificHalf,
                    setHalfLeaveApproved,
                    setHalfLeavePending,
                    setMultipleDatesSelected,
                    setCalendarClicked
                  )
                }
              >
                {CANCEL_TEXT}
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={onFinish}
                disabled={
                  leaveMutation.isLoading || leaveUpdateMutation.isLoading
                }
              >
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
          onValuesChange={(allValues) => formFieldChanges(allValues)}
        >
          <Row>
            <Col span={6} xs={24} sm={16}>
              <Row>
                <Col span={6} xs={24} sm={12}>
                  <Form.Item
                    {...formItemLayout}
                    name="leaveType"
                    label="Leave Type"
                    rules={[
                      {required: true, message: 'Leave Type is required.'},
                    ]}
                  >
                    <Select
                      notFoundContent={emptyText}
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
                  {(((leaveType === 'Casual' ||
                    leaveType === 'Sick' ||
                    leaveType === 'Casual Leave' ||
                    leaveType === 'Sick Leave') &&
                    calendarClicked) ||
                    readOnly) && (
                    <Form.Item
                      {...formItemLayout}
                      label="Leave Interval"
                      name="halfDay"
                      rules={[
                        {
                          required: true,
                          message: 'Leave Interval is required.',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        notFoundContent={emptyText}
                        filterOption={filterOptions}
                        placeholder="Select Duration"
                        style={{width: '100%'}}
                        disabled={readOnly}
                      >
                        {leaveInterval?.map((type, index) => (
                          <Option
                            value={type?.value}
                            key={index}
                            disabled={disableInterval(index)}
                          >
                            {type?.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
                <Col span={6} xs={24} sm={12}>
                  {showWorker && (
                    <Form.Item
                      {...formItemLayout}
                      name="user"
                      label="Co-worker"
                      rules={[
                        {required: true, message: 'Co-worker is required.'},
                      ]}
                    >
                      <Select
                        notFoundContent={emptyText}
                        showSearch
                        filterOption={filterOptions}
                        placeholder="Select Co-worker"
                        onChange={handleUserChange}
                        disabled={readOnly}
                        allowClear
                      >
                        {filterSpecificUser(users, ADMINISTRATOR)?.map(
                          (user: any) => (
                            <Option value={user._id} key={user._id}>
                              {user?.name}
                            </Option>
                          )
                        )}
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
                            if (!value)
                              throw new Error('Leave Reason is required.')

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

              {leaveData?.leaveStatus === 'cancelled' && (
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
                      rules={[
                        {
                          required: true,
                          message: 'Leave Start Date is required.',
                        },
                      ]}
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
                    rules={[
                      {required: true, message: 'Leave Date is required.'},
                    ]}
                  >
                    <Calendar
                      className={darkCalendar ? 'bg-dark' : 'null'}
                      buttons={readOnly ? false : true}
                      onChange={calendarClickHandler}
                      onMonthChange={(date) => monthChangeHandler(date)}
                      numberOfMonths={1}
                      disableMonthPicker
                      disableYearPicker
                      weekStartDayIndex={1}
                      multiple
                      disabled={readOnly}
                      minDate={
                        leaveType === 'Sick' ||
                        leaveType === 'Casual' ||
                        isEditMode
                          ? new DateObject().subtract(2, 'months')
                          : new Date()
                      }
                      mapDays={({date}) => {
                        let isWeekend = [0, 6].includes(date.weekDay.index)
                        let dates = `${date.year}/${date.month}/${date.day}`
                        let calenderDate = MuiFormatDate(dates)
                        let holidayList: any[] = holidays?.filter(
                          (holiday: any) => date.format() === holiday?.date
                        )
                        let isHoliday = holidayList?.length > 0
                        let leaveDate = userLeaves?.filter(
                          (leave) => leave.date === date.format()
                        )
                        const leavePending = pendingLeaves(leaveDate)

                        let leaveAlreadyTakenDates =
                          filterHalfDayLeaves(leaveDate)

                        let selectedDates =
                          form?.getFieldValue('leaveDatesCasual')

                        let checkDataLeave = leaveData?.leaveDates?.map(
                          (date: string) => date && date?.split('T')?.[0]
                        )
                        let editLeave = checkDataLeave?.includes(calenderDate)
                        let filteredDate = selectedDates?.map(
                          (date: string) =>
                            date?.length > 0 && date?.split('T')?.[0]
                        )

                        let disableSelectedDate =
                          filteredDate && filteredDate?.includes(calenderDate)

                        if (readOnly) {
                          if (disableSelectedDate) {
                            return {
                              style: {
                                color: 'white',
                                backgroundColor: '#0074d9',
                              },
                            }
                          } else
                            return {
                              disabled: true,
                              style: {
                                color: '#ccc',
                              },
                            }
                        } else {
                          if (disableSelectedDate || editLeave) {
                            return {
                              onClick: () => setColorState(false),
                              disabled: false,
                              style: {
                                color: colorState ? 'white' : 'null',
                                backgroundColor: colorState
                                  ? '#0074d9'
                                  : 'null',
                              },
                            }
                          }
                        }
                        if (
                          isWeekend ||
                          isHoliday ||
                          leaveAlreadyTakenDates ||
                          leavePending
                        )
                          return {
                            disabled: true,
                            style: {
                              color:
                                isWeekend ||
                                leaveAlreadyTakenDates ||
                                leavePending
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
                              else if (leavePending)
                                notification({
                                  message: `Leave request for the day is pending. Please cancel the previous applied leave to apply again`,
                                })
                            },
                          }
                      }}
                      // disabled={readOnly}
                    />
                  </Form.Item>

                  {!readOnly && (
                    <small
                      style={{
                        color: 'rgb(193 98 98)',
                        fontSize: '14px',
                        width: '10%',
                        paddingLeft: 15,
                      }}
                    >
                      *Disabled dates are holidays
                    </small>
                  )}
                </Col>
              ))}
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default LeaveModal
