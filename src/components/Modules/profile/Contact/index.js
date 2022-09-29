import React from 'react'
import Widget from 'components/Elements/Widget'
import {contactList} from '../../../../routes/socialApps/Profile/data'

const Contact = ({user}) => {
  return (
    <Widget title="Contact" styleName="gx-card-profile-sm">
      {contactList(user).map((data, index) => {
        if (!data.value) {
          return null
        }
        return (
          <div
            key={index}
            className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list "
          >
            <div className="gx-mr-3">
              <i className={`icon icon-${data?.icon} gx-fs-xxl gx-text-grey`} />
            </div>
            <div className="gx-media-body max-two-lines">
              <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                {data?.title}
              </span>
              <p className="gx-mb-0">{data?.value}</p>
            </div>
          </div>
        )
      })}
    </Widget>
  )
}

export default Contact
