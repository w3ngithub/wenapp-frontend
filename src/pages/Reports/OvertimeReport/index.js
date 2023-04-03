import {Button, Card, Form, notification, Table} from 'antd'
import React, {useState, useCallback} from 'react'
import {emptyText} from 'constants/EmptySearchAntd'
import {OVERTIME_COLUMNS, OT_STATUS} from 'constants/Overtime'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {changeDate, filterOptions, handleResponse} from 'helpers/utils'
import {getAllTimeLogs, updateTimeLog} from 'services/timeLogs'
import OvertimeApproveReasonModal from 'components/Modules/OvertimeApproveReasonModal'
import {getAllUsers} from 'services/users/userDetails'
import Select from 'components/Elements/Select'
import {debounce} from 'helpers/utils'
import {getAllProjects} from 'services/projects'
import {LOG_STATUS} from 'constants/logTimes'

const formattedReports = (overtimeData) => {
  return overtimeData?.map((log) => ({
    ...log,
    key: log?._id,
    logType: log?.logType?.name,
    logDate: changeDate(log?.logDate),
    user: log?.user?.name,
    project: log?.project?.name || 'Other',
    slug: log?.project?.slug,
    projectId: log?.project?.id,
    remarks: log?.remarks,
    status: LOG_STATUS[log?.otStatus],
  }))
}

const FormItem = Form.Item

const OvertimePage = () => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 50})
  const [loader, setLoader] = useState(false)
  const [openOvertimeModal, setOpenOvertimeModal] = useState(false)
  const [approveDetails, setApproveDetails] = useState({})
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [readOnlyApproveReason, setReadonlyApproveReason] = useState('')
  const [author, setAuthor] = useState(undefined)
  const [otStatus, setOtStatus] = useState(undefined)
  const [projectData, setProjectData] = useState([])
  const [project, setProject] = useState(undefined)

  const allUsers = useQuery(['users'], () => getAllUsers({sort: 'name'}))

  const {
    data: logTimeDetails,
    isLoading: timelogLoading,
    isFetching: timeLogFetching,
  } = useQuery(['timeLogs', page, sort, otStatus, author, project], () =>
    getAllTimeLogs({
      ...page,
      isOt: true,
      user: author,
      project: project,
      oTStatus: otStatus ? otStatus : undefined,
      sort:
        sort.order === undefined || sort.column === undefined
          ? '-logDate'
          : sort.order === 'ascend'
          ? sort.field
          : `-${sort.field}`,
    })
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
            () => queryClient.invalidateQueries(['timeLogs']),
            () => setLoader(false),
            () => handleCloseApproveModal(),
          ]
        ),
      onError: (error) => {
        notification({
          message: 'Could not approve overtime report',
          type: 'error',
        })
      },
    }
  )

  const handleCloseApproveModal = () => {
    setOpenOvertimeModal(false)
    setIsViewOnly(false)
  }

  const handleApproveOvertime = (approve) => {
    const approveReason = approve?.overtimeApproveReason
    UpdateLogTimeMutation.mutate({
      id: approve?._id,
      details: {
        oTReason: approveReason,
        oTStatus: 'A',
      },
    })
  }

  const handleRejectOvertime = (approve) => {
    const approveReason = approve?.overtimeApproveReason
    UpdateLogTimeMutation.mutate({
      id: approve?._id,
      details: {
        oTReason: approveReason,
        oTStatus: 'R',
      },
    })
  }

  const handleApprove = (data) => {
    console.log('testing', data)
  }

  const handleOpenRejectModal = (record) => {
    setApproveDetails(record)
    setOpenOvertimeModal(true)
  }

  const handleOpenViewModal = (details) => {
    setReadonlyApproveReason(details?.oTReason)
    setIsViewOnly(true)
    setOpenOvertimeModal(true)
  }

  const handleSearch = async (projectName) => {
    if (!projectName) {
      setProjectData([])
      return
    } else {
      const projects = await getAllProjects({project: projectName})
      setProjectData(projects?.data?.data?.data)
    }
  }
  const optimizedFn = useCallback(debounce(handleSearch, 100), [])

  const handleProjectChange = (ProjectId) => {
    setProject(ProjectId)
  }

  const handleAuthorChange = (logAuthor) => {
    setAuthor(logAuthor)
    setPage({page: 1, limit: 50})
  }

  const handleStatusChange = (status) => {
    setOtStatus(status)
    setPage({page: 1, limit: 50})
  }

  const handleResetFilter = () => {
    setProject(undefined)
    setOtStatus(undefined)
    setAuthor(undefined)
    setPage({page: 1, limit: 50})
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  return (
    <Card title="Overtime Report">
      <OvertimeApproveReasonModal
        open={openOvertimeModal}
        onClose={handleCloseApproveModal}
        onSubmit={handleRejectOvertime}
        approveDetails={approveDetails}
        loader={loader}
        setLoader={setLoader}
        title={'Overtime  Approve'}
        isRequired={true}
        label="Approve reason"
      />

      <OvertimeApproveReasonModal
        open={isViewOnly}
        onClose={handleCloseApproveModal}
        approveReason={readOnlyApproveReason}
        title="Overtime Approve Reason"
        label="Reason"
        isReadOnly={isViewOnly}
      />
      <Form layout="inline" form={form}>
        <FormItem className="direct-form-item">
          <Select
            placeholder="Select Project"
            onChange={handleProjectChange}
            value={project}
            handleSearch={optimizedFn}
            options={projectData?.map((x) => ({
              ...x,
              id: x._id,
              value: x.name,
            }))}
            inputSelect
          />
        </FormItem>
        <FormItem className="direct-form-item">
          <Select
            showSearch
            filterOption={filterOptions}
            placeholder="Select Log Author"
            onChange={handleAuthorChange}
            value={author}
            options={allUsers?.data?.data?.data?.data?.map((user) => ({
              id: user._id,
              value: user.name,
            }))}
          />
        </FormItem>
        <FormItem className="direct-form-item">
          <Select
            showSearch
            filterOption={filterOptions}
            placeholder="Select OT Status"
            onChange={handleStatusChange}
            value={otStatus}
            options={OT_STATUS?.map((x) => ({
              id: x.id,
              value: x.value,
            }))}
          />
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
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={OVERTIME_COLUMNS({
          sort,
          handleApprove,
          handleOpenViewModal,
          handleOpenRejectModal,
        })}
        dataSource={formattedReports(logTimeDetails?.data?.data?.data)}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['25', '50', '100'],
          showSizeChanger: true,
          total: logTimeDetails?.data?.data?.data?.length || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
        loading={timelogLoading || timeLogFetching}
      />
    </Card>
  )
}

export default OvertimePage
