import React, {useEffect, useState} from 'react'
import {ScheduleOutlined} from '@ant-design/icons'
import moment from 'moment'
import {Button} from 'antd'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import LiveTime from '../LiveTime/index'
import {
  checkIfTimeISBetweenOfficeHour,
  handleResponse,
  sortFromDate,
} from 'helpers/utils'
import {notification} from 'helpers/notification'
import {addAttendance, updatePunchout} from 'services/attendances'
import {useDispatch, useSelector} from 'react-redux'
import {PUNCH_IN, PUNCH_OUT} from 'constants/ActionTypes'
import {fetchLoggedInUserAttendance} from 'appRedux/actions/Attendance'
import {Dispatch} from 'redux'
import TmsMyAttendanceForm from 'components/Modules/TmsMyAttendanceForm'
import getLocation, {checkLocationPermission} from 'helpers/getLocation'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import {punchLimit} from 'constants/PunchLimit'

function PunchInOut() {
  const {user} = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '{}')

  const [toogle, setToogle] = useState(false)
  const queryClient = useQueryClient()
  const dispatch: Dispatch<any> = useDispatch()
  const reduxuserAttendance = useSelector((state: any) => state.attendance)

  const {punchIn, latestAttendance} = reduxuserAttendance

  useEffect(() => {
    if (
      latestAttendance?.length === 0 ||
      typeof latestAttendance === 'undefined'
    ) {
      dispatch({type: PUNCH_IN})
    } else {
      const lastattendace = sortFromDate(latestAttendance, 'punchInTime').at(-1)
      lastattendace?.punchOutTime
        ? dispatch({type: PUNCH_IN})
        : dispatch({type: PUNCH_OUT})
    }
  }, [latestAttendance, dispatch])

  const addAttendances = useMutation((payload: any) => addAttendance(payload), {
    onSuccess: (response) => {
      handleResponse(response, 'Punched Successfully', 'Punch  failed', [
        () => {
          dispatch({type: PUNCH_OUT})
        },
        () => queryClient.invalidateQueries(['adminAttendance']),
        () => queryClient.invalidateQueries(['userAttendance']),
        () => {
          dispatch(fetchLoggedInUserAttendance(user._id))
        },
      ])
    },
    onError: (error) => {
      notification({message: 'Punch  failed', type: 'error'})
    },
  })

  const punchOutAttendances = useMutation(
    (payload: {userId: string; payload: any}) =>
      updatePunchout(payload?.userId, payload.payload),
    {
      onSuccess: (response) => {
        handleResponse(response, 'Punched Successfully', 'Punch  failed', [
          () => {
            dispatch(fetchLoggedInUserAttendance(user._id))
          },
          () => {
            dispatch({type: PUNCH_IN})
          },
          () => queryClient.invalidateQueries(['userAttendance']),
          () => queryClient.invalidateQueries(['adminAttendance']),
        ])
      },
      onError: (error) => {
        notification({message: 'Punch  failed', type: 'error'})
      },
    }
  )

  const handlePunch = async () => {
    if (
      checkIfTimeISBetweenOfficeHour(
        moment(new Date(user?.officeTime)).format('h:mm:ss')
      )
    ) {
      setToogle(true)
      return
    }
    const location = await getLocation()
    if (await checkLocationPermission()) {
      if (!punchIn) {
        const lastattendace = sortFromDate(latestAttendance, 'punchInTime').at(
          -1
        )

        punchOutAttendances.mutate({
          userId: lastattendace?._id,
          payload: {
            punchOutNote: '',
            midDayExit: false,
            punchOutTime: moment.utc().format(),
            punchOutLocation: location,
          },
        })
      } else {
        addAttendances.mutate({
          punchInTime: moment.utc().format(),
          punchInLocation: location,
        })
      }
    } else {
      notification({
        message: 'Please allow Location Access to Punch for Attendance',
        type: 'error',
      })
    }
  }

  return (
    <>
      <TmsMyAttendanceForm
        title="Time Attendance"
        toogle={toogle}
        handleCancel={() => setToogle(false)}
      />
      <Button
        onClick={
          latestAttendance?.length >= punchLimit &&
          !latestAttendance
            ?.map((item: object) => item?.hasOwnProperty('punchOutTime'))
            .includes(false)
            ? () => {
                notification({
                  message: 'Punch Limit Exceeded',
                  type: 'error',
                })
              }
            : handlePunch
        }
        className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
        icon={<ScheduleOutlined />}
        disabled={
          addAttendances.isLoading ||
          punchOutAttendances.isLoading ||
          latestAttendance?.length === 0
        }
        style={{width: '200px'}}
      >
        {punchIn ? 'Punch In' : 'Punch Out'}
        <LiveTime />
      </Button>
    </>
  )
}

export default PunchInOut
