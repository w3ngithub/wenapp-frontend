import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {
  Button,
  Table,
  Form,
  DatePicker,
  Divider,
  Input,
  InputNumber,
} from 'antd'
import moment from 'moment'
import {CSVLink} from 'react-csv'
import {
  attendanceFilter,
  ATTENDANCE_COLUMNS,
  intialDate,
  monthlyState,
  OfficeHourFilter,
  weeklyState,
} from 'constants/Attendance'
import {
  searchAttendacentOfUser,
  searchLateAttendacentOfUser,
} from 'services/attendances'
import {
  dateDifference,
  getIsAdmin,
  hourIntoMilliSecond,
  milliSecondIntoHours,
  MuiFormatDate,
  sortFromDate,
} from 'helpers/utils'
import ViewDetailModel from '../ViewDetailModel'
import {notification} from 'helpers/notification'
import Select from 'components/Elements/Select'
import {getAllUsers} from 'services/users/userDetails'
import TmsAdminAttendanceForm from 'components/Modules/TmsAdminAttendanceForm'
import TmsAdminAddAttendanceForm from 'components/Modules/TmsAdminAttendanceForm/Add'
import CustomIcon from 'components/Elements/Icons'
import {useLocation} from 'react-router-dom'
import AccessWrapper from 'components/Modules/AccessWrapper'
import RoleAccess, {
  ATTENDANCE_CO_WORKER_ATTENDANCE_ADD_NO_ACCESS,
} from 'constants/RoleAccess'
import {emptyText} from 'constants/EmptySearchAntd'

const {RangePicker} = DatePicker
const FormItem = Form.Item

const formattedAttendances = (attendances) => {
  return attendances?.map((att) => {
    let timeInMilliSeconds = att?.data
      ?.map((x) =>
        x?.punchOutTime
          ? new Date(x?.punchOutTime) - new Date(x?.punchInTime)
          : ''
      )
      .filter(Boolean)
      ?.reduce((accumulator, value) => {
        return accumulator + value
      }, 0)

    return {
      ...att,
      key: att._id.attendanceDate + att._id.user,
      user: att._id.user,
      attendanceDate: moment(att?._id.attendanceDate).format('LL'),
      attendanceDay: moment(att?._id.attendanceDate).format('dddd'),
      punchInTime: moment(att?.data?.[0]?.punchInTime).format('LTS'),
      punchOutTime: att?.data?.[att?.data.length - 1]?.punchOutTime
        ? moment(att?.data?.[att?.data.length - 1]?.punchOutTime).format('LTS')
        : '',
      officeHour: milliSecondIntoHours(att?.officehour),
      intHour: timeInMilliSeconds,
    }
  })
}

