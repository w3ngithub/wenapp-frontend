import React from 'react'
import {Card, Tabs} from 'antd'
import Coworkers from './Coworkers'
import Projects from './Projects'
import Logtime from './Logtime'
import Leave from './Leave'
import Noticeboard from './Noticeboard'
import Blog from './Blog'
import Resources from './Resources'
import RoleAccess, {SETTINGS_TABS_NO_ACCESS} from 'constants/RoleAccess'
import Email from './Email'
import {useSelector} from 'react-redux'

const TabPane = Tabs.TabPane

function Settings() {
  const {
    role: {key},
  } = useSelector((state: any) => state?.auth?.authUser?.user)
  return (
    <Card title="Settings">
      <Tabs type="card">
        {![RoleAccess.TeamLead].includes(key) && (
          <TabPane tab="Co-Workers" key="1">
            <Coworkers />
          </TabPane>
        )}

        <TabPane tab="Projects" key="2">
          <Projects />
        </TabPane>
        <TabPane tab="Log Time" key="3">
          <Logtime />
        </TabPane>

        {!SETTINGS_TABS_NO_ACCESS.includes(key) && (
          <>
            <TabPane tab="Leave Management" key="4">
              <Leave />
            </TabPane>
            <TabPane tab="Notice Board" key="5">
              <Noticeboard />
            </TabPane>
          </>
        )}

        <TabPane tab="Blog" key="6">
          <Blog />
        </TabPane>

        {!SETTINGS_TABS_NO_ACCESS.includes(key) && (
          <TabPane tab="Resources" key="7">
            <Resources />
          </TabPane>
        )}

        {!SETTINGS_TABS_NO_ACCESS.includes(key) && (
          <TabPane tab="Emails" key="8">
            <Email />
          </TabPane>
        )}
      </Tabs>
    </Card>
  )
}

export default Settings
