import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Card, Table, Button} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import LogModal from 'components/Modules/LogtimeModal'
import '@ant-design/compatible/assets/index.css'
import {LOGTIMES_COLUMNS} from 'constants/logTimes'
import {changeDate, roundedToFixed, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import moment from 'moment'
import React, {useState} from 'react'
import {
  addUserTimeLog,
  deleteTimeLog,
  getLogTypes,
  getTodayTimeLogSummary,
  getWeeklyTimeLogs,
  getWeeklyTimeLogSummary,
  updateTimeLog,
} from 'services/timeLogs'
import TimeSummary from './TimeSummary'
import {useNavigate} from 'react-router-dom'
import {emptyText} from 'constants/EmptySearchAntd'
import {useSelector} from 'react-redux'

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

function LogTime() {
  // init hooks
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const idUser = useSelector((state) => state?.auth?.authUser?.user)

  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 20})
  const [openModal, setOpenModal] = useState(false)

  const [timeLogToUpdate, setTimelogToUpdate] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const {
    user: {
      _id,
      role: {key},
    },
  } = useSelector((state) => state.auth?.authUser)

  const {
    data: logTimeDetails,
    isLoading: timelogLoading,
    isFetching: timeLogFetching,
  } = useQuery(
    ['UsertimeLogs', page, _id, sort],
    () =>
      getWeeklyTimeLogs({
        ...page,
        user: _id,
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
  const addLogTimeMutation = useMutation((details) => addUserTimeLog(details), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Added time log successfully',
        'Could not add time log',
        [
          () => queryClient.invalidateQueries(['UsertimeLogs']),
          () => queryClient.invalidateQueries(['userTodayTimeSpent']),
          () => queryClient.invalidateQueries(['userweeklyTimeSpent']),
          () => handleCloseTimelogModal(),
        ]
      ),
    onError: (error) => {
      notification({message: 'Could not add time log!', type: 'error'})
    },
  })
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

  const navigateToProjectLogs = (url) => {
    navigate(url, {replace: true})
  }

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
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleLogTypeSubmit = (newLogtime) => {
    const formattedNewLogtime = {
      ...newLogtime,
      hours: +newLogtime.hours,
      logDate: moment.utc(newLogtime.logDate).format(),
      minutes: +newLogtime.minutes,
      user: idUser,
    }
    if (isEditMode)
      UpdateLogTimeMutation.mutate({
        id: formattedNewLogtime.id,
        details: {
          ...formattedNewLogtime,
          user: newLogtime.user,
        },
      })
    else addLogTimeMutation.mutate(formattedNewLogtime)
  }

  if (timelogLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      <LogModal
        toggle={openModal}
        onClose={handleCloseTimelogModal}
        onSubmit={handleLogTypeSubmit}
        loading={
          addLogTimeMutation.isLoading || UpdateLogTimeMutation.isLoading
        }
        logTypes={logTypes}
        initialValues={timeLogToUpdate}
        isEditMode={isEditMode}
        isUserLogtime={true}
        role={key}
      />
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
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-justify-content-between gx-flex-row">
            <Button
              className="gx-btn-form gx-btn-primary gx-text-white gx-mt-auto"
              onClick={handleOpenModal}
            >
              Add New Log Time
            </Button>
          </div>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={LOGTIMES_COLUMNS(
            sort,
            handleOpenEditModal,
            confirmDelete,
            true,
            undefined,
            key,
            navigateToProjectLogs
          )}
          dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
          onChange={handleTableChange}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['20', '50', '80'],
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

export default LogTime
