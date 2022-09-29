import React, {useState} from 'react'
import {Card, Col, Row, Tabs} from 'antd'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getQuarterTakenAndRemainingLeaveDaysOfUser,
  getTakenAndRemainingLeaveDaysOfUser,
} from 'services/leaves'
import {getLocalStorageData, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeavesApply from './Apply'
import Leaves from './Leaves'
import CircularProgress from 'components/Elements/CircularProgress'
import LeavesCalendar from './LeavesCalendar'
import {useLocation} from 'react-router-dom'
import MyHistory from './MyHistory'
import {getLeaveTypes} from 'services/settings/leaveType'
import AnnualLeavesRemainingAndAppliedCards from './AnnualLeavesRemainingAndAppliedCards'
import QuarterlyLeavesRemainingAndAppliedCards from './QuarterlyLeavesRemainingAndAppliedCards'
import {LOCALSTORAGE_USER} from 'constants/Settings'

const TabPane = Tabs.TabPane

function Leave() {
  const location = useLocation()
  const queryClient = useQueryClient()

  const [selectedRows, setSelectedRows] = useState([])

  const loggedInUser = getLocalStorageData(LOCALSTORAGE_USER)

  const {data: leaveTypes, isLoading} = useQuery(['leaveTypes'], getLeaveTypes)

  const leaveDaysQuery = useQuery(['takenAndRemainingLeaveDays'], () =>
    getTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const quarterleaveDaysQuery = useQuery(
    ['quartertakenAndRemainingLeaveDays'],
    () => getQuarterTakenAndRemainingLeaveDaysOfUser(loggedInUser._id)
  )

  const leaveCancelMutation = useMutation(
    payload => changeLeaveStatus(payload.id, payload.type),
    {
      onSuccess: response =>
        handleResponse(
          response,
          'Leave cancelled successfully',
          'Could not cancel leave',
          [
            () => queryClient.invalidateQueries(['userLeaves']),
            () => queryClient.invalidateQueries(['leaves']),
          ]
        ),
      onError: error => {
        notification({message: 'Could not cancel leave', type: 'error'})
      },
    }
  )

  const handleCancelLeave = leave => {
    leaveCancelMutation.mutate({id: leave._id, type: 'cancel'})
  }

  const handleRowSelect = rows => {
    setSelectedRows(rows)
  }

  const yearlyLeavesTakn = leaveDaysQuery?.data?.data?.data?.data?.reduce(
    (acc, item) => {
      acc[item?._id[0]?.name] = item.leavesTaken
      return acc
    },
    {}
  )

  const allocatedYealryLeaves = leaveTypes?.data?.data?.data?.reduce(
    (acc, item) => {
      acc[item?.name] = item.leaveDays
      return acc
    },
    {}
  )

  if (leaveDaysQuery.isLoading) return <CircularProgress />
  return (
    <Card title="Leave Management System">
      <Row>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card
            title="Quarterly Leave"
            style={{background: 'rgb(232 232 232 / 26%)'}}
          >
            <QuarterlyLeavesRemainingAndAppliedCards
              firstType="Days Remaining"
              secondType="Days Applied"
              firstNumber={
                quarterleaveDaysQuery?.data?.data?.data?.remainingLeaves || 0
              }
              secondNumber={
                quarterleaveDaysQuery?.data?.data?.data?.leavesTaken || 0
              }
            />
          </Card>
        </Col>

        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card
            title="Annual Leave"
            style={{background: 'rgb(232 232 232 / 26%)'}}
          >
            <AnnualLeavesRemainingAndAppliedCards
              firstTitle="Days Remaining"
              secondTitle="Days Applied"
              firstType="Sick"
              secondType="Casual"
              sickDayRemaining={
                allocatedYealryLeaves['Sick Leave'] -
                  yearlyLeavesTakn['Sick Leave'] ||
                allocatedYealryLeaves['Sick Leave']
              }
              casualDayRemaining={
                allocatedYealryLeaves['Casual Leave'] -
                  yearlyLeavesTakn['Casual Leave'] ||
                allocatedYealryLeaves['Casual Leave']
              }
              sickDayApplied={yearlyLeavesTakn['Sick Leave'] || 0}
              casualDayApplied={yearlyLeavesTakn['Casual Leave'] || 0}
            />
          </Card>
        </Col>
      </Row>

      <Tabs type="card" defaultActiveKey={location?.state?.tabKey}>
        <TabPane tab="Apply" key="1">
          <LeavesApply user={loggedInUser?._id} />
        </TabPane>
        <TabPane tab="My History" key="2">
          <MyHistory
            userId={loggedInUser?._id}
            handleCancelLeave={handleCancelLeave}
          />
        </TabPane>
        {loggedInUser?.role?.value === 'Admin' && (
          <>
            <TabPane tab="Leaves" key="3">
              <Leaves
                selectedUser={location?.state?.user}
                status={location?.state?.leaveStatus}
                selectedDate={location?.state?.date}
                selectedRows={selectedRows}
                handleCancelLeave={handleCancelLeave}
                rowSelection={{
                  onChange: handleRowSelect,
                  selectedRowKeys: selectedRows,
                }}
                isExportDisabled={selectedRows.length === 0}
              />
            </TabPane>
            <TabPane tab="Leaves Calendar" key="4">
              <LeavesCalendar />
            </TabPane>
          </>
        )}
      </Tabs>
    </Card>
  )
}

export default Leave
