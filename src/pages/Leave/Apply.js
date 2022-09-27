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
  Radio,
  DatePicker,
} from 'antd'
import {
  convertDateToUTC,
  filterOptions,
  handleResponse,
  MuiFormatDate,
} from 'helpers/utils'
import React, {useState} from 'react'
import {Calendar, DateObject} from 'react-multi-date-picker'
import {createLeave, getLeavesOfUser, getLeaveTypes} from 'services/leaves'
import {useSelector} from 'react-redux'
import {getTeamLeads} from 'services/users/userDetails'
import {notification} from 'helpers/notification'
import {THEME_TYPE_DARK} from 'constants/ThemeSetting'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import {getAllHolidays} from 'services/resources'
import useWindowsSize from 'hooks/useWindowsSize'

const FormItem = Form.Item
const {TextArea} = Input
const Option = Select.Option

function Apply({user}) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const {themeType} = useSelector(state => state.settings)
  const {innerWidth} = useWindowsSize()
  const darkCalendar = themeType === THEME_TYPE_DARK

  const [leaveType, setLeaveType] = useState('')

  const userLeavesQuery = useQuery(['userLeaves'], () => getLeavesOfUser(user))

  const {data: Holidays} = useQuery(['DashBoardHolidays'], () =>
    getAllHolidays({sort: '-createdAt', limit: '1'})
  )

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    select: res => [
      ...res?.data?.data?.data?.map(type => ({
        id: type._id,
        value: type?.name.replace('Leave', '').trim(),
      })),
    ],
  })
  const teamLeadsQuery = useQuery(['teamLeads'], getTeamLeads, {
    select: res => ({
      ...res.data,
      data: res?.data?.data?.data.map(lead =>
        lead?.role?.key === 'hr' ? {...lead, name: 'Hr'} : lead
      ),
    }),
  })

  const leaveMutation = useMutation(leave => createLeave(leave), {
    onSuccess: response =>
      handleResponse(
        response,
        'Leave submitted successfully',
        'Leave submittion failed',
        [
          () => handleFormReset(),
          () => queryClient.invalidateQueries(['userLeaves']),
          () => queryClient.invalidateQueries(['leaves']),
          () => queryClient.invalidateQueries(['takenAndRemainingLeaveDays']),
        ]
      ),
    onError: error => {
      notification({message: 'Leave submittion failed!', type: 'error'})
    },
  })

  const handleTypesChange = value => {
    setLeaveType(leaveTypeQuery?.data?.find(type => type.id === value).value)
  }

  const handleFormReset = () => {
    form.resetFields()
    setLeaveType('')
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      //calculation for maternity, paternity, pto leaves
      const numberOfLeaveDays =
        values?.leaveType === '630ca23889efb2bce93aeb40' ? 60 : 5 // 60 for maternity, 5 for other two
      const appliedDate = values?.leaveDatesPeriod?._d
      const newDate = new Date(values?.leaveDatesPeriod?._d)
      const endDate = new Date(
        newDate.setDate(appliedDate?.getDate() + numberOfLeaveDays)
      )
      const appliedDateUTC = appliedDate ? convertDateToUTC(appliedDate) : ''
      const endDateUTC = appliedDate ? convertDateToUTC(endDate) : ''

      //calculation for sick, casual leaves
      const casualLeaveDays = appliedDate
        ? []
        : values?.leaveDatesCasual?.join(',').split(',')
      const casualLeaveDaysUTC = casualLeaveDays.map(leave =>
        convertDateToUTC(new Date(leave))
      )

      form.validateFields().then(values =>
        leaveMutation.mutate({
          ...values,
          leaveDates: appliedDate
            ? [appliedDateUTC, endDateUTC]
            : casualLeaveDaysUTC,
          halfDay: values.halfDay,
          leaveStatus: appliedDate ? 'approved' : 'pending',
        })
      )
    })
  }

  let userLeaves = []
  const holidaysThisYear = Holidays?.data?.data?.data?.[0]?.holidays?.map(
    holiday => ({
      date: new DateObject(holiday?.date).format(),
      name: holiday?.title,
    })
  )
  userLeavesQuery?.data?.data?.data?.data?.forEach(leave => {
    if (leave?.leaveDates > 1) {
      for (let i = 0; i < leave?.leaveDates.length; i++) {
        userLeaves.push({
          leaveStatus: leave?.leaveStatus,
          date: new DateObject(leave?.leaveDates[i]).format(),
        })
      }
    } else {
      userLeaves.push({
        leaveStatus: leave?.leaveStatus,
        date: new DateObject(leave?.leaveDates[0]).format(),
      })
    }
  })
  return (
    <Spin spinning={leaveMutation.isLoading}>
      <Form layout="vertical" style={{padding: '15px 0'}} form={form}>
        <Row type="flex">
          {!leaveType || leaveType === 'Casual' || leaveType === 'Sick' ? (
            <Col xs={24} sm={6} md={6} style={{flex: 0.3, marginRight: '4rem'}}>
              <FormItem
                label="Select Leave Dates"
                name="leaveDatesCasual"
                rules={[{required: true, message: 'Required!'}]}
              >
                <Calendar
                  className={darkCalendar ? 'bg-dark' : 'null'}
                  numberOfMonths={1}
                  disableMonthPicker
                  disableYearPicker
                  weekStartDayIndex={1}
                  multiple
                  minDate={
                    leaveType === 'Sick'
                      ? new DateObject().subtract(2, 'months')
                      : new Date()
                  }
                  mapDays={({date, today}) => {
                    let isWeekend = [0, 6].includes(date.weekDay.index)
                    let holidayList = holidaysThisYear?.filter(
                      holiday => date.format() === holiday?.date
                    )
                    let isHoliday = holidayList?.length > 0
                    let leaveDate = userLeaves?.filter(
                      leave => leave.date === date.format()
                    )
                    let leaveAlreadyTakenDates =
                      leaveDate?.length > 0 &&
                      leaveDate?.[0]?.leaveStatus !== 'cancelled'
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
                          if (isWeekend) alert('weekends are disabled')
                          if (isHoliday)
                            alert(`${holidayList[0]?.name} holiday`)
                          if (leaveAlreadyTakenDates)
                            alert(`Leave already taken`)
                        },
                      }
                  }}
                />
              </FormItem>
              <small style={{color: 'red', fontSize: '14px'}}>
                *Disabled dates are holidays"
              </small>
            </Col>
          ) : (
            <FormItem
              style={{marginBottom: '0.5px'}}
              label="Leave Starting Date"
              name="leaveDatesPeriod"
              rules={[{required: true, message: 'Required!'}]}
            >
              <DatePicker
                className="gx-mb-3 "
                style={{width: innerWidth <= 1096 ? '100%' : '300px'}}
              />
            </FormItem>
          )}

          <Col
            span={18}
            xs={24}
            sm={24}
            md={15}
            style={{marginTop: innerWidth < 974 ? '1.2rem' : 0}}
          >
            <Row
              type="flex"
              style={{marginLeft: innerWidth < 764 ? '-15px' : 0}}
            >
              <Col
                span={12}
                xs={24}
                lg={12}
                md={24}
                style={{marginBottom: innerWidth < 974 ? '1.2rem' : 0}}
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
                    {leaveTypeQuery?.data?.map(type =>
                      type.value !== 'Late Arrival' ? (
                        <Option value={type.id} key={type.id}>
                          {type.value}
                        </Option>
                      ) : null
                    )}
                  </Select>
                </FormItem>
                {(leaveType === 'Casual' || leaveType === 'Sick') && (
                  <FormItem label="Half Leave" name="halfDay">
                    <Radio.Group>
                      <Radio value="first-half">First-Half</Radio>
                      <Radio value="second-half">Second-Half</Radio>
                    </Radio.Group>
                  </FormItem>
                )}
              </Col>
              <Col
                span={24}
                xs={24}
                lg={12}
                md={24}
                style={{
                  paddingLeft: innerWidth < 981 ? '15px' : 0,
                  paddingRight: 0,
                }}
              >
                <FormItem
                  label="Select Team Leads"
                  name="assignTo"
                  rules={[{required: true, message: 'Required!'}]}
                >
                  <Checkbox.Group style={{width: '100%'}}>
                    <Row style={{flexDirection: 'row'}}>
                      {teamLeadsQuery?.data?.data?.map(lead => (
                        <Col
                          span={12}
                          key={lead._id}
                          style={{paddingLeft: 0, paddingRight: 0}}
                        >
                          <Checkbox
                            className="gx-mb-3 team-leads"
                            value={lead._id}
                          >
                            {lead.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </FormItem>
              </Col>
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
                          if (trimmedValue?.length < 10) {
                            throw new Error(
                              'Reason should be at least 10 letters!'
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
