import React, {useEffect, useRef, useState} from 'react'
import {Avatar, Timeline} from 'antd'
import WidgetHeader from 'components/Elements/WidgetHeader/index'
import ActivityItem from './ActivityItem'

const TimeLineItem = Timeline.Item

function getName(task, shape) {
  if (task.avatar) {
    return <Avatar shape={shape} className="gx-size-40" src={task.avatar} />
  } else {
    let nameSplit = task.name.split(' ')
    if (task.name.split(' ').length === 1) {
      const initials = nameSplit[0].charAt(0).toUpperCase()
      return <Avatar className="gx-size-40 gx-bg-primary">{initials}</Avatar>
    } else {
      const initials =
        nameSplit[0].charAt(0).toUpperCase() +
        nameSplit[1].charAt(0).toUpperCase()
      return <Avatar className="gx-size-40 gx-bg-cyan">{initials}</Avatar>
    }
  }
}

function RecentActivity(props) {
  const [isScrolled, setIsScrolled] = useState(false)

  const popUpRef = useRef()
  const scrollRef = useRef(true)

  const {
    recentList,
    viewRef,
    showMore,
    isFetching,
    isFetchingNextPage,
    visible,
  } = props

  useEffect(() => {
    if (!visible) {
      setIsScrolled(false)
      scrollRef.current = true
    }
  }, [visible])

  useEffect(() => {
    const handleScrollActivityPopUP = (e) => {
      if (scrollRef.current) {
        setIsScrolled(true)
        scrollRef.current = false
      }
    }
    const activityLogPopUp = document.getElementById('admin-activity-icon')
    if (activityLogPopUp) {
      activityLogPopUp.addEventListener('scroll', handleScrollActivityPopUP)
    }
    return () => {
      return activityLogPopUp.removeEventListener(
        'scroll',
        handleScrollActivityPopUP
      )
    }
  }, [])

  return (
    <div
      className="gx-entry-sec gx-dashboard-activity-popup"
      ref={popUpRef}
      id="admin-activity-icon"
    >
      <WidgetHeader title="Recent Activities" />
      {recentList?.map((activity, index) => (
        <div className="gx-timeline-info" key={'activity' + index}>
          <Timeline>
            {activity?.tasks?.map((task, index) => {
              return (
                <TimeLineItem
                  key={'timeline' + index}
                  mode="alternate"
                  dot={getName(task)}
                >
                  <ActivityItem task={task} />
                </TimeLineItem>
              )
            })}
          </Timeline>
        </div>
      ))}
      {!showMore && isScrolled && (
        <span className="gx-link gx-btn-link" ref={viewRef}>
          {isFetchingNextPage || isFetching ? 'Loading...' : 'Load More'}
        </span>
      )}

      {showMore && (
        <span
          className="gx-link gx-btn-link"
          onClick={() => {
            popUpRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }}
        >
          {'No more data available'}
        </span>
      )}
    </div>
  )
}

export default RecentActivity
