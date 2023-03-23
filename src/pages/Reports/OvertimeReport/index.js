import {Card, Form, notification, Select, Table} from 'antd'
import React, {useState} from 'react'
import {emptyText} from 'constants/EmptySearchAntd'
import {OVERTIME_COLUMNS, OT_STATUS} from 'constants/Overtime'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {changeDate, filterOptions, handleResponse} from 'helpers/utils'
import {getAllTimeLogs, getLogTypes, updateTimeLog} from 'services/timeLogs'
import OvertimeApproveReasonModal from 'components/Modules/OvertimeApproveReasonModal'

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
  }))
}

const FormItem = Form.Item
const Option = Select.Option

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

  const {data: logTypes} = useQuery(['logTypes'], () => getLogTypes())

  const isOT = logTypes?.data?.data?.data?.find((d) => d?.name === 'Ot')

  //   const {data: projectDetail} = useQuery(['singleProject', projectId], () =>
  //   getProject(projectId)
  // )

  const {
    data: logTimeDetails,
    isLoading: timelogLoading,
    isFetching: timeLogFetching,
  } = useQuery(['timeLogs', page, sort, isOT, otStatus], () =>
    getAllTimeLogs({
      ...page,
      isreport: true,
      logType: isOT?._id,
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

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handleCloseApproveModal = () => {
    setOpenOvertimeModal(false)
  }

  const handleApproveOvertime = (approve) => {
    const approveReason = approve?.overtimeApproveReason
    UpdateLogTimeMutation.mutate({
      id: approve?._id,
      details: {
        oTReason: approveReason,
        oTStatus: 'approved',
      },
    })
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const handleOpenApproveModal = (record) => {
    setApproveDetails(record)
    setOpenOvertimeModal(true)
  }

  const handleViewClose = () => {
    setIsViewOnly(false)
  }

  const handleOpenViewModal = (details) => {
    setReadonlyApproveReason(details?.oTReason)
    setIsViewOnly(true)
  }

  const handleAuthorChange = (logAuthor) => {
    setAuthor(logAuthor)
    setPage({page: 1, limit: 50})
  }

  const handleStatusChange = (status) => {
    setOtStatus(status)
    setPage({page: 1, limit: 50})
  }

  return (
    <Card title="Overtime Report">
      <CancelLeaveModal
        open={openOvertimeModal}
        onClose={handleCloseApproveModal}
        onSubmit={handleApproveOvertime}
        leaveData={approveDetails}
        loader={loader}
        setLoader={setLoader}
        title={'Overtime  Approve'}
        isRequired={true}
        name={'overtimeApproveReason'}
        label="Approve reason"
      />

      <OvertimeApproveReasonModal
        open={isViewOnly}
        onClose={handleViewClose}
        approveReason={readOnlyApproveReason}
        title="Overtime Approve Reason"
        label="Reason"
      />
      <Form layout="inline" form={form}>
        <FormItem className="direct-form-item">
          <Select
            notFoundContent={emptyText}
            showSearch
            filterOption={filterOptions}
            placeholder="Select Log Author"
            onChange={handleAuthorChange}
            value={author}
          >
            {/* {LogAuthors &&
              LogAuthors?.map((status) => (
                <Option value={status._id} key={status._id}>
                  {status.name}
                </Option>
              ))} */}
          </Select>
        </FormItem>
        <FormItem className="direct-form-item">
          <Select
            notFoundContent={emptyText}
            showSearch
            filterOption={filterOptions}
            placeholder="Select OT Status"
            onChange={handleStatusChange}
            value={otStatus}
          >
            {OT_STATUS.map((status) => (
              <Option value={status.id} key={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={OVERTIME_COLUMNS(
          sort,
          handleOpenApproveModal,
          handleOpenViewModal
        )}
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
