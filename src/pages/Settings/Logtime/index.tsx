import React, {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card} from 'antd'
import SettingTable from '../CommonTable'
import {POSITION_COLUMN} from 'constants/Settings'
import {
  addLogType,
  deleteLogType,
  editLogType,
  getLogtypes,
} from 'services/settings/logTime'
import {capitalizeInput, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import CommonModal from '../CommonModal'

function Logtime() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('')

  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dataToEdit, setDataToEdit] = useState<any>({})

  const {data: logTypes, isLoading}: any = useQuery(['logTypes'], getLogtypes)

  const addLogTypeMutation = useMutation(addLogType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Log type added successfully',
        'Log type add failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['logTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Log type add failed!',
        type: 'error',
      })
    },
  })
  const deleteLogTypeMutation = useMutation(deleteLogType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Log type deleted successfully',
        'Log type deletion failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['logTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Log Type deletion failed!',
        type: 'error',
      })
    },
  })

  const editLogTypeMutation = useMutation(editLogType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Log type updated successfully',
        'Log type update failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['logTypes'])]
      ),
    onError: (error) => {
      notification({
        message: 'Log type update failed!',
        type: 'error',
      })
    },
  })

  const handleAddClick = (input: string) => {
    input = capitalizeInput(input)
    addLogTypeMutation.mutate({name: input})
  }

  const handleEditClick = (input: any) => {
    input = capitalizeInput(input)
    editLogTypeMutation.mutate({id: dataToEdit?._id, name: input})
  }

  const handleDeleteClick = (data: any, type: string) => {
    deleteLogTypeMutation.mutate({id: data._id})
  }

  const handleOpenEditModal = (data: any, type: string) => {
    setType(type)

    setIsEditMode(true)
    setOpenModal(true)
    setDataToEdit(data)
  }

  const handleCloseModal = () => {
    setIsEditMode(false)

    setDataToEdit({})
    setOpenModal(false)
  }
  const handleOpenModal = (type: string) => {
    setType(type)

    setOpenModal(true)
  }

  return (
    <>
      <CommonModal
        toggle={openModal}
        type={type}
        isEditMode={isEditMode}
        editData={dataToEdit}
        isLoading={
          addLogTypeMutation.isLoading || editLogTypeMutation.isLoading
        }
        onSubmit={isEditMode ? handleEditClick : handleAddClick}
        onCancel={handleCloseModal}
      />
      <Card
        title="Log Type"
        extra={
          <Button
            className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
            onClick={() => handleOpenModal('Log Type')}
          >
            Add
          </Button>
        }
      >
        <SettingTable
          data={logTypes?.data?.data?.data}
          columns={POSITION_COLUMN(
            (value) => handleDeleteClick(value, 'Log Type'),
            (value) => handleOpenEditModal(value, 'Log Type')
          )}
          onAddClick={() => handleOpenModal('Log Type')}
          isLoading={isLoading || deleteLogTypeMutation.isLoading}
        />
      </Card>
    </>
  )
}

export default Logtime
