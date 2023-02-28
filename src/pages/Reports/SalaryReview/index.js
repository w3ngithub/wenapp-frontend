import React from 'react'
import {Card, Tabs} from 'antd'
import SalaryReviewTab from './SalaryReviewTab'
import SalaryReviewCalender from './SalaryReviewCalender'

const SalaryReviewPage = () => {
  return (
    <Card title="Salary Review">
      <Tabs type="card">
        <Tabs.TabPane tab="Salary Review" key="1">
          <SalaryReviewTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Salary Review Calendar" key="2">
          <SalaryReviewCalender />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default SalaryReviewPage
