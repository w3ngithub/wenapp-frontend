import React, {useState} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Card} from 'antd'
import SettingTable from '../CommonTable'
import {LATE_ATTENDANCE_COLUMN} from 'constants/Settings'
import {handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import AttendanceModal from './AttendanceModel'
import {ATTENDANCE_SETTINGS_LIST} from 'constants/Attendance'
import {editAttendanceParams} from 'services/settings/attendance/editLateArrivalThreshold'
import {useDispatch, useSelector} from 'react-redux'
import {
  getAllocatedOfficeHours,
  getLateArrivalThreshold,
} from 'appRedux/actions/Configurations'

function Attendance() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('')
  const {lateArrivalThreshold, allocatedOfficeHours} = useSelector(
    (state: any) => state.configurations
  )
  const dispatch = useDispatch()

  const [openModal, setOpenModal] = useState(false)

  const editLateArrivalMutation = useMutation(editAttendanceParams, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Attendance parameter updated successfully',
        'Attendance parameter update failed',
        [
          handleCloseModal,
          () => {
            if (
              response.status &&
              response?.data?.data?.hasOwnProperty('lateArrivalThreshold')
            ) {
              dispatch(
                getLateArrivalThreshold(
                  response?.data?.data?.lateArrivalThreshold
                )
              )
            } else if (
              response.status &&
              response?.data?.data?.hasOwnProperty('officeHour')
            ) {
              dispatch(
                getAllocatedOfficeHours(response?.data?.data?.officeHour)
              )
            }
          },
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Attendance parameter update failed!',
        type: 'error',
      })
    },
  })

  const handleEditClick = (name: string, value: string) => {
    console.log({name, value})
    editLateArrivalMutation.mutate({[name]: +value})
  }

  const handleOpenEditModal = (type: string) => {
    setType(type)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <>
      {openModal && (
        <AttendanceModal
          toggle={openModal}
          type={type}
          isLoading={editLateArrivalMutation.isLoading}
          onSubmit={handleEditClick}
          onCancel={handleCloseModal}
        />
      )}
      <Card title="Late Attendance">
        <SettingTable
          data={ATTENDANCE_SETTINGS_LIST(
            lateArrivalThreshold,
            allocatedOfficeHours
          )}
          columns={LATE_ATTENDANCE_COLUMN((value) =>
            handleOpenEditModal(value?.name)
          )}
        />
      </Card>
    </>
  )
}

export default Attendance
