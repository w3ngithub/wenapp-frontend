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
        {Settings?.coWorkers && (
          <TabPane tab="Co-Workers" key="1">
            <Coworkers />
          </TabPane>
        )}

        {Settings?.projects && (
          <TabPane tab="Projects" key="2">
            <Projects />
          </TabPane>
        )}
        {Settings?.logTime && (
          <TabPane tab="Log Time" key="3">
            <Logtime />
          </TabPane>
        )}

        {Settings?.leaveManagement && (
          <TabPane tab="Leave Management" key="4">
            <Leave />
          </TabPane>
        )}
        {Settings?.noticeBoard && (
          <TabPane tab="Notice Board" key="5">
            <Noticeboard />
          </TabPane>
        )}
        {Settings?.blog && (
          <TabPane tab="Blog" key="6">
            <Blog />
          </TabPane>
        )}

        {Settings?.Resources && (
          <TabPane tab="Resources" key="7">
            <Resources />
          </TabPane>
        )}

        {Settings?.emails && (
          <TabPane tab="Emails" key="8">
            <Email />
          </TabPane>
        )}
      </Tabs>
    </Card>
  )
}

export default Settings
