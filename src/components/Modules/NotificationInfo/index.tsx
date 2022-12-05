import React, {useState, useEffect} from 'react'
import {Popover} from 'antd'
import {socket} from 'pages/Main'
import {useInfiniteQuery} from '@tanstack/react-query'
import {useInView} from 'react-intersection-observer'
import {getNotifications} from 'services/notifications'
import {notificationCountStyle} from '../ActivityInfo'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {useSelector} from 'react-redux'
import moment from 'moment'
import RecentActivity from '../dashboard/CRM/RecentActivity'

function NotificationInfo() {
  const [visible, setVisible] = useState<boolean>(false)
  const {ref, inView} = useInView({threshold: 0.5})
  const [showBellCount, setShowBellCount] = useState<boolean>(false)
  const [notificationCount, setNotificationCount] = useState<number>(0)

  const {
    role: {key},
    _id,
  } = useSelector(selectAuthUser)

  const {data, isFetching, isFetchingNextPage, fetchNextPage, refetch} =
    useInfiniteQuery(
      ['notificationInfo'],
      async ({pageParam = 1}) => {
        const res = await getNotifications({page: pageParam, limit: 6})
        return res
      },
      {enabled: false}
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

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible)
  }

  useEffect(() => {
    socket.on('bell-notification', (response) => {
      if (response && response?.showTo?.includes(key)) {
        setShowBellCount(true)
        setNotificationCount((prev) => prev + 1)
      }
    })

    socket.on('bell-notification-for-user', (response) => {
      if (response && response?.showTo?.includes(_id)) {
        setShowBellCount(true)
        setNotificationCount((prev) => prev + 1)
      }
    })
  }, [key, _id])

  useEffect(() => {
    if (visible) {
      setShowBellCount(false)
      setNotificationCount(0)
      refetch()
    }
  }, [visible])

  const notificationContent = (
    <RecentActivity
      title="Notifications"
      visible={visible}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      showMore={
        (data?.pageParams.length || 1) * 6 >= data?.pages[0]?.data?.data?.count
      }
      iconIdName="general-notification-icon"
      viewRef={ref}
      recentList={data?.pages.map((page, i) => ({
        id: i,
        tasks: page?.data?.data?.data
          ?.filter((x: any) => x?.showTo?.includes(key || _id))
          ?.map((log: any) => ({
            id: log._id,
            name: '',
            title: [
              <span className="gx-link" key={1}>
                {log?.remarks}
              </span>,
              <p style={{opacity: 0.6}}>
                {moment(log?.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </p>,
            ],
            avatar: '',
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
      content={notificationContent}
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

export default NotificationInfo
