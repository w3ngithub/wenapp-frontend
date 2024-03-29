import React, {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card, Col, Popconfirm, Row} from 'antd'
import SettingTable from '../CommonTable'
import {LEAVES_COLUMN, LEAVES_QUARTER_COLUMN} from 'constants/Settings'
import {
  addLeaveType,
  deleteLeaveType,
  editLeaveType,
  getLeaveTypes,
} from 'services/settings/leaveType'
import {changeDate, getIsAdmin, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import LeaveModal from './LeaveModal'
import {
  addLeaveQuarter,
  deleteLeaveQuarter,
  editLeaveQuarter,
  getLeaveQuarter,
} from 'services/settings/leaveQuarter'
import CustomIcon from 'components/Elements/Icons'
import LeaveQuarterModal from './LeaveQuarterModal'
import moment from 'moment'
import {socket} from 'pages/Main'

interface leaveType {
  name: string
  leaveDays: string
}

function Leave() {
  const queryClient = useQueryClient()

  const [openModal, setOpenModal] = useState(false)
  const [openQuarterModel, setQuarterModel] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isQuarterEditMode, setQuarterIsEditMode] = useState(false)
  const [arrayDataToSend, setArrayDataToSend] = useState<any>([])
  const [dataToEdit, setDataToEdit] = useState<any>({})
  const [duplicateValue, setDuplicateValue] = useState<boolean>(false)
  const {data: leaveTypes, isLoading}: any = useQuery(
    ['leaveTypes'],
    getLeaveTypes
  )

  const addLeaveQuarterMutation = useMutation(addLeaveQuarter, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave Quarters added successfully',
        'Leave Quarters add failed',
        [
          closeQuarterModel,
          () => queryClient.invalidateQueries(['leaveQuarter']),
          () => {
            socket.emit('CUD')
          },
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Leave Quarters add failed!',
        type: 'error',
      })
    },
  })

  const editLeaveQuarterMutation = useMutation(editLeaveQuarter, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave Quarters updated successfully',
        'Leave Quarters update failed',
        [
          closeQuarterModel,
          () => queryClient.invalidateQueries(['leaveQuarter']),
          () => {
            socket.emit('CUD')
          },
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Leave Quarters update failed!',
        type: 'error',
      })
    },
  })

  const {data: leaveQuarter, isLoading: leaveQuarterLoading}: any = useQuery(
    ['leaveQuarter'],
    getLeaveQuarter
  )

  const addLeaveTypeMutation = useMutation(addLeaveType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave type added successfully',
        'Leave type add failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['leaveTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Leave type add failed!',
        type: 'error',
      })
    },
  })

  const deleteLeaveTypeMutation = useMutation(deleteLeaveType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave type deleted successfully',
        'Leave type deletion failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['leaveTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Leave Type deletion failed!',
        type: 'error',
      })
    },
  })

  const editLeaveTypeMutation = useMutation(editLeaveType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave type updated successfully',
        'Leave type update failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['leaveTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Leave type update failed!',
        type: 'error',
      })
    },
  })

  const deleteQuarterTypeMutation = useMutation(deleteLeaveQuarter, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Leave Quarters deleted successfully',
        'Leave Quarters deletion failed',
        [
          handleCloseModal,
          () => queryClient.invalidateQueries(['leaveQuarter']),
          () => {
            socket.emit('CUD')
          },
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Leave Quarters deletion failed!',
        type: 'error',
      })
    },
  })

  const handleAddClick = (leave: leaveType) => {
    leave = {...leave, name: leave?.name}
    addLeaveTypeMutation.mutate(leave)
  }

  const handleEditClick = (leave: leaveType) => {
    leave = {...leave, name: leave?.name}
    editLeaveTypeMutation.mutate({id: dataToEdit?._id, leave})
  }

  const handleDeleteClick = (data: any) => {
    deleteLeaveTypeMutation.mutate({id: data._id})
  }

  const handleOpenEditModal = (data: any, type: string, currentData: any) => {
    setIsEditMode(true)
    setOpenModal(true)
    setDataToEdit(data)
    setArrayDataToSend(currentData)
  }

  const handleCloseModal = () => {
    setIsEditMode(false)
    setDuplicateValue(false)
    setDataToEdit({})
    setOpenModal(false)
  }
  const handleOpenModal = (type: string, data: any) => {
    type === 'Leave Type' ? setOpenModal(true) : setQuarterModel(true)
    setArrayDataToSend(data)
  }

  const onDeleteClickQuarter = (id: string) => {
    deleteQuarterTypeMutation.mutate({id})
  }

  const quarters =
    leaveQuarter?.data?.data?.data.length !== 0
      ? [
          {
            name: 'First Quarter',
            start: changeDate(
              leaveQuarter?.data?.data?.data[0]?.firstQuarter?.fromDate
            ),
            end: changeDate(
              leaveQuarter?.data?.data?.data[0]?.firstQuarter?.toDate
            ),
            days: leaveQuarter?.data?.data?.data[0]?.firstQuarter?.leaves,
          },
          {
            name: 'Second Quarter',
            start: changeDate(
              leaveQuarter?.data?.data?.data[0]?.secondQuarter?.fromDate
            ),
            end: changeDate(
              leaveQuarter?.data?.data?.data[0]?.secondQuarter?.toDate
            ),
            days: leaveQuarter?.data?.data?.data[0]?.secondQuarter?.leaves,
          },
          {
            name: 'Third Quarter',
            start: changeDate(
              leaveQuarter?.data?.data?.data[0]?.thirdQuarter?.fromDate
            ),
            end: changeDate(
              leaveQuarter?.data?.data?.data[0]?.thirdQuarter?.toDate
            ),
            days: leaveQuarter?.data?.data?.data[0]?.thirdQuarter?.leaves,
          },
          {
            name: 'Fourth Quarter',
            start: changeDate(
              leaveQuarter?.data?.data?.data[0]?.fourthQuarter?.fromDate
            ),
            end: changeDate(
              leaveQuarter?.data?.data?.data[0]?.fourthQuarter?.toDate
            ),
            days: leaveQuarter?.data?.data?.data[0]?.fourthQuarter?.leaves,
          },
        ]
      : []

  const Footer = () => {
    return (
      !getIsAdmin() && (
        <div style={{textAlign: 'end'}}>
          <span
            className="gx-link gx-text-primary gx-mr-2"
            onClick={() => handleOpenEditQuarterModal()}
          >
            <CustomIcon name="edit" />
          </span>{' '}
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() =>
              onDeleteClickQuarter(leaveQuarter?.data?.data?.data[0]?._id)
            }
            okText="Yes"
            cancelText="No"
          >
            <span className="gx-link gx-text-danger">
              {' '}
              <CustomIcon name="delete" />
            </span>
          </Popconfirm>
        </div>
      )
    )
  }

  const closeQuarterModel = () => {
    setQuarterModel(false)
    setQuarterIsEditMode(false)
  }

  const addLeaveQuarters = (payload: any) => {
    const {
      firstendDate,
      firststartDate,
      secondendDate,
      secondstartDate,
      thirdendDate,
      thirdstartDate,
      fourthendDate,
      fourthstartDate,
      firstleaves,
      secondleaves,
      thirdleaves,
      fourthleaves,
    } = payload

    const preparedPayload = {
      firstQuarter: {
        fromDate: moment.utc(firststartDate.startOf('day')).format(),
        toDate: moment.utc(firstendDate.endOf('day')).format(),
        leaves: firstleaves,
      },
      secondQuarter: {
        fromDate: moment.utc(secondstartDate.startOf('day')).format(),
        toDate: moment.utc(secondendDate.endOf('day')).format(),
        leaves: secondleaves,
      },
      thirdQuarter: {
        fromDate: moment.utc(thirdstartDate.startOf('day')).format(),
        toDate: moment.utc(thirdendDate.endOf('day')).format(),
        leaves: thirdleaves,
      },
      fourthQuarter: {
        fromDate: moment.utc(fourthstartDate.startOf('day')).format(),
        toDate: moment.utc(fourthendDate.endOf('day')).format(),
        leaves: fourthleaves,
      },
    }
    if (isQuarterEditMode) {
      editLeaveQuarterMutation.mutate({
        id: leaveQuarter?.data?.data?.data[0]._id,
        leaveQuarters: preparedPayload,
      })
    } else {
      addLeaveQuarterMutation.mutate(preparedPayload)
    }
  }

  const handleOpenEditQuarterModal = () => {
    setQuarterModel(true)
    setQuarterIsEditMode(true)
  }

  return (
    <>
      {openModal && (
        <LeaveModal
          toggle={openModal}
          isEditMode={isEditMode}
          duplicateValue={duplicateValue}
          setDuplicateValue={setDuplicateValue}
          currentData={arrayDataToSend}
          editData={dataToEdit}
          isLoading={
            addLeaveTypeMutation.isLoading || editLeaveTypeMutation.isLoading
          }
          onSubmit={isEditMode ? handleEditClick : handleAddClick}
          onCancel={handleCloseModal}
        />
      )}
      {openQuarterModel && (
        <LeaveQuarterModal
          toggle={openQuarterModel}
          isEditMode={isQuarterEditMode}
          editData={leaveQuarter?.data?.data?.data[0]}
          isLoading={
            addLeaveQuarterMutation.isLoading ||
            editLeaveQuarterMutation.isLoading
          }
          onSubmit={addLeaveQuarters}
          onCancel={closeQuarterModel}
        />
      )}
      <Row>
        <Col span={6} xs={24} md={12}>
          <Card
            title="Leave Type"
            extra={
              <Button
                className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                onClick={() => handleOpenModal('Leave Type', leaveTypes)}
                disabled={getIsAdmin()}
              >
                Add
              </Button>
            }
          >
            <SettingTable
              data={leaveTypes?.data?.data?.data}
              columns={LEAVES_COLUMN(
                (value) => handleDeleteClick(value),
                (value) => handleOpenEditModal(value, 'Leave Type', leaveTypes)
              )}
              onAddClick={() => handleOpenModal('Leave Type', leaveTypes)}
              isLoading={isLoading || deleteLeaveTypeMutation.isLoading}
            />
          </Card>
        </Col>
        <Col span={6} xs={24} md={12} style={{paddingLeft: 0}}>
          <Card
            title="Leave Quarter"
            extra={
              new Date() >
                new Date(
                  leaveQuarter?.data?.data?.data[0]?.fourthQuarter?.toDate
                ) || leaveQuarter?.data?.data?.data.length === 0 ? (
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  onClick={() => handleOpenModal('Leave Quarter', '')}
                  disabled={getIsAdmin()}
                >
                  Add
                </Button>
              ) : (
                ''
              )
            }
          >
            <SettingTable
              data={quarters}
              columns={LEAVES_QUARTER_COLUMN()}
              isLoading={
                leaveQuarterLoading || deleteQuarterTypeMutation.isLoading
              }
              pagination={false}
              footer={
                leaveQuarter?.data?.data?.data.length !== 0 ? Footer : undefined
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Leave
