import React from 'react'
import {Card, Tabs} from 'antd'

import {getLeaveQuarter} from 'services/settings/leaveQuarter'
import {useQuery} from '@tanstack/react-query'
import CircularProgress from 'components/Elements/CircularProgress'
import {getUserPosition} from 'services/users/userDetails'
import SummaryReport from './SummaryReport'
import ExtensiveReport from './ExtensiveReport'

function LeaveReport() {
  // console.log('quarterData', leaveQuarter?.data?.data?.data)

  // const {data: positionData, isLoading: positionLoading} = useQuery(
  //   ['userPositions'],
  //   getUserPosition
  // )

  // const {firstQuarter, secondQuarter, thirdQuarter, fourthQuarter} =
  //   leaveQuarter?.data?.data?.data?.[0] || {}

  return (
    <div>
      <Card title="Leave Report">
        <Tabs>
          <Tabs.TabPane tab="Summary Report" key="1">
            <SummaryReport></SummaryReport>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Extensive Report" key="2">
            <ExtensiveReport />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default LeaveReport
