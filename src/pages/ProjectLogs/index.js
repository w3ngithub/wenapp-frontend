import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import '@ant-design/compatible/assets/index.css'
import {Card, Table, Select, Button, Form} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import LogTimeModal from 'components/Modules/LogtimeModal'
import {LOGTIMES_COLUMNS} from 'constants/logTimes'
import {
  changeDate,
  filterOptions,
  roundedToFixed,
  handleResponse,
  getIsAdmin,
} from 'helpers/utils'
import {notification} from 'helpers/notification'
import moment from 'moment'
import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import {getProject} from 'services/projects'
import {
  addLogTime,
  addUserTimeLog,
  deleteTimeLog,
  getAllTimeLogs,
  getLogTypes,
  getTodayTimeLogSummary,
  updateTimeLog,
  WeeklyProjectTimeLogSummary,
} from 'services/timeLogs'
import LogsBreadCumb from './LogsBreadCumb'
import TimeSummary from './TimeSummary'
import ProjectModal from 'components/Modules/ProjectModal'
import {emptyText} from 'constants/EmptySearchAntd'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import LogHoursModal from './LogHours'
import {socket} from 'pages/Main'
import RoleAccess from 'constants/RoleAccess'

const Option = Select.Option
const FormItem = Form.Item

const formattedLogs = (logs) => {
  return logs?.map((log) => ({
    ...log,
    key: log?._id,
    logType: log?.logType?.name,
    logDate: changeDate(log?.logDate),
    user: log?.user?.name,
  }))
}

