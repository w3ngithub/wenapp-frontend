import React from 'react'
import {Card, Tabs} from 'antd'

import First from './First'
import Second from './Second'
import Third from './Third'
import {getLeaveQuarter} from 'services/settings/leaveQuarter'
import {useQuery} from '@tanstack/react-query'
import CircularProgress from 'components/Elements/CircularProgress'
import Fourth from './Fourth'

function LeaveReport() {
  const {data: leaveQuarter, isLoading: leaveQuarterLoading}: any = useQuery(
    ['leaveQuarter'],
    getLeaveQuarter
  )

  const {firstQuarter, secondQuarter, thirdQuarter, fourthQuarter} =
    leaveQuarter?.data?.data?.data?.[0] || {}

  if (leaveQuarterLoading) {
    return <CircularProgress className="" />
  }

  return (
    <div>
      <Card title="Leave Report">
        <Tabs>
          <Tabs.TabPane tab="First Quarter" key="1">
            <First
              fromDate={firstQuarter.fromDate}
              toDate={firstQuarter.toDate}
            ></First>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Second Quarter" key="2">
            <Second
              fromDate={secondQuarter.fromDate}
              toDate={secondQuarter.toDate}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Third Quarter" key="3">
            <Third
              fromDate={thirdQuarter.fromDate}
              toDate={thirdQuarter.toDate}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Fourth Quarter" key="4">
            <Fourth
              fromDate={fourthQuarter.fromDate}
              toDate={fourthQuarter.toDate}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default LeaveReport
