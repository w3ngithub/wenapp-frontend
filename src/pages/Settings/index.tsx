import React, {useEffect, useState} from 'react'
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
import {useLocation} from 'react-router-dom'

const TabPane = Tabs.TabPane

function Settings() {
  const location: any = useLocation()
  const [activeKey, setActiveKey] = useState(location?.state?.tabKey || '')
  const {
    role: {
      permission: {Settings},
    },
  } = useSelector(selectAuthUser)

  const handleTabChange = (val: string) => {
    setActiveKey(val)
  }

  useEffect(() => {
    if (location.state.tabKey === '3') setActiveKey(location?.state?.tabKey)
  }, [location?.state])

  return (
    <Card title="Settings">
      <Tabs type="card" activeKey={activeKey} onChange={handleTabChange}>
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
        {Settings?.attendance && (
          <TabPane tab="Attendance" key="3">
            <Attendance />
          </TabPane>
        )}
        {Settings?.logTimes && (
          <TabPane tab="Log Time" key="4">
            <Logtime />
          </TabPane>
        )}

        {Settings?.leaveManagements && (
          <TabPane tab="Leave Management" key="5">
            <Leave />
          </TabPane>
        )}
        {Settings?.noticeBoards && (
          <TabPane tab="Notice Board" key="6">
            <Noticeboard />
          </TabPane>
        )}
        {Settings?.blogs && (
          <TabPane tab="Blog" key="7">
            <Blog />
          </TabPane>
        )}

        {Settings?.resource && (
          <TabPane tab="Resources" key="8">
            <Resources />
          </TabPane>
        )}

        {Settings?.emails && (
          <TabPane tab="Emails" key="9">
            <Email />
          </TabPane>
        )}
      </Tabs>
    </Card>
  )
}

export default Settings
