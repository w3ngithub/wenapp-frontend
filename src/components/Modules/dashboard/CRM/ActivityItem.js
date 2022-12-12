import React from 'react'
import {Avatar, Divider} from 'antd'
import Auxiliary from 'util/Auxiliary'

const ActivityItem = ({task, title = '', viewedBy = []}) => {
  let currentUser = localStorage.getItem('user_id') || ''
  currentUser = currentUser.replaceAll('"', '')

  console.log({currentUser, viewedBy})

  return (
    <Auxiliary>
      <div
        style={{
          backgroundColor:
            title === 'Notifications'
              ? viewedBy?.includes(currentUser) || viewedBy?.length !== 0
                ? 'red'
                : 'blue'
              : '',
        }}
      >
        {task?.title}
      </div>
      {task?.imageList?.length > 0 ? (
        <ul className="gx-list-inline gx-mb-3 gx-mt-2">
          {task?.imageList?.map((image, index) => {
            if (index === 2) {
              return (
                <li className="gx-mb-1" key={index}>
                  <span className="gx-link gx-img-more">
                    {' '}
                    +{task?.imageList.length - 2} More
                  </span>
                </li>
              )
            } else if (index > 2) {
              return null
            } else {
              return (
                <li className="gx-mb-1" key={index}>
                  <Avatar shape="square" className="gx-size-40" src={image} />
                </li>
              )
            }
          })}
        </ul>
      ) : null}
      <p
        className={
          title === 'Notifications' || title === 'Recent Activities'
            ? 'notificationDivider'
            : ''
        }
      >
        <Divider />
      </p>
    </Auxiliary>
  )
}

export default ActivityItem
