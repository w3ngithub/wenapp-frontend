import React, {useState} from 'react'
import {useInfiniteQuery} from '@tanstack/react-query'
import {getActivityLogs} from 'services/activitLogs'
import RoleAccess from 'constants/RoleAccess'
import {Popover} from 'antd'
import RecentActivity from '../dashboard/CRM/RecentActivity'
import moment from 'moment'
import {useInView} from 'react-intersection-observer'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'

function ActivityInfo() {
  const {ref, inView} = useInView({threshold: 0.5})

  const [visible, setVisible] = useState<boolean>(false)

  const {
    role: {key},
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

  React.useEffect(() => {
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

  const userMenuOptions = (
    <RecentActivity
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
      overlayClassName="gx-popover-horizantal"
      placement="bottomRight"
      content={userMenuOptions}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      overlayInnerStyle={{
        overflowY: 'auto',
        height: '400px',
        padding: 0,
        width: '400px',
      }}
      overlayStyle={{paddingBottom: '10px'}}
    >
      <i
        className={`icon icon-notification gx-fs-xl`}
        style={{cursor: 'pointer'}}
      />
    </Popover>
  )
}

export default ActivityInfo
