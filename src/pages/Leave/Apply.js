import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {STATUS_TYPES} from 'constants/Leaves'
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Spin,
  Form,
  DatePicker,
  Modal,
  ConfigProvider,
} from 'antd'
import {
  compare,
  filterHalfDayLeaves,
  filterOptions,
  getDateRangeArray,
  getIsAdmin,
  getRangeofDates,
  handleResponse,
  momentRangeofDates,
  MuiFormatDate,
  pendingLeaves,
  removeDash,
  specifyParticularHalf,
} from 'helpers/utils'
import React, {useState, useRef, useEffect} from 'react'
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
import {leaveInterval} from 'constants/LeaveDuration'
import {getLeaveQuarter} from 'services/settings/leaveQuarter'
import {emptyText} from 'constants/EmptySearchAntd'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'
import RoleAccess from 'constants/RoleAccess'
import moment from 'moment'
import {ExclamationCircleFilled} from '@ant-design/icons'
import DragAndDropFile from 'components/Modules/DragAndDropFile'
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import en_GB from 'antd/lib/locale-provider/en_GB'
import {storage} from 'firebase'
const FormItem = Form.Item
const {TextArea} = Input
const Option = Select.Option

function Apply({
  user,
  YearlyLeaveExceptCasualandSick,
  nextYearSpecialLeaves,
  fiscalYearEndDate,
}) {
  const [form] = Form.useForm()

  const queryClient = useQueryClient()
  const [datePickerValue, setDatePickerValue] = useState([])
  const {themeType} = useSelector((state) => state.settings)
  const {innerWidth} = useWindowsSize()
  const [specificHalf, setSpecificHalf] = useState(false)
  const [halfLeaveApproved, setHalfLeaveApproved] = useState(false)
  const [halfLeavePending, setHalfLeavePending] = useState(false)
  const [multipleDatesSelected, setMultipleDatesSelected] = useState(false)
  const [calendarClicked, setCalendarClicked] = useState(false)
  const [yearStartDate, setYearStartDate] = useState(undefined)
  const [yearEndDate, setYearEndDate] = useState(undefined)
  const [openModal, setOpenModal] = useState(false)
  const [newDateArr, setNewDateArr] = useState([])
  const [datepickerOpen, setDatepickerOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [subId, setSubId] = useState(undefined)
  const [, setRemovedFile] = useState(null)
  const [openCasualLeaveExceedModal, setOpenCasualLeaveExceedModal] =
    useState(false)

  const {
    name,
    email,
    role,
    gender: userGender,
    status: userStatus,
  } = useSelector(selectAuthUser)

  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const [fromDate, setFromDate] = useState(
    `${MuiFormatDate(firstDay)}T00:00:00Z`
  )
  const [toDate, setToDate] = useState(`${MuiFormatDate(lastDay)}T00:00:00Z`)

  const datePIckerRef = useRef()

  const handleOutsideClick = (event) => {
    if (datePIckerRef && !datePIckerRef?.current?.contains(event?.target)) {
      setDatepickerOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const monthChangeHandler = (date) => {
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

  const [leaveType, setLeaveType] = useState('')

  const userLeavesQuery = useQuery(
    ['userLeaves', fromDate, toDate],
    () => getLeavesOfUser(user, '', undefined, '', '', fromDate, toDate),
    {
      refetchOnWindowFocus: true,
    }
  )

  const {data: Holidays} = useQuery(['DashBoardHolidays'], () =>
    getAllHolidays({sort: '-createdAt', limit: '1'})
  )

  const disableSpecialHoliday = (current) => {
    //get start date of quarter
    const firstQuarterDate =
      leaveQuarter?.data?.data?.data?.[0]?.quarters?.[0]?.fromDate

    const utcCurrent = new Date(current)
    utcCurrent.setUTCHours(0, 0, 0, 0)

    const isLessthanFirstQuarter = utcCurrent < new Date(firstQuarterDate)

    const isWeekend =
      new Date(current).getDay() === 0 || new Date(current).getDay() === 6

    const testDate = new Date(current)
    const currentDate = testDate
      .toISOString()
      .substring(0, 10)
      ?.replaceAll('-', '/')

    let holidayList = holidaysThisYear?.filter(
      (holiday) => currentDate === holiday?.date
    )
    let isHoliday = holidayList?.length > 0
    let leaveDate = userLeaves?.filter((leave) => leave.date === currentDate)

    const leavePending = pendingLeaves(leaveDate)
    let leaveAlreadyTakenDates = filterHalfDayLeaves(leaveDate)

    return (
      isWeekend ||
      isHoliday ||
      leavePending ||
      leaveAlreadyTakenDates ||
      isLessthanFirstQuarter
    )
  }

  const {data: leaveQuarter} = useQuery(
    ['leaveQuarter'],
    () => getLeaveQuarter(),
    {
      onSuccess: (data) => {
        const quarterLength = data?.data?.data?.data?.[0]?.quarters?.length - 1
        setYearStartDate(data?.data?.data?.data?.[0]?.quarters?.[0]?.fromDate)
        setYearEndDate(
          data?.data?.data?.data?.[0]?.quarters?.[quarterLength]?.toDate
        )
      },
    }
  )

  const userSubstituteLeave = useQuery(
    ['substitute', yearStartDate, yearEndDate],
    () =>
      getLeavesOfUser(user, '', undefined, '', '', yearStartDate, yearEndDate),
    {enabled: !!yearStartDate && !!yearEndDate}
  )

  const leaveTypeQuery = useQuery(['leaveType'], getLeaveTypes, {
    onSuccess: (data) => {
      const substituteId = data?.find((d) => d.name === 'Substitute Leave')?._id
      setSubId(substituteId)
    },
    select: (res) => {
      return [
        ...(res?.data?.data?.data?.map((type) => ({
          ...type,
          id: type._id,
          value: type?.name.replace('Leave', '').trim(),
          leaveDays: type?.leaveDays,
        })) || []),
      ]
    },
  })

  const substituteLeavesTaken = useQuery(
    ['substitute', yearStartDate, yearEndDate, subId],
    () =>
      getLeavesOfUser(
        user,
        '',
        undefined,
        '',
        '',
        yearStartDate,
        yearEndDate,
        '',
        subId
      ),
    {enabled: !!yearStartDate && !!yearEndDate && !!subId}
  )

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
          () => queryClient.invalidateQueries(['substitute']),
          () => queryClient.invalidateQueries(['takenAndRemainingLeaveDays']),
          () => {
            socket.emit('CUD')
          },
          () => {
            socket.emit('dashboard-pending')
          },
          () => {
            socket.emit('apply-leave', {
              showTo: [
                RoleAccess.Admin,
                RoleAccess.HumanResource,
                RoleAccess.ProjectManager,
                RoleAccess.TeamLead,
              ],
              remarks: `${name} has applied for leave. Please review.`,
              module: 'Leave',
            })
          },
        ]
      ),
    onError: (error) => {
      notification({message: 'Leave submittion failed!', type: 'error'})
    },
  })

  const emailMutation = useMutation((payload) => sendEmailforLeave(payload))

  const sendEmailNotification = (res) => {
    const leaveType = leaveTypeQuery?.data?.find(
      (type) => type.id === res.data.data.data.leaveType
    )?.value
    const halfLeave = res.data.data.data.halfDay
      ? removeDash(res.data.data.data.halfDay)
      : 'Full Day'
    emailMutation.mutate({
      leaveStatus: res.data.data.data.leaveStatus,
      leaveDates: res.data.data.data.leaveDates,
      user:
        res.data.data.data.leaveStatus === STATUS_TYPES[1].id
          ? {name, email}
          : res.data.data.data.user,
      leaveReason: res.data.data.data.reason,
      leaveType: `${leaveType} ${halfLeave}`,
    })
  }

  const handleTypesChange = (value) => {
    setDatePickerValue([])
    setLeaveType(leaveTypeQuery?.data?.find((type) => type.id === value))
  }

  const handleFormReset = () => {
    form.resetFields()
    setLeaveType('')
    setMultipleDatesSelected(false)
    setHalfLeaveApproved(false)
    setHalfLeavePending(false)
    setSpecificHalf(false)
    setCalendarClicked(false)
    setFiles([])
  }

  //condition to check holidays and weekends
  const handleLeaveCheck = () => {
    form.validateFields().then((values) => {
      const LeaveTypeData = leaveTypeQuery?.data?.find(
        (type) => type?.id === values?.leaveType
      )

      let selectedDatesArr = []

      if (!LeaveTypeData?.isSpecial) {
        const selectedDates = form?.getFieldValue('leaveDatesCasual')
        const formattedDate = selectedDates?.map((d) => ({
          index: moment(MuiFormatDate(new Date(d))).day(),
          date: MuiFormatDate(new Date(d)),
        }))
        const sortedDate = formattedDate.sort(compare)
        let holidayList = holidaysThisYear?.map((holiday) => {
          return MuiFormatDate(moment(holiday?.date).format())
        })
        if (selectedDates.length > 1) {
          sortedDate?.forEach((d, index) => {
            if (sortedDate[index + 1]) {
              let dateRange = getDateRangeArray(
                d?.date,
                sortedDate[index + 1]?.date
              )
              let filteredDateRange = dateRange.filter(
                (d, index) => index !== 0 && index !== dateRange.length - 1
              )
              let filteredDateRangeWithIndex = filteredDateRange?.map((d) => ({
                index: moment(d).day(),
                date: d,
              }))
              let includesHolidayAndWeekend =
                filteredDateRangeWithIndex.length > 0 &&
                filteredDateRangeWithIndex?.every(
                  (d) =>
                    d.index === 0 ||
                    d.index === 6 ||
                    holidayList.includes(d.date)
                )
              if (includesHolidayAndWeekend) {
                selectedDatesArr.push(
                  ...filteredDateRangeWithIndex.map((d) =>
                    moment(d.date).format('YYYY/MM/DD')
                  )
                )
              }
            }
          })
          setNewDateArr(selectedDatesArr)
        }

        if (selectedDatesArr?.length > 0) {
          setOpenModal(true)
        } else {
          handleSubmit()
        }
      } else {
        handleSubmit()
      }
    })
  }

  const handleSubmit = async () => {
    await form.validateFields().then(async (values) => {
      const leaveType = leaveTypeQuery?.data?.find(
        (type) => type?.id === values?.leaveType
      )
      //code for exceeded casual leaves
      if (leaveType?.value === 'Casual') {
        let currentCasualLeaveDaysApplied =
          values?.leaveDatesCasual?.length > 1
            ? values?.leaveDatesCasual?.length + newDateArr?.length
            : values?.halfDay === 'full-day'
            ? 1
            : 0.5

        let previouslyAppliedCasualLeaves =
          userSubstituteLeave?.data?.data?.data?.data
            ?.filter(
              (leave) =>
                leave?.leaveType?.name === 'Casual Leave' &&
                (leave?.leaveStatus === 'pending' ||
                  leave?.leaveStatus === 'approved')
            )
            .map((item) => {
              if (item?.halfDay === '') {
                return {...item, count: item?.leaveDates?.length}
              } else return {...item, count: 0.5}
            })
        const casualLeavesCount = previouslyAppliedCasualLeaves?.reduce(
          (acc, cur) => acc + cur.count,
          0
        )

        const allocatedCasualLeaves = leaveTypeQuery?.data?.find(
          (leave) => leave.value === 'Casual'
        )?.leaveDays

        if (
          allocatedCasualLeaves <
          casualLeavesCount + currentCasualLeaveDaysApplied
        ) {
          setOpenCasualLeaveExceedModal(true)
          return
        }
      }
      //code for substitute leave
      const isSubstitute = leaveTypeQuery?.data?.find(
        (data) => data?.value === 'Substitute'
      )
      if (isSubstitute?.id === form.getFieldValue('leaveType')) {
        let substituteLeaveApplied = 0

        const hasSubstitute =
          substituteLeavesTaken?.data?.data?.data?.data.filter(
            (sub) =>
              sub?.leaveStatus === 'approved' || sub?.leaveStatus === 'pending'
          )

        hasSubstitute.forEach((e) => {
          if (e.halfDay) {
            substituteLeaveApplied += 0.5
          } else {
            substituteLeaveApplied += e.leaveDates.length
          }
        })

        const substituteLeaveApply =
          form.getFieldValue('halfDay') !== 'full-day'
            ? substituteLeaveApplied + 0.5
            : substituteLeaveApplied +
              form.getFieldValue('leaveDatesCasual')?.length

        if (substituteLeaveApplied >= isSubstitute?.leaveDays) {
          return notification({
            type: 'error',
            message: 'Substitute Leave has already been applied.',
          })
        }

        if (substituteLeaveApply > isSubstitute?.leaveDays) {
          return notification({
            type: 'error',
            message: `Substitute leave cannot exceed more than ${
              isSubstitute?.leaveDays
            } day as your remaining leave is ${
              isSubstitute?.leaveDays - substituteLeaveApplied
            }.`,
          })
        }
      }

      let LeaveDaysUTC = []

      // calculation for maternity, paternity, pto leaves

      const appliedDate = values?.leaveDatesPeriod?.startOf('day')?._d
      if (leaveType?.isSpecial) {
        const specialLeavesApproved = YearlyLeaveExceptCasualandSick?.map(
          (item) => item?.[0]
        )
        //if special leave is applied before the end of the current fiscal year
        if (moment(fiscalYearEndDate) > moment(appliedDate)) {
          if (specialLeavesApproved?.includes(leaveType?.name)) {
            return notification({
              type: 'error',
              message: `Sorry,You have already taken ${leaveType?.name} leave in this fiscal year.`,
            })
          }
        } else {
          // checking if the special leave already exists in the next fiscal year
          const leaveAppliedInNextYear = nextYearSpecialLeaves?.find(
            (leave) => leave?.leaveType?.name === leaveType?.name
          )
          //calculating the number of days the leave is allocated in the next fiscal year
          const numberOfAppliedDaysInNextYear =
            leaveAppliedInNextYear?.leaveDates?.filter(
              (date) => moment(date) > moment(fiscalYearEndDate)
            )?.length
          if (
            leaveAppliedInNextYear &&
            numberOfAppliedDaysInNextYear >=
              leaveAppliedInNextYear?.leaveDates?.length
          ) {
            return notification({
              type: 'error',
              message: `Sorry,You have already taken ${leaveType?.name} leave in this fiscal year.`,
            })
          }
        }

        LeaveDaysUTC = getRangeofDates(
          values?.leaveDatesPeriod?._d,
          leaveType?.leaveDays
        )
      }

      //calculation for sick, casual leaves
      else {
        const casualLeaveDays = [
          ...values?.leaveDatesCasual?.join(',').split(','),
          ...newDateArr,
        ]

        LeaveDaysUTC = casualLeaveDays
          ?.map((leave) => `${MuiFormatDate(new Date(leave))}T00:00:00Z`)
          .sort((a, b) => a.localeCompare(b))
      }

      // document upload to firebase
      if (files[0]?.originFileObj) {
        const storageRef = ref(storage, `leaves/${files[0]?.name}`)
        const uploadTask = uploadBytesResumable(
          storageRef,
          files[0]?.originFileObj
        )
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.log(error.message)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFromDate(`${MuiFormatDate(firstDay)}T00:00:00Z`)
              setToDate(`${MuiFormatDate(lastDay)}T00:00:00Z`)
              form.validateFields().then((values) =>
                leaveMutation.mutate({
                  ...values,
                  leaveDates: LeaveDaysUTC,
                  halfDay:
                    values?.halfDay === 'full-day' ||
                    values?.halfDay === 'Full Day'
                      ? ''
                      : values?.halfDay,
                  leaveStatus:
                    appliedDate || ['admin', 'hr'].includes(role?.key)
                      ? 'approved'
                      : 'pending',
                  leaveDocument: downloadURL,
                })
              )
            })
          }
        )
      } else {
        setFromDate(`${MuiFormatDate(firstDay)}T00:00:00Z`)
        setToDate(`${MuiFormatDate(lastDay)}T00:00:00Z`)
        form.validateFields().then((values) => {
          delete values.leaveDatesCasual
          leaveMutation.mutate({
            ...values,
            leaveDates: LeaveDaysUTC,
            halfDay:
              values?.halfDay === 'full-day' || values?.halfDay === 'Full Day'
                ? ''
                : values?.halfDay,
            leaveStatus:
              appliedDate || ['admin', 'hr'].includes(role?.key)
                ? 'approved'
                : 'pending',
          })
        })
      }
    })
    setOpenModal(false)
    setNewDateArr([])
  }
  let userLeaves = []
  const holidaysThisYear = Holidays?.data?.data?.data?.[0]?.holidays
    ?.map((holiday) => ({
      date: new DateObject(holiday?.date).format(),
      name: holiday?.title,
      allowLeaveApply: holiday?.allowLeaveApply,
    }))
    .filter((d) => !d?.allowLeaveApply)
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
    if (multipleDatesSelected) {
      if (index !== 0) {
        return true
      }
    } else {
      if (index === 0 && (halfLeaveApproved || halfLeavePending)) {
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

  function handleOpenChange(open) {
    setDatepickerOpen(true)
  }

  return (
    <Spin spinning={leaveMutation.isLoading}>
      <Modal
        title={'Sorry, Cannot Apply Casual Leave'}
        visible={openCasualLeaveExceedModal}
        mask={false}
        onCancel={() => setOpenCasualLeaveExceedModal(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setOpenCasualLeaveExceedModal(false)}
          >
            Close
          </Button>,
        ]}
      >
        <p>
          <ExclamationCircleFilled style={{color: '#faad14'}} /> “Your casual
          leave application exceeds the leave available to you! You can either
          apply it as a separate application or discuss this with HR/Management”
        </p>
      </Modal>
      <Modal
        title={`Are you sure?`}
        visible={openModal}
        mask={false}
        onCancel={() => setOpenModal(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setOpenModal(false)
              setNewDateArr([])
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={leaveMutation.isLoading}
          >
            Apply
          </Button>,
        ]}
      >
        <p>
          <ExclamationCircleFilled style={{color: '#faad14'}} /> If there is a
          public holiday or weekend in between the leave dates that you have
          applied, it will also be counted as a leave date.
        </p>
      </Modal>

      <Form
        layout="vertical"
        style={{padding: '15px 0'}}
        form={form}
        onValuesChange={(allValues) => formFieldChanges(allValues)}
      >
        <Row type="flex">
          {!leaveType?.isSpecial && (
            <Col xs={24} sm={6} md={6} style={{flex: 0.3, marginRight: '4rem'}}>
              <FormItem
                label="Select Leave Dates"
                name="leaveDatesCasual"
                rules={[{required: true, message: 'Leave Dates is required.'}]}
              >
                <Calendar
                  className={darkCalendar ? 'bg-dark' : 'null'}
                  onChange={calendarClickHandler}
                  disabled={getIsAdmin()}
                  numberOfMonths={1}
                  disableMonthPicker
                  disableYearPicker
                  onMonthChange={(date) => monthChangeHandler(date)}
                  weekStartDayIndex={1}
                  multiple
                  minDate={
                    leaveType?.value === 'Sick' || leaveType?.value === 'Casual'
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
                    const leavePending = pendingLeaves(leaveDate)
                    let leaveAlreadyTakenDates = filterHalfDayLeaves(leaveDate)
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
                            isWeekend || leaveAlreadyTakenDates || leavePending
                              ? '#ccc'
                              : 'rgb(237 45 45)',
                        },
                        onClick: () => {
                          if (isWeekend)
                            notification({message: 'Weekends are disabled.'})
                          else if (isHoliday)
                            notification({
                              message: `${holidayList[0]?.name} Holiday`,
                            })
                          else if (leaveAlreadyTakenDates)
                            notification({
                              message: `Leave already registered for the day.`,
                            })
                          else if (leavePending)
                            notification({
                              message: `Leave request for the day is pending. Please cancel the previously applied leave requests to apply again`,
                            })
                        },
                      }
                  }}
                />
              </FormItem>
              <small style={{color: 'rgb(193 98 98)', fontSize: '14px'}}>
                *Disabled dates are holidays
              </small>
            </Col>
          )}

          <Col span={18} xs={24} sm={24} md={leaveType?.isSpecial ? 24 : 15}>
            <Row
              type="flex"
              style={{marginLeft: innerWidth < 764 ? '-15px' : 0}}
            >
              <Col
                span={12}
                xs={24}
                lg={leaveType?.isSpecial ? 6 : 10}
                md={24}
                // style={{marginBottom: innerWidth < 974 ? '1.2rem' : 0}}
              >
                <FormItem
                  label="Leave Type"
                  name="leaveType"
                  rules={[{required: true, message: 'Leave Type is required.'}]}
                >
                  <Select
                    disabled={getIsAdmin()}
                    showSearch
                    notFoundContent={emptyText}
                    filterOption={filterOptions}
                    placeholder="Select Type"
                    style={{width: '100%'}}
                    onChange={handleTypesChange}
                  >
                    {leaveTypeQuery?.data
                      ?.filter((d) => {
                        const showToProbation =
                          userStatus === 'Probation' ? d?.Probation : true
                        return (
                          d?.gender?.includes(userGender) && showToProbation
                        )
                      })
                      .map((type) =>
                        type.value !== 'Late Arrival' ? (
                          <Option value={type.id} key={type.id}>
                            {type.value}
                          </Option>
                        ) : null
                      )}
                  </Select>
                </FormItem>
                {!leaveType?.isSpecial && calendarClicked && (
                  <FormItem
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
                      disabled={getIsAdmin()}
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
              {leaveType?.isSpecial && (
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
                  <ConfigProvider locale={en_GB}>
                    <div ref={datePIckerRef}>
                      <FormItem
                        style={{marginBottom: '0.5px'}}
                        label="Leave Starting Date"
                        name="leaveDatesPeriod"
                        rules={[
                          {
                            required: true,
                            message: 'Leave Starting Date is required.',
                          },
                        ]}
                      >
                        <DatePicker
                          className="gx-mb-3 "
                          style={{width: '100%'}}
                          open={datepickerOpen}
                          disabledDate={disableSpecialHoliday}
                          onOpenChange={handleOpenChange}
                          onPanelChange={(value, mode) => {
                            const startOfMonth = moment(value).startOf('month')
                            const endOfMonth = moment(value).endOf('month')

                            setFromDate(startOfMonth.utc().format())
                            setToDate(endOfMonth.utc().format())
                          }}
                          onChange={(date) => {
                            setDatepickerOpen(true)
                            const leaveTypeId = form?.getFieldValue('leaveType')

                            const leaveType = leaveTypeQuery?.data?.find(
                              (type) => type?.id === leaveTypeId
                            )
                            let Initdates = momentRangeofDates(
                              date,
                              leaveType?.leaveDays
                            )

                            setDatePickerValue(Initdates)
                          }}
                          dateRender={(current) => {
                            let style = {}
                            if (
                              datePickerValue.some((d) => d.isSame(current))
                            ) {
                              style = {color: '#fff', background: '#038fde'}
                            }
                            return (
                              <div
                                className="ant-picker-cell-inner"
                                style={style}
                              >
                                {current.date()}
                              </div>
                            )
                          }}
                          renderExtraFooter={() => (
                            <small
                              style={{
                                color: 'rgb(193 98 98)',
                                fontSize: '12px',
                              }}
                            >
                              *Disabled dates are holidays/ leaves taken
                            </small>
                          )}
                        />
                      </FormItem>
                    </div>
                  </ConfigProvider>
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
                  <TextArea
                    placeholder="Enter Leave Reason"
                    rows={10}
                    disabled={getIsAdmin()}
                  />
                </FormItem>
                <FormItem
                  label="Select Document to Upload"
                  name="leaveDocument"
                >
                  <DragAndDropFile
                    files={files}
                    setFiles={setFiles}
                    onRemove={setRemovedFile}
                    allowMultiple={false}
                    accept=".pdf, image/png, image/jpeg"
                  />
                </FormItem>
                <div>
                  <Button
                    type="primary"
                    // onClick={extraLeave ? '' : submit}
                    onClick={handleLeaveCheck}
                    disabled={getIsAdmin()}
                  >
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