function ProjectLogs() {
  // init hooks
  const {slug} = useParams()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  // init states
  const [sort, setSort] = useState({})
  const [logType, setLogType] = useState(undefined)
  const [author, setAuthor] = useState(undefined)
  const [openModal, setOpenModal] = useState(false)
  const [page, setPage] = useState({page: 1, limit: 50})
  const [timeLogToUpdate, setTimelogToUpdate] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [userRecord, setUserRecord] = useState({})
  const [totalHours, setTotalHours] = useState(0)
  const [openLogHoursModal, setOpenLogHoursModal] = useState(false)
  const [selectedLogsIds, setSelectedLogsIds] = useState([])
  const [selectedLogObject, setSelectedLogObject] = useState([])

  const [projectId] = slug.split('-')
  const {
    name,
    role: {permission, key},
  } = useSelector(selectAuthUser)

  const logPermissions = permission?.['Log Time']

  const {data: projectDetail} = useQuery(['singleProject', projectId], () =>
    getProject(projectId)
  )

  const {data: logTypes} = useQuery(['logTypes', projectId], () =>
    getLogTypes()
  )

  const {
    data: logTimeDetails,
    isLoading: timelogLoading,
    isFetching: timeLogFetching,
  } = useQuery(
    ['timeLogs', page, projectId, logType, author, sort],
    () =>
      getAllTimeLogs({
        ...page,
        logType,
        project: projectId,
        user: author,
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

  const {data: projectTimeSpent, isLoading: projectTimeLoading} = useQuery(
    ['projectWeeklyTime', projectId],
    () => WeeklyProjectTimeLogSummary(projectId)
  )

  const addLogTimeMutation = useMutation((details) => addLogTime(details), {
    onSuccess: (response) => {
      if (
        response?.data?.data?.data?.isOt &&
        response?.data?.data?.data?.otStatus === 'P'
      ) {
        socket.emit('ot-log', {
          showTo: [RoleAccess.Admin],
          remarks: `${name} has added OT logtime for project ${projectSlug}. Please review.`,
          module: 'Logtime',
        })
      }
      handleResponse(
        response,
        'Added time log successfully',
        'Could not add time log',
        [
          () => queryClient.invalidateQueries(['timeLogs']),
          () => queryClient.invalidateQueries(['singleProject']),
          () => queryClient.invalidateQueries(['projectWeeklyTime']),
          () => handleCloseTimelogModal(),
        ]
      )
    },

    onError: () =>
      notification({
        message: 'Could not add time log!',
        type: 'error',
      }),
  })

  const UpdateLogTimeMutation = useMutation(
    (details) => updateTimeLog(details),
    {
      onSuccess: (response) => {
        if (
          response?.data?.data?.data?.isOt &&
          response?.data?.data?.data?.otStatus === 'P'
        ) {
          socket.emit('ot-log', {
            showTo: [RoleAccess.Admin],
            remarks: `${name} has added OT logtime for project ${projectSlug}. Please review.`,
            module: 'Logtime',
          })
        }
        handleResponse(
          response,
          'Updated time log successfully',
          'Could not update time log',
          [
            () => queryClient.invalidateQueries(['timeLogs']),
            () => queryClient.invalidateQueries(['singleProject']),
            () => queryClient.invalidateQueries(['projectWeeklyTime']),
            () => handleCloseTimelogModal(),
          ]
        )
      },

      onError: () =>
        notification({
          message: 'Could not update time log!',
          type: 'error',
        }),
    }
  )

  const deleteLogMutation = useMutation((logId) => deleteTimeLog(logId), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Deleted successfully',
        'Could not delete time log',
        [
          () => queryClient.invalidateQueries(['timeLogs']),
          () => queryClient.invalidateQueries(['singleProject']),
          () => queryClient.invalidateQueries(['projectWeeklyTime']),
          () => {
            socket.emit('CUD')
          },
        ]
      ),

    onError: () =>
      notification({
        message: 'Could not delete time log!',
        type: 'error',
      }),
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

  const handlelogTypeChange = (log) => {
    setSelectedLogsIds([])
    setSelectedLogObject([])
    setLogType(log)
    setPage({page: 1, limit: 50})
  }

  const handleAuthorChange = (logAuthor) => {
    setSelectedLogsIds([])
    setSelectedLogObject([])
    setAuthor(logAuthor)
    setPage({page: 1, limit: 50})
  }

  const handleResetFilter = () => {
    setLogType(undefined)
    setAuthor(undefined)
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
      isOt: originalTimelog?.isOt,
    })
    setOpenModal(true)
    setIsEditMode(true)
  }

  const handleCloseTimelogModal = () => {
    setOpenModal(false)
    setTimelogToUpdate({})
    setIsEditMode(false)
  }

  const confirmDelete = (log) => {
    deleteLogMutation.mutate(log._id)
  }

  const handleLogTypeSubmit = (newLogtime, reset) => {
    const formattedNewLogtime = {
      ...newLogtime,
      hours: +newLogtime.hours,
      logDate: moment.utc(newLogtime.logDate).format(),
      minutes: +newLogtime.minutes,
      otStatus: newLogtime?.otStatus || (newLogtime?.isOt ? 'P' : undefined),
    }
    if (isEditMode)
      UpdateLogTimeMutation.mutate({
        id: formattedNewLogtime.id,
        details: {
          ...formattedNewLogtime,
          project: newLogtime.project._id,
          user: newLogtime.user,
        },
      })
    else
      addLogTimeMutation.mutate({
        id: projectId,
        details: formattedNewLogtime,
      })
  }
  const {
    designers,
    devOps,
    developers,
    qa,
    weeklyTimeSpent,
    estimatedHours,
    totalTimeSpent,
    name: projectSlug,
  } = projectDetail?.data?.data?.data?.[0] || {}
  const LogAuthors = [
    ...(designers ?? []),
    ...(devOps ?? []),
    ...(developers ?? []),
    ...(qa ?? []),
  ]

  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const calculateTotalHours = () => {
    const totalHrsArr = selectedLogObject?.map((item) => item?.totalHours)
    const initial = 0
    setTotalHours(totalHrsArr?.reduce((acc, cur) => acc + cur, initial))
  }
  const handleOpenLogHoursModal = () => {
    setOpenLogHoursModal(true)
    calculateTotalHours()
  }
  const handleCloseLogHoursModal = () => {
    setOpenLogHoursModal(false)
  }
  const handleRowSelect = (record, isSelected) => {
    if (isSelected) {
      setSelectedLogsIds((prev) => [...prev, record._id])
      setSelectedLogObject((prev) => [...prev, record])
    } else {
      setSelectedLogsIds((prev) => prev.filter((x) => x !== record._id))
      setSelectedLogObject((prev) => prev.filter((x) => x._id !== record._id))
    }
  }

  const handleOpenViewModal = () => {
    const detailDatas = projectDetail?.data?.data?.data[0]
    setUserRecord({
      id: detailDatas.id,
      project: detailDatas,
    })
    setOpenViewModal(true)
  }

  const handleCloseModal = () => {
    setOpenViewModal((prev) => !prev)
  }

  if (timelogLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      {openViewModal && (
        <ProjectModal
          toggle={openViewModal}
          onClose={handleCloseModal}
          initialValues={userRecord?.project}
          isEditMode={true}
          readOnly={true}
          isFromLog={true}
        />
      )}

      {openModal && (
        <LogTimeModal
          toggle={openModal}
          onClose={handleCloseTimelogModal}
          onSubmit={handleLogTypeSubmit}
          loading={
            addLogTimeMutation.isLoading || UpdateLogTimeMutation.isLoading
          }
          logTypes={logTypes}
          initialValues={timeLogToUpdate}
          isEditMode={isEditMode}
          role={key}
        />
      )}
      {openLogHoursModal && (
        <LogHoursModal
          toggle={openLogHoursModal}
          onClose={handleCloseLogHoursModal}
          totalHours={totalHours}
        />
      )}

      <LogsBreadCumb slug={projectSlug} />
      <div style={{marginTop: 20}}></div>
      <Card title={projectSlug + ' Time Summary'}>
        <TimeSummary
          est={roundedToFixed(estimatedHours || 0, 2)}
          ts={roundedToFixed(totalTimeSpent || 0, 2)}
          tsw={roundedToFixed(
            projectTimeSpent?.data?.data?.weeklySummary[0]?.timeSpentThisWeek ||
              0,
            2
          )}
        />
      </Card>
      <Card title={projectSlug + ' Logs'}>
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-justify-content-between gx-flex-row">
            <Form layout="inline" form={form}>
              <FormItem className="direct-form-item">
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Log Type"
                  onChange={handlelogTypeChange}
                  value={logType}
                  allowClear
                >
                  {logTypes &&
                    logTypes.data?.data?.data?.map((type) => (
                      <Option value={type._id} key={type._id}>
                        {type.name}
                      </Option>
                    ))}
                </Select>
              </FormItem>
              <FormItem className="direct-form-item">
                <Select
                  notFoundContent={emptyText}
                  showSearch
                  filterOption={filterOptions}
                  placeholder="Select Log Author"
                  onChange={handleAuthorChange}
                  value={author}
                  allowClear
                >
                  {LogAuthors &&
                    LogAuthors?.map((status) => (
                      <Option value={status._id} key={status._id}>
                        {status.name}
                      </Option>
                    ))}
                </Select>
              </FormItem>

              <FormItem style={{marginBottom: '0.8rem'}}>
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  onClick={handleResetFilter}
                >
                  Reset
                </Button>
              </FormItem>
            </Form>
            <div>
              <Button
                className="gx-btn gx-btn-primary gx-text-white "
                onClick={handleOpenLogHoursModal}
                style={{marginBottom: '16px'}}
                disabled={selectedLogObject?.length === 0}
              >
                Calculate Hours
              </Button>
              {permission?.Projects?.viewProjects && (
                <Button
                  className="gx-btn gx-btn-primary gx-text-white "
                  onClick={handleOpenViewModal}
                  style={{marginBottom: '16px'}}
                >
                  View Project
                </Button>
              )}
              {logPermissions?.createLogTime && (
                <Button
                  className="gx-btn gx-btn-primary gx-text-white "
                  onClick={handleOpenModal}
                  style={{marginBottom: '16px'}}
                  disabled={getIsAdmin()}
                >
                  Add New TimeLog
                </Button>
              )}
            </div>
          </div>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={LOGTIMES_COLUMNS(
            sort,
            handleOpenEditModal,
            confirmDelete,
            false,
            name,
            permission
          )}
          dataSource={formattedLogs(logTimeDetails?.data?.data?.data)}
          onChange={handleTableChange}
          rowSelection={{
            onSelect: handleRowSelect,
            selectedRowKeys: selectedLogsIds,
            hideSelectAll: true,
          }}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['50', '80', '100'],
            showSizeChanger: true,
            total: logTimeDetails?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: logTimeDetails?.data?.data?.count ? false : true,
            onChange: handlePageChange,
          }}
          loading={timeLogFetching || deleteLogMutation.isLoading}
        />
      </Card>
    </div>
  )
}

export default ProjectLogs
