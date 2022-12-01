import React, {useEffect, useState, useRef} from 'react'
import {useInfiniteQuery, useMutation} from '@tanstack/react-query'
import {getActivityLogs, updateActivityLogs} from 'services/activitLogs'
import RoleAccess from 'constants/RoleAccess'
import {Popover} from 'antd'
import RecentActivity from '../dashboard/CRM/RecentActivity'
import moment from 'moment'
import {useInView} from 'react-intersection-observer'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

const notificationCountStyle: any = {
  position: 'absolute',
  top: '-7px',
  right: '-6px',
  backgroundColor: '#f44336',
  color: 'white',
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
}

function ActivityInfo() {
  const {ref, inView} = useInView({threshold: 0.5})
  const isNotificationViewedRef = useRef(true)
  const blockNotificationUpdateRef = useRef(true)

  const [visible, setVisible] = useState<boolean>(false)
  const [showBellCount, setShowBellCount] = useState<boolean>(false)
  const [notificationCount, setNotificationCount] = useState<number>(0)

  const {
    role: {key},
    _id: userId,
  } = useSelector(selectAuthUser)

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible)
  }

  const {data, isFetching, isFetchingNextPage, fetchNextPage} =
    useInfiniteQuery(
      ['activityLogsInfo'],
      async ({pageParam = 1}) => {
        const res = await getActivityLogs({page: pageParam, limit: 6})
        return res
      },
      {
        enabled: key === RoleAccess.Admin,
      }
    )

  const updateViewofActivityLog: any = useMutation((payload) =>
    updateActivityLogs(payload)
  )

  // fecth next page on scroll of activities
  useEffect(() => {
    if (
      inView &&
      !(
        (data?.pageParams.length || 1) * 6 >=
        data?.pages[0]?.data?.data?.count
      ) &&
      !isFetchingNextPage
    ) {
      fetchNextPage({pageParam: (data?.pages?.length || 0) + 1})
    }
  }, [
    inView,
    fetchNextPage,
    data?.pages?.length,
    data?.pageParams.length,
    data?.pages,
    isFetchingNextPage,
  ])

  // check to show count in notitifcation bell icon once
  useEffect(() => {
    if (data?.pages?.length && isNotificationViewedRef.current) {
      const countOfNotViewNotification =
        data?.pages?.[0]?.data?.data?.data?.filter(
          (log: any) => !log.viewedBy || !log.viewedBy.includes(userId)
        )?.length
      setNotificationCount(countOfNotViewNotification)
      setShowBellCount(true)
      isNotificationViewedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages?.length, userId])

  // update viewBy in activity log when notification is visible only once
  useEffect(() => {
    if (visible && blockNotificationUpdateRef.current) {
      setShowBellCount(false)
      const notViewdNotification = data?.pages?.[0]?.data?.data?.data
        ?.filter((log: any) => !log.viewedBy || !log.viewedBy.includes(userId))
        ?.map((x: any) => x._id)

      if (notViewdNotification && notViewdNotification?.length > 0) {
        updateViewofActivityLog.mutate({
          user: userId,
          activities: notViewdNotification,
        })
      }
      blockNotificationUpdateRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, userId])

  const userMenuOptions = (
    <RecentActivity
      visible={visible}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      showMore={
        (data?.pageParams.length || 1) * 6 >= data?.pages[0]?.data?.data?.count
      }
      viewRef={ref}
      recentList={data?.pages.map((page, i) => ({
        id: i,
        tasks: page?.data?.data?.data?.map((log: any) => ({
          id: log._id,
          name: log.user.name || '',
          title: [
            <span className="gx-link" key={1}>
              {log?.activity}
            </span>,
            <p style={{opacity: 0.6}}>
              {moment(log?.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </p>,
          ],
          avatar: log.user.photo || '',
          imageList: [],
        })),
      }))}
      shape="circle"
    />
  )
  return (
    <Popover
      overlayClassName="gx-popover-admin-notification"
      placement="bottomRight"
      content={userMenuOptions}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <div style={{position: 'relative'}}>
        <i
          className={`icon icon-notification gx-fs-xl`}
          style={{cursor: 'pointer'}}
        />
        {showBellCount && notificationCount > 0 && (
          <div style={notificationCountStyle}>{notificationCount}</div>
        )}
      </div>
    </Popover>
  )
}

export default ActivityInfo
