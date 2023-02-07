import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Form, Input, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {notification} from 'helpers/notification'
import {LEAVE_REPORT_COLUMNS} from 'constants/LeaveReport'
import {getLeaveDaysOfAllUsers} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'
import LeaveReportModal from 'components/Modules/LeaveReportModal'

function SummaryTable({data, quarterId}) {
  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})
  const [openModal, setOpenModal] = useState(false)
  const [specificUserDetails, setSpecificUserDetails] = useState({})

  const summaryLeaveReport = (leaveData) => {
    return leaveData?.map((leave) => ({
      ...leave,
      name: leave?.user?.name,
      allocatedLeaves: leave?.leaves?.[0]?.allocatedLeaves,
      remainingLeaves: leave?.leaves?.[0]?.remainingLeaves,
      carriedOverLeaves: leave?.leaves?.[0]?.carriedOverLeaves,
      leaveDeductionBalance: leave?.leaves?.[0]?.leaveDeductionBalance,
      sickLeaves: leave?.leaves?.[0]?.approvedLeaves?.sickLeaves,
      casualLeaves: leave?.leaves?.[0]?.approvedLeaves?.casualLeaves,
    }))
  }

  const handleSave = () => {
    console.log('saving')
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
  const handleOpenModal = (record) => {
    setSpecificUserDetails(record)
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <>
      {openModal && (
        <LeaveReportModal
          toggle={openModal}
          closeModal={handleCloseModal}
          userDetails={specificUserDetails}
          quarterId={quarterId}
        />
      )}
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row"></div>
      </div>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        columns={LEAVE_REPORT_COLUMNS(sort, handleOpenModal)}
        dataSource={summaryLeaveReport(data)}
        onChange={handleTableChange}
        // pagination={{
        //   current: page.page,
        //   pageSize: page.limit,
        //   pageSizeOptions: ['5', '10', '20', '50'],
        //   showSizeChanger: true,
        //   total: data?.data?.data?.data?.[quarter - 1]?.length || 1,
        //   onShowSizeChange,
        //   hideOnSinglePage: data?.data?.data?.data?.[quarter - 1]?.length
        //     ? false
        //     : true,
        //   onChange: handlePageChange,
        // }}
        // loading={isLoading || isFetching}
      />
    </>
  )
}

export default SummaryTable
