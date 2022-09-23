import React, {useState} from 'react'
import {Card, Tabs} from 'antd'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  changeLeaveStatus,
  getQuarterTakenAndRemainingLeaveDaysOfUser,
  getTakenAndRemainingLeaveDaysOfUser,
} from 'services/leaves'
import {getLocalStorageData, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import RemainingAndAppliedLeaveCards from './RemainingAndAppliedLeaveCards'
import LeavesApply from './Apply'
import Leaves from './Leaves'
import CircularProgress from 'components/Elements/CircularProgress'
import LeavesCalendar from './LeavesCalendar'
import {useLocation} from 'react-router-dom'
import MyHistory from './MyHistory'
import {getLeaveTypes} from 'services/settings/leaveType'

const TabPane = Tabs.TabPane

function Leave() {
  const location = useLocation()
  const queryClient = useQueryClient()

  const [selectedRows, setSelectedRows] = useState([])

  const loggedInUser = getLocalStorageData('user_id')

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
      <RemainingAndAppliedLeaveCards
        leavesRemaining={
          <>
            <h3 className="gx-text-white">Quarterly Leave days</h3>
            <div className="gx-d-flex gx-column-gap-10">
              {' '}
              <div>
                <p>
                  Leave Taken -{' '}
                  {quarterleaveDaysQuery?.data?.data?.data?.leavesTaken || 0}
                </p>
                <p>
                  Leave Remaining -{' '}
                  {quarterleaveDaysQuery?.data?.data?.data?.remainingLeaves ||
                    0}
                </p>
              </div>
            </div>
          </>
        }
        leavesTaken={
          <>
            <h3 className="gx-text-white">Yearly Leave days</h3>
            <div className="gx-d-flex gx-column-gap-10">
              {' '}
              <div>
                {' '}
                <p>Sick Taken - {yearlyLeavesTakn['Sick Leave'] || 0}</p>
                <p>
                  Sick Remaining -
                  {allocatedYealryLeaves['Sick Leave'] -
                    yearlyLeavesTakn['Sick Leave'] ||
                    allocatedYealryLeaves['Sick Leave']}
                </p>
              </div>
              <div>
                {' '}
                <p>Casual Taken - {yearlyLeavesTakn['Casual Leave'] || 0}</p>
                <p>
                  Casual Remaining -{' '}
                  {allocatedYealryLeaves['Casual Leave'] -
                    yearlyLeavesTakn['Casual Leave'] ||
                    allocatedYealryLeaves['Casual Leave']}
                </p>
              </div>
            </div>
          </>
        }
      />

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
