import React from 'react'
import {Card, Tabs} from 'antd'

import First from './First'
import Second from './Second'
import Third from './Third'
import {getLeaveQuarter} from 'services/settings/leaveQuarter'
import {useQuery} from '@tanstack/react-query'
import CircularProgress from 'components/Elements/CircularProgress'
import Fourth from './Fourth'
import {getUserPosition} from 'services/users/userDetails'

function LeaveReport() {
  const {data: leaveQuarter, isLoading: leaveQuarterLoading}: any = useQuery(
    ['leaveQuarter'],
    getLeaveQuarter
  )

  const {data: positionData, isLoading: positionLoading} = useQuery(
    ['userPositions'],
    getUserPosition
  )

  const {firstQuarter, secondQuarter, thirdQuarter, fourthQuarter} =
    leaveQuarter?.data?.data?.data?.[0] || {}

  if (leaveQuarterLoading || positionLoading) {
    return <CircularProgress className="" />
  }

  return (
    <div>
      <Card title="Leave Report">
        <Tabs>
          <Tabs.TabPane tab="First Quarter" key="1">
            <First
              positions={positionData?.data?.data?.data}
              fromDate={firstQuarter?.fromDate}
              toDate={firstQuarter?.toDate}
              quarter={1}
            ></First>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Second Quarter" key="2">
            <Second
              positions={positionData?.data?.data?.data}
              fromDate={secondQuarter?.fromDate}
              toDate={secondQuarter?.toDate}
              quarter={2}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Third Quarter" key="3">
            <Third
              positions={positionData?.data?.data?.data}
              fromDate={thirdQuarter?.fromDate}
              toDate={thirdQuarter?.toDate}
              quarter={3}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Fourth Quarter" key="4">
            <Fourth
              positions={positionData?.data?.data?.data}
              fromDate={fourthQuarter?.fromDate}
              toDate={fourthQuarter?.toDate}
              quarter={4}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default LeaveReport
