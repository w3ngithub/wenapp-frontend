import React, {useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getActivityLogs} from 'services/activitLogs'
import {getLocalStorageData, isoDateWithoutTimeZone} from 'helpers/utils'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import RoleAccess from 'constants/RoleAccess'
import {Popover} from 'antd'
import RecentActivity from '../dashboard/CRM/RecentActivity'
import moment from 'moment'

function ActivityInfo() {
  const [visible, setVisible] = useState<boolean>(false)

  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER)

  const {data, refetch} = useQuery(
    ['activityLogsInfo'],
    () =>
      getActivityLogs({
        page: 1,
        limit: 6,
      }),
    {enabled: false}
  )

  useEffect(() => {
    if (key === RoleAccess.Admin) {
      refetch()
    }
  }, [key, refetch])

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible)
  }
  const userMenuOptions = (
    <RecentActivity
      recentList={[
        {
          id: 1,
          tasks: data?.data?.data?.data?.map((log: any) => ({
            id: log._id,
            name: 'Mila Alba',
            title: [
              <span className="gx-link" key={1}>
                {log?.activity}
              </span>,
              <p style={{opacity: 0.6}}>
                {moment(log?.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </p>,
            ],
            avatar: 'https://via.placeholder.com/150x150',
            imageList: [],
          })),
        },
      ]}
      shape="circle"
    />
  )
  return (
    <Popover
      overlayClassName="gx-popover-horizantal"
      placement="bottomRight"
      content={userMenuOptions}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <i
        className={`icon icon-notification gx-fs-xl`}
        style={{cursor: 'pointer'}}
      />
    </Popover>
  )
}

export default ActivityInfo
