import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  Spin,
  Form,
  DatePicker,
} from 'antd'
import {
  filterHalfDayLeaves,
  filterOptions,
  handleResponse,
  MuiFormatDate,
  specifyParticularHalf,
} from 'helpers/utils'
import React, {useState} from 'react'
import {Calendar, DateObject} from 'react-multi-date-picker'
import {
  createLeave,
  getLeavesOfUser,
  getLeaveTypes,
  sendEmailforLeave,
} from 'services/leaves'
import {useSelector} from 'react-redux'
import {getTeamLeads} from 'services/users/userDetails'
import {notification} from 'helpers/notification'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import {getAllHolidays} from 'services/resources'
import useWindowsSize from 'hooks/useWindowsSize'
import {immediateApprovalLeaveTypes} from 'constants/LeaveTypes'
import {disabledDate} from 'util/antDatePickerDisabled'
import {LEAVES_TYPES} from 'constants/Leaves'
import {leaveInterval} from 'constants/LeaveDuration'

const FormItem = Form.Item
const {TextArea} = Input
const Option = Select.Option

function Apply({user}) {
  const [form] = Form.useForm()

  const queryClient = useQueryClient()
  const {themeType} = useSelector((state) => state.settings)
  const {innerWidth} = useWindowsSize()
  const [specificHalf, setSpecificHalf] = useState(false)
  const [halfLeaveApproved, setHalfLeaveApproved] = useState(false)
  const [multipleDatesSelected, setMultipleDatesSelected] = useState(false)
  const [calendarClicked, setCalendarClicked] = useState(false)

  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const [fromDate, setFromDate] = useState(`${MuiFormatDate(firstDay)}T00:00:00Z`)
  const [toDate, setToDate] = useState(`${MuiFormatDate(lastDay)}T00:00:00Z`)

  const monthChangeHandler = (date) => {
    const newMonthDate = new Date(date)
    const firstDay = new Date(newMonthDate.getFullYear(), newMonthDate.getMonth(), 1)
    const lastDay = new Date(newMonthDate.getFullYear(), newMonthDate.getMonth() + 1, 0)
    setFromDate(`${MuiFormatDate(firstDay)}T00:00:00Z`);
    setToDate(`${MuiFormatDate(lastDay)}T00:00:00Z`);
  }

  const darkCalendar = themeType === THEME_TYPE_DARK

  const [leaveType, setLeaveType] = useState('')

  const userLeavesQuery = useQuery(['userLeaves',fromDate,toDate], () =>
    getLeavesOfUser(user, '', undefined, 1, 30,fromDate,toDate)
  )

  const {data: Holidays} = useQuery(['DashBoardHolidays'], () =>
    getAllHolidays({sort: '-createdAt', limit: '1'})
  )

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: (res) => [
      ...res?.data?.data?.data?.map((type) => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })
  const teamLeadsQuery = useQuery(['teamLeads'], getTeamLeads, {
    select: (res) => ({
      ...res.data,
      data: res?.data?.data?.data.map((lead) =>
        lead?.role?.key === 'hr' ? {...lead, name: 'Hr'} : lead
      ),
    }),
  })

  const leaveMutation = useMutation((leave) => createLeave(leave), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave submitted successfully',
        'Leave submittion failed',
        [
          () => handleFormReset(response),
          () => sendEmailNotification(response),
          () => queryClient.invalidateQueries(['userLeaves']),
          () => queryClient.invalidateQueries(['leaves']),
          () => queryClient.invalidateQueries(['takenAndRemainingLeaveDays']),
        ]
      ),
    onError: (error) => {
      notification({message: 'Leave submittion failed!', type: 'error'})
    },
  })

  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))

  const sendEmailNotification = (res) => {
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      user: res.data.data.data.user,
    })
  }

  const handleTypesChange = (value) => {
    setLeaveType(leaveTypeQuery?.data?.find((type) => type.id === value).value)
  }

  const handleFormReset = () => {
    form.resetFields()
    setLeaveType('')
    setMultipleDatesSelected(false)
    setHalfLeaveApproved(false)
    setSpecificHalf(false)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const leaveTypeName = leaveTypeQuery?.data?.find(
        (type) => type?.id === values?.leaveType
      )?.value
      // calculation for maternity, paternity, pto leaves
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
      const casualLeaveDaysUTC = casualLeaveDays.map((leave) =>
        MuiFormatDate(new Date(leave))
      )
      form.validateFields().then((values) =>
        leaveMutation.mutate({
          ...values,
          leaveDates: appliedDate
            ? [appliedDateUTC, endDateUTC]
            : casualLeaveDaysUTC,
          halfDay:
            values?.halfDay === 'full-day' || values?.halfDay === 'Full Day'
              ? ''
              : values?.halfDay,
          leaveStatus: appliedDate ? 'approved' : 'pending',
        })
      )
    })
  }
  let userLeaves = []
  const holidaysThisYear = Holidays?.data?.data?.data?.[0]?.holidays?.map(
    (holiday) => ({
      date: new DateObject(holiday?.date).format(),
      name: holiday?.title,
    })
  )
  userLeavesQuery?.data?.data?.data?.data?.forEach((leave) => {
    if (leave?.leaveDates?.length > 1) {
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

  const disableInterval = (index) => {
    if (multipleDatesSelected && index !== 0) {
      return true
    } else {
      if (index === 0 && halfLeaveApproved) {
        return true
      }
      if (index === 1 && specificHalf === 'first-half') {
        return true
      }
      if (index === 2 && specificHalf === 'second-half') {
        return true
      }
      return false
    }
  }

  const formFieldChanges = (values) => {
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
        setSpecificHalf(specifyParticularHalf(leaveDate)?.specificHalf)
      } else if (values?.leaveDatesCasual?.length === 0) {
        setHalfLeaveApproved(false)
        setSpecificHalf(false)
        setMultipleDatesSelected(false)
      } else {
        setMultipleDatesSelected(true)
        setHalfLeaveApproved(false)
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
        const formattedDate = selectedDates?.map((d) =>
          MuiFormatDate(new Date(d))
        )
        let leaveDate = userLeaves?.filter(
          (leave) => leave.date === formattedDate?.[0]?.split('-')?.join('/')
        )
        let specificHalf = specifyParticularHalf(leaveDate)?.specificHalf
        if (specificHalf === 'first-half') {
          form.setFieldValue('halfDay', 'second-half')
        } else if (specificHalf === 'second-half') {
          form.setFieldValue('halfDay', 'first-half')
        } else {
          form.setFieldValue('halfDay', 'full-day')
        }
      }
    } else {
      setCalendarClicked(false)
    }
  }


  return (
    <Spin spinning={leaveMutation.isLoading}>
      <Form
        layout="vertical"
        style={{padding: '15px 0'}}
        form={form}
        onValuesChange={(allValues) => formFieldChanges(allValues)}
      >
        <Row type="flex">
          {!immediateApprovalLeaveTypes.includes(leaveType) && (
            <Col xs={24} sm={6} md={6} style={{flex: 0.3, marginRight: '4rem'}}>
              <FormItem
                label="Select Leave Dates"
                name="leaveDatesCasual"
                rules={[{required: true, message: 'Required!'}]}
              >
                <Calendar
                  className={darkCalendar ? 'bg-dark' : 'null'}
                  onChange={calendarClickHandler}
                  numberOfMonths={1}
                  disableMonthPicker
                  disableYearPicker
                  onMonthChange={(date)=>monthChangeHandler(date)}
                  weekStartDayIndex={1}
                  multiple
                  minDate={
                    leaveType === 'Sick' || leaveType === 'Casual'
                      ? new DateObject().subtract(2, 'months')
                      : new Date()
                  }
                  mapDays={({date, today, selectedDate}) => {
                    let isWeekend = [0, 6].includes(date.weekDay.index)
                    let holidayList = holidaysThisYear?.filter(
                      (holiday) => date.format() === holiday?.date
                    )
                    let isHoliday = holidayList?.length > 0
                    let leaveDate = userLeaves?.filter(
                      (leave) => leave.date === date.format()
                    )
                    let leaveAlreadyTakenDates = filterHalfDayLeaves(leaveDate)
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
                />
              </FormItem>
              <small style={{color: 'red', fontSize: '14px'}}>
                *Disabled dates are holidays"
              </small>
            </Col>
          )}

          <Col
            span={18}
            xs={24}
            sm={24}
            md={immediateApprovalLeaveTypes.includes(leaveType) ? 24 : 15}
          >
            <Row
              type="flex"
              style={{marginLeft: innerWidth < 764 ? '-15px' : 0}}
            >
              <Col
                span={12}
                xs={24}
                lg={immediateApprovalLeaveTypes.includes(leaveType) ? 6 : 10}
                md={24}
                // style={{marginBottom: innerWidth < 974 ? '1.2rem' : 0}}
              >
                <FormItem
                  label="Leave Type"
                  name="leaveType"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Select
                    showSearch
                    filterOption={filterOptions}
                    placeholder="Select Type"
                    style={{width: '100%'}}
                    onChange={handleTypesChange}
                  >
                    {leaveTypeQuery?.data?.map((type) =>
                      type.value !== 'Late Arrival' ? (
                        <Option value={type.id} key={type.id}>
                          {type.value}
                        </Option>
                      ) : null
                    )}
                  </Select>
                </FormItem>
                {(leaveType === 'Casual' || leaveType === 'Sick') &&
                  calendarClicked && (
                    <FormItem
                      label="Leave Interval"
                      name="halfDay"
                      rules={[{required: true, message: 'Required!'}]}
                    >
                      <Select
                        showSearch
                        filterOption={filterOptions}
                        placeholder="Select Duration"
                        style={{width: '100%'}}
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
                    </FormItem>
                  )}
              </Col>
              {immediateApprovalLeaveTypes.includes(leaveType) && (
                <Col
                  span={24}
                  xs={24}
                  lg={6}
                  md={24}
                  style={{
                    paddingLeft: innerWidth < 981 ? '15px' : 0,
                    paddingRight: innerWidth < 981 ? '15px' : 0,
                  }}
                >
                  <FormItem
                    style={{marginBottom: '0.5px'}}
                    label="Leave Starting Date"
                    name="leaveDatesPeriod"
                    rules={[{required: true, message: 'Required!'}]}
                  >
                    <DatePicker
                      className="gx-mb-3 "
                      style={{width: '100%'}}
                      disabledDate={disabledDate}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row style={{marginLeft: innerWidth < 764 ? '-15px' : 0}}>
              <Col span={24}>
                <FormItem
                  label="Leave Reason"
                  name="reason"
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
                  <TextArea placeholder="Enter Leave Reason" rows={10} />
                </FormItem>
                <div>
                  <Button type="primary" onClick={handleSubmit}>
                    Apply
                  </Button>
                  <Button type="danger" onClick={handleFormReset}>
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Spin>
  )
}

export default Apply
