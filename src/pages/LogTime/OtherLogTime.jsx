import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card, Form, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import LogModal from 'components/Modules/LogtimeModal'
import '@ant-design/compatible/assets/index.css'
import {changeDate, roundedToFixed, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import moment from 'moment'
import React, {useState} from 'react'
import {
  deleteTimeLog,
  getAllTimeLogs,
  getLogTypes,
  getTodayTimeLogSummary,
  getWeeklyTimeLogSummary,
  updateTimeLog,
} from 'services/timeLogs'
import TimeSummary from './TimeSummary'
import {useNavigate} from 'react-router-dom'
import {emptyText} from 'constants/EmptySearchAntd'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'
import {OTHER_LOGTIMES_COLUMNS} from 'constants/OtherLogTime'
import RangePicker from 'components/Elements/RangePicker'
import {getAllUsers} from 'services/users/userDetails'
import Select from 'components/Elements/Select'

const formattedLogs = (logs) => {
  return logs?.map((log) => ({
    ...log,
    key: log?._id,
    logType: log?.logType?.name,
    logDate: changeDate(log?.logDate),
    user: log?.user?.name,
    project: log?.project?.name || 'Other',
    slug: log?.project?.slug,
    projectId: log?.project?.id,
  }))
}

function OtherLogTime() {
  // init hooks
  const queryClient = useQueryClient()

  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 50})
  const [user, setUser] = useState(undefined)
  const [openModal, setOpenModal] = useState(false)
  const [isAdminTimeLog, setIsAdminTimeLog] = useState(false)
  const FormItem = Form.Item

  const [timeLogToUpdate, setTimelogToUpdate] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)

  const {data: users, isLoading} = useQuery(['userForAttendances'], () =>
    getAllUsers({fields: 'name'})
  )

  const handleUserChange = (id) => {
    setUser(id)
  }

  const {
    data: logTimeDetails,
    isLoading: timelogLoading,
    isFetching: timeLogFetching,
  } = useQuery(
    ['timeLogs', page, sort],
    () =>
      getAllTimeLogs({
        ...page,
        project: process.env.REACT_APP_OTHER_PROJECT_ID,
        sort:
          sort.order === undefined || sort.column === undefined
            ? '-logDate'
            : sort.order === 'ascend'
            ? sort.field
            : `-${sort.field}`,
      }),
    {keepPreviousData: true}
  )

  const {data: todayTimeSpent, isLoading: todayLoading} = useQuery(
    ['userTodayTimeSpent'],
    getTodayTimeLogSummary
  )
  const {data: weeklyTimeSpent, isLoading: weeklyLoading} = useQuery(
    ['userweeklyTimeSpent'],
    getWeeklyTimeLogSummary
  )

  const UpdateLogTimeMutation = useMutation(
    (details) => updateTimeLog(details),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Updated time log successfully',
          'Could not update time log',
          [
            () => queryClient.invalidateQueries(['UsertimeLogs']),
            () => queryClient.invalidateQueries(['userTodayTimeSpent']),
            () => queryClient.invalidateQueries(['userweeklyTimeSpent']),
            () => handleCloseTimelogModal(),
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not update time log!', type: 'error'})
      },
    }
  )

  const {data: logTypes} = useQuery(['logTypes'], () => getLogTypes())

  const deleteLogMutation = useMutation((logId) => deleteTimeLog(logId), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Deleted time log successfully',
        'Could not delete time log',
        [
          () => queryClient.invalidateQueries(['UsertimeLogs']),
          () => queryClient.invalidateQueries(['userTodayTimeSpent']),
          () => queryClient.invalidateQueries(['userweeklyTimeSpent']),
          () => {
            socket.emit('CUD')
          },
        ]
      ),
    onError: (error) => {
      notification({message: 'Could not delete time log!', type: 'error'})
    },
  })

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const confirmDelete = (log) => {
    deleteLogMutation.mutate(log._id)
  }

  const handleOpenEditModal = (log) => {
    const originalTimelog = logTimeDetails?.data?.data?.data.find(
      (project) => project.id === log.id
    )
    setTimelogToUpdate({
      ...log,
      logDate: originalTimelog?.logDate,
      logType: originalTimelog?.logType,
      user: originalTimelog?.user,
      project: originalTimelog?.project,
    })
    setOpenModal(true)
    setIsEditMode(true)
  }

  const handleCloseTimelogModal = () => {
    setOpenModal(false)
    setTimelogToUpdate({})
    setIsEditMode(false)
    setIsAdminTimeLog(false)
  }

  const handleLogTypeSubmit = (newLogtime) => {
    let formattedNewLogtime = {
      ...newLogtime,
      hours: +newLogtime.hours,
      logDate: moment.utc(newLogtime.logDate).format(),
      minutes: +newLogtime.minutes,
    }
    if (isEditMode)
      UpdateLogTimeMutation.mutate({
        id: formattedNewLogtime.id,
        details: {
          ...formattedNewLogtime,
          user: newLogtime.user,
        },
      })
  }

  if (timelogLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      {openModal && (
        <LogModal
          toggle={openModal}
          onClose={handleCloseTimelogModal}
          onSubmit={handleLogTypeSubmit}
          loading={UpdateLogTimeMutation.isLoading}
          logTypes={logTypes}
          initialValues={timeLogToUpdate}
          isEditMode={isEditMode}
          isUserLogtime={true}
          isAdminTimeLog={isAdminTimeLog}
          role={key}
        />
      )}
      <div style={{marginTop: 20}}></div>
      <Card title={' Time Summary'}>
        <TimeSummary
          tst={roundedToFixed(
            todayTimeSpent?.data?.data?.timeSpentToday?.[0]?.timeSpentToday ||
              0,
            2
          )}
          tsw={roundedToFixed(
            weeklyTimeSpent?.data?.data?.weeklySummary?.[0]
              ?.timeSpentThisWeek || 0,
            2
          )}
        />
      </Card>
      <Card title={'Time Logs'}>
        <div className="gx-d-flex gx-justify-content-between gx-flex-row">
          <Form layout="inline">
            <FormItem>
              <RangePicker />
            </FormItem>

            <FormItem className="direct-form-item">
              <Select
                placeholder="Search Co-worker"
                onChange={handleUserChange}
                value={user}
                options={users?.data?.data?.data?.map((x) => ({
                  id: x._id,
                  value: x.name,
                }))}
              />
            </FormItem>

            <FormItem className="direct-form-item">
              <Select placeholder="Log Type" />
            </FormItem>

            <FormItem>
              <Button
                className="gx-btn gx-btn-primary gx-text-white "
                onClick={() => console.log('clicked')}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
        </div>

        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={OTHER_LOGTIMES_COLUMNS(
            sort,
            handleOpenEditModal,
            confirmDelete,

            undefined,
            permission
          )}
          dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
          onChange={handleTableChange}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['25', '50', '100'],
            showSizeChanger: true,
            total: logTimeDetails?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: logTimeDetails?.data?.data?.count ? false : true,
            onChange: handlePageChange,
          }}
          loading={
            timeLogFetching ||
            deleteLogMutation.isLoading ||
            todayLoading ||
            weeklyLoading
          }
        />
      </Card>
    </div>
  )
}

export default OtherLogTime
