import {Card, Table} from 'antd'
import React, {useState} from 'react'
import {emptyText} from 'constants/EmptySearchAntd'
import {OVERTIME_COLUMNS} from 'constants/Overtime'
import CancelLeaveModal from 'components/Modules/CancelLeaveModal'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {changeDate, handleResponse} from 'helpers/utils'

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
  }))
}

const OvertimePage = () => {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState()
  const [page, setPage] = useState({page: 1, limit: 50})
  const [loader, setLoader] = useState(false)
  const [openOvertimeModal, setOpenOvertimeModal] = useState(false)
  const [leaveDetails, setleaveDetails] = useState({})

  // const overtimeApproveMutation = useMutation(
  //   (payload) => overtimeApprove(payload.id, payload.type),
  //   {
  //     onSuccess: (response) => {
  //       if (response.status) {
  //         Notification({message: 'Overtime approved'})
  //         queryClient.invalidateQueries('')
  //       }
  //     },
  //     onError: (error) => {
  //       Notification({message: 'Could not approve leave', type: 'error'})
  //     },
  //   }
  // )

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handleCloseApproveModal = () => {
    setOpenOvertimeModal(false)
  }

  const handleApproveOvertime = (leave) => {
    //   const approveReason = leave?.leaveApproveReason
    //   leaveApproveMutation.mutate({
    //     id: leave._id,
    //     type: 'approve',
    //     reason: approveReason,
    //   })
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  return (
    <Card title="Overtime Report">
      <CancelLeaveModal
        open={openOvertimeModal}
        onClose={handleCloseApproveModal}
        onSubmit={handleApproveOvertime}
        leaveData={leaveDetails}
        loader={loader}
        setLoader={setLoader}
        title={'Overtime  Approve'}
        isRequired={true}
        name={'overtimeApproveReason'}
        label="Approve reason"
      />
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={OVERTIME_COLUMNS(sort)}
        dataSource={formattedReports([])}
        onChange={handleTableChange}
        pagination={{
          current: page.page,
          pageSize: page.limit,
          pageSizeOptions: ['25', '50', '100'],
          showSizeChanger: true,
          // total: salaryReview?.data?.data?.users.length || 1,
          onShowSizeChange,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
        // loading={isLoading || isFetching || salaryLoading || salaryFetching}
      />
    </Card>
  )
}

export default OvertimePage