function AdminAttendance({userRole}) {
  //init hooks
  const {state} = useLocation()
  const [sort, setSort] = useState({
    order: undefined,
    field: undefined,
    columnKey: undefined,
  })
  const [form] = Form.useForm()
  const [page, setPage] = useState({page: 1, limit: 10})
  const [defaultFilter, setDefaultFilter] = useState({op: 'gte', num: 9})
  const [openView, setOpenView] = useState(false)
  const [attToView, setAttToView] = useState({})
  const [date, setDate] = useState(intialDate)
  const [user, setUser] = useState(undefined)
  const [attFilter, setAttFilter] = useState({id: '1', value: 'Daily'})
  const [toggleAdd, setToggleAdd] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)
  const [AttToEdit, setAttToEdit] = useState({})
  const [dataToExport, setdataToExport] = useState({
    todownload: false,
    data: [],
    loading: false,
  })
  const CSVRef = useRef()

  useEffect(() => {
    if (dataToExport.todownload) {
      CSVRef.current.link.click()
    }
  }, [dataToExport])

  // set inital date to date selected from Co-workers attendance calendar
  useEffect(() => {
    if (state?.date && state?.user) {
      setDate([moment(state.date), moment(state.date)])
      setUser(state?.user)
    }
  }, [state?.date, state?.user])

  const {data: users} = useQuery(['userForAttendances'], () =>
    getAllUsers({fields: 'name', active: 'true', sort: 'name'})
  )

  const {data, isLoading, isFetching} = useQuery(
    ['adminAttendance', user, date, page, sort, defaultFilter],
    () => {
      let sortField = ''
      if (sort?.order) {
        const order = sort.order === 'ascend' ? '' : '-'
        sortField = `${order}${sort.columnKey}`
      }

      return searchAttendacentOfUser({
        page: page.page + '',
        limit: page.limit + '',
        userId: user || '',
        fromDate: date?.[0] ? MuiFormatDate(date[0]._d) + 'T00:00:00Z' : '',
        toDate: date?.[1] ? MuiFormatDate(date[1]._d) + 'T00:00:00Z' : '',
        sort: sortField,
        officehourop: defaultFilter?.op,
        officehourValue: hourIntoMilliSecond(defaultFilter?.num),
      })
    }
  )

  const handleChangeDate = (date) => {
    setDate(date ? date : intialDate)
    if (date === null) {
      setAttFilter(1)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPage({page: pagination?.current, limit: pagination?.pageSize})

    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handleView = (record) => {
    setOpenView(true)
    setAttToView({
      ...record,
      attendanceDate: moment(record?.attendanceDate).format('LL'),
      attendanceDay: moment(record?.attendanceDate).format('dddd'),
      punchInTime: record?.punchInTime,
      punchOutTime: record?.punchOutTime ? record?.punchOutTime : '',
      officeHour: record?.officeHour ? record?.officeHour : '',
    })
  }

  const handleEdit = (record) => {
    setToggleEdit(true)
    setAttToEdit(record)
  }

  const handleAttChnageChange = (val) => {
    setAttFilter(val)
    switch (val) {
      case 1:
        setDate(intialDate)
        break
      case 2:
        setDate(weeklyState)
        break
      case 3:
        setDate(monthlyState)
        break

      default:
        break
    }
  }
  const handleUserChange = (id) => {
    setUser(id)
  }

  const handleReset = () => {
    setUser(undefined)
    setAttFilter(1)
    setDate(intialDate)
    setDefaultFilter({op: 'gte', num: 9})
  }

  useEffect(() => {
    if (isLoading === false && !data?.status) {
      notification({message: 'Failed To load Attendances', type: 'error'})
    }
  }, [isLoading, data?.status])

  const expandedRowRender = (parentRow) => {
    const columns = [
      {
        title: 'Punch-in Time',
        dataIndex: 'punchInTime',
        key: 'punchInTime',
      },
      {
        title: 'Punch-out Time',
        dataIndex: 'punchOutTime',
        key: 'punchOutTime',
      },
      {
        title: 'Office hour',
        dataIndex: 'officeHour',
        key: 'officeHour',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <span className="gx-link" onClick={() => handleView(record)}>
                <CustomIcon name="view" />
              </span>
              {![RoleAccess.Finance, RoleAccess.TeamLead].includes(userRole) &&
                !getIsAdmin() && (
                  <>
                    <Divider type="vertical"></Divider>
                    <span
                      className="gx-link"
                      onClick={() => handleEdit(record)}
                    >
                      <CustomIcon name="edit" />
                    </span>
                  </>
                )}
            </span>
          )
        },
      },
    ]
    const data = parentRow?.data?.map((att) => ({
      ...att,
      key: att._id,
      punchInTime: moment(att?.punchInTime).format('LTS'),
      punchOutTime: att?.punchOutTime
        ? moment(att?.punchOutTime).format('LTS')
        : '',
      officeHour: att?.punchOutTime
        ? dateDifference(att?.punchOutTime, att?.punchInTime)
        : '',
    }))

    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  const sortedData = useMemo(() => {
    return data?.data?.data?.attendances?.[0]?.data?.map((d) => ({
      ...d,
      data: sortFromDate(d?.data, 'punchInTime'),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.data?.attendances?.[0]?.data])

  const handleExport = async (event, done) => {
    setdataToExport((prev) => ({loading: true, data: []}))
    const data = await searchAttendacentOfUser({
      page: '',
      limit: '',
      userId: user || '',
      fromDate: date?.[0] ? MuiFormatDate(date[0]._d) + 'T00:00:00Z' : '',
      toDate: date?.[1] ? MuiFormatDate(date[1]._d) + 'T00:00:00Z' : '',
      sort: 'csv-import',
      officehourop: defaultFilter?.op,
      officehourValue: hourIntoMilliSecond(defaultFilter?.num),
    })

    const sortedIntermediate = data?.data?.data?.attendances?.[0]?.data?.map(
      (d) => ({
        ...d,
        data: sortFromDate(d?.data, 'punchInTime'),
      })
    )

    const formattedData = formattedAttendances(sortedIntermediate).map((d) => [
      d?.user,
      d?.attendanceDate,
      d?.attendanceDay,
      d?.punchInTime,
      d?.punchOutTime,
      d?.officeHour,
    ])

    setdataToExport({todownload: true, data: formattedData, loading: false})
    done(true)
  }

  return (
    <div>
      <TmsAdminAddAttendanceForm
        toogle={toggleAdd}
        handleCancel={() => {
          setToggleAdd(false)
        }}
        users={users?.data?.data?.data}
      />
      <TmsAdminAttendanceForm
        toogle={toggleEdit}
        handleCancel={() => {
          setToggleEdit(false)
          setAttToEdit({})
        }}
        users={users?.data?.data?.data}
        AttToEdit={AttToEdit}
      />
      <ViewDetailModel
        toogle={openView}
        title={attToView.user ? attToView.user : 'Attendance Details'}
        handleCancel={() => {
          setOpenView(false)
          setAttToEdit({})
        }}
        attendanceToview={attToView}
      />
      <div className="gx-mt-2"></div>
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline" form={form}>
            <FormItem>
              <RangePicker onChange={handleChangeDate} value={date} />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                onChange={handleAttChnageChange}
                value={attFilter}
                options={attendanceFilter}
              />
            </FormItem>
            <FormItem className="direct-form-item">
              <Select
                placeholder="Select Co-worker"
                onChange={handleUserChange}
                value={user}
                options={users?.data?.data?.data?.map((x) => ({
                  id: x._id,
                  value: x.name,
                }))}
              />
            </FormItem>

            <FormItem style={{marginLeft: '40px'}}>
              <Input
                defaultValue="Office hour"
                disabled="true"
                style={{width: '120px'}}
              />
            </FormItem>
            <FormItem>
              <Select
                options={OfficeHourFilter}
                onChange={(value) =>
                  setDefaultFilter((prev) => ({...prev, op: value}))
                }
                value={defaultFilter.op}
                style={{width: '220px'}}
              />
            </FormItem>

            <FormItem>
              <InputNumber
                defaultValue={defaultFilter.num}
                onChange={(value) =>
                  setDefaultFilter((prev) => ({...prev, num: value}))
                }
                style={{width: '80px'}}
              />
            </FormItem>

            <FormItem style={{marginBottom: '1px'}}>
              <Button
                className="gx-btn-form gx-btn-primary gx-text-white "
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </FormItem>
          </Form>

          <AccessWrapper
            noAccessRoles={ATTENDANCE_CO_WORKER_ATTENDANCE_ADD_NO_ACCESS}
          >
            <div className="gx-btn-form">
              <Button
                className="gx-btn-form gx-btn-primary gx-text-white "
                disabled={
                  getIsAdmin() ||
                  sortedData?.length === 0 ||
                  isFetching ||
                  dataToExport.loading
                }
                onClick={handleExport}
              >
                Export
              </Button>

              <CSVLink
                filename="Co-workers Attendance"
                ref={CSVRef}
                data={[
                  [
                    'Co-worker',
                    'Date',
                    'Day',
                    'Punch-in Time',
                    'Punch-out Time',
                    'Office hour',
                  ],
                  ...dataToExport.data,
                ]}
              ></CSVLink>

              <Button
                className="gx-btn-form gx-btn-primary gx-text-white "
                onClick={() => setToggleAdd(true)}
                disabled={getIsAdmin()}
              >
                Add
              </Button>
            </div>
          </AccessWrapper>
        </div>
      </div>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={ATTENDANCE_COLUMNS(sort, handleView, true)}
        dataSource={formattedAttendances(sortedData)}
        expandable={{expandedRowRender}}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          total: data?.data?.data?.attendances?.[0]?.metadata?.[0]?.total || 1,
          onShowSizeChange,
          onChange: handlePageChange,
        }}
        loading={isFetching}
      />
    </div>
  )
}

export default AdminAttendance
