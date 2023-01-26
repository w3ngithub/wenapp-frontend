import React from 'react'
import {Card, Tabs} from 'antd'
import Coworkers from './Coworkers'
import Projects from './Projects'
import Logtime from './Logtime'
import Leave from './Leave'
import Noticeboard from './Noticeboard'
import Blog from './Blog'
import Resources from './Resources'
import Email from './Email'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import Attendance from './Attendance'

const TabPane = Tabs.TabPane

function Settings() {
  const {
    role: {
      permission: {Settings},
    },
  } = useSelector(selectAuthUser)
  return (
    <Card title="Settings">
      <Tabs type="card">
        {Settings?.coWorker && (
          <TabPane tab="Co-Workers" key="1">
            <Coworkers />
          </TabPane>
        )}

        {Settings?.project && (
          <TabPane tab="Projects" key="2">
            <Projects />
          </TabPane>
        )}
        {Settings?.logTimes && (
          <TabPane tab="Log Time" key="3">
            <Logtime />
          </TabPane>
        )}

        {Settings?.leaveManagements && (
          <TabPane tab="Leave Management" key="4">
            <Leave />
          </TabPane>
        )}
        {Settings?.noticeBoards && (
          <TabPane tab="Notice Board" key="5">
            <Noticeboard />
          </TabPane>
        )}
        {Settings?.blogs && (
          <TabPane tab="Blog" key="6">
            <Blog />
          </TabPane>
        )}

        {Settings?.resource && (
          <TabPane tab="Resources" key="7">
            <Resources />
          </TabPane>
        )}

        {Settings?.emails && (
          <TabPane tab="Emails" key="8">
            <Email />
          </TabPane>
        )}
        {Settings?.emails && (
          <TabPane tab="Attendance" key="9">
            <Attendance />
          </TabPane>
        )}
      </Tabs>
    </Card>
  )
}

export default Settings
