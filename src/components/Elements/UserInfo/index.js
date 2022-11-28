import React, {useState} from 'react'
import {connect, useDispatch} from 'react-redux'
import {Avatar, Popover} from 'antd'
import {switchedUser, switchUser, userSignOut} from 'appRedux/actions/Auth'
import {useNavigate} from 'react-router-dom'
import {PROFILE} from 'helpers/routePath'
import ChangePasswordModel from 'components/Modules/ChangePasswordModel'

function UserInfo(props) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [openPasswordModel, setOpenPasswordChangeModel] = useState(false)
  const admin = JSON.parse(localStorage.getItem('admin')) || {}
  const dispatch = useDispatch()

  let nameInitials = ''
  if (!props?.authUser?.user?.photoURL) {
    const initials = props?.authUser?.user?.name?.split(' ')
    initials?.forEach((a) => {
      nameInitials = nameInitials + a[0].toUpperCase()
    })
  }

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible)
  }

  const handleChangePassword = () => {
    handleVisibleChange(false)
    setOpenPasswordChangeModel(true)
  }

  const handleSwitchToAdmin = () => {
    dispatch(switchUser())
    const admin = JSON.parse(localStorage.getItem('admin'))
    localStorage.setItem('user_id', JSON.stringify(admin))
    localStorage.removeItem('admin')
    dispatch(switchedUser())
  }

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li
        onClick={() => {
          handleVisibleChange(false)
          navigate(PROFILE)
        }}
      >
        Profile
      </li>
      <li
        onClick={() => {
          handleChangePassword()
        }}
      >
        Change Password
      </li>
      {admin.hasOwnProperty('user') && (
        <li onClick={handleSwitchToAdmin}>Switch To Admin</li>
      )}
      <li
        onClick={() => {
          handleVisibleChange(false)
          props.userSignOut()
        }}
      >
        Logout
      </li>
    </ul>
  )

  return (
    <>
      <ChangePasswordModel
        open={openPasswordModel}
        onClose={() => {
          setOpenPasswordChangeModel(false)
        }}
      />
      <Popover
        overlayClassName="gx-popover-horizantal"
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Avatar
          className="gx-avatar gx-pointer"
          alt="..."
          style={
            props?.authUser?.user?.photoURL
              ? {}
              : {color: '#f56a00', backgroundColor: '#fde3cf'}
          }
          src={props?.authUser?.user?.photoURL}
        >
          {nameInitials}
        </Avatar>
      </Popover>
    </>
  )
}

const mapStateToProps = ({auth}) => {
  const {authUser} = auth
  return {authUser}
}

export default connect(mapStateToProps, {userSignOut})(UserInfo)
