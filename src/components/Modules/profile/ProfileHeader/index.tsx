import React from 'react'
import {Avatar, Divider} from 'antd'
import CustomIcon from 'components/Elements/Icons'

const ProfileHeader = ({
  user,
  onMoreDetailsClick,
}: {
  user: {name: string; position: string; photoURL: string}
  onMoreDetailsClick: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="gx-profile-banner">
      <div className="gx-profile-container">
        <div className="gx-profile-banner-top">
          <div className="gx-profile-banner-top-left">
            <div className="gx-profile-banner-avatar">
              <Avatar className="gx-size-90" alt="..." src={user?.photoURL} />
            </div>
            <div className="gx-profile-banner-avatar-info">
              <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">
                {user.name}
              </h2>
              <p className="gx-mb-0 gx-fs-lg">{user.position}</p>
            </div>
          </div>
        </div>
        <div className="gx-profile-banner-bottom">
          <span className="gx-link " onClick={() => onMoreDetailsClick(true)}>
            <CustomIcon name="edit" />
            <Divider type="vertical" style={{backgroundColor: 'transparent'}} />
            <span className="gx-d-inline-flex gx-vertical-align-middle gx-ml-1 gx-ml-sm-0">
              Edit Details
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
