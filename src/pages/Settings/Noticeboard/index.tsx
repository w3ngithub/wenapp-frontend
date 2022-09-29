import React, {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card} from 'antd'
import SettingTable from '../CommonTable'
import {POSITION_COLUMN} from 'constants/Settings'
import {
  addNoticeboardType,
  deleteNoticeboardType,
  editNoticeboardType,
  getNoticeboardTypes,
} from 'services/settings/noticeBoard'
import {handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import CommonModal from '../CommonModal'

function Noticeboard() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('')

  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dataToEdit, setDataToEdit] = useState<any>({})
  const {data: noticeBoardTypes, isLoading}: any = useQuery(
    ['noticeBoardTypes'],
    getNoticeboardTypes
  )

  const addNoticeboardTypeMutation = useMutation(addNoticeboardType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Noticeboard type added successfully',
        'Noticeboard type add failed',
        [
          handleCloseModal,
          () => queryClient.invalidateQueries(['noticeBoardTypes']),
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Noticeboard type add failed!',
        type: 'error',
      })
    },
  })
  const deleteNoticeboardTypeMutation = useMutation(deleteNoticeboardType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Noticeboard type deleted successfully',
        'Noticeboard type deletion failed',
        [
          handleCloseModal,
          () => queryClient.invalidateQueries(['noticeBoardTypes']),
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Noticeboard Type deletion failed!',
        type: 'error',
      })
    },
  })

  const editNoticeboardTypeMutation = useMutation(editNoticeboardType, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Noticeboard type updated successfully',
        'Noticeboard type update failed',
        [
          handleCloseModal,
          () => queryClient.invalidateQueries(['noticeBoardTypes']),
        ]
      ),
    onError: (error) => {
      notification({
        message: 'Noticeboard type update failed!',
        type: 'error',
      })
    },
  })

  const handleAddClick = (input: string) => {
    addNoticeboardTypeMutation.mutate({name: input})
  }

  const handleEditClick = (input: any) => {
    editNoticeboardTypeMutation.mutate({id: dataToEdit?._id, name: input})
  }

  const handleDeleteClick = (data: any, type: string) => {
    deleteNoticeboardTypeMutation.mutate({id: data._id})
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
          addNoticeboardTypeMutation.isLoading ||
          editNoticeboardTypeMutation.isLoading
        }
        onSubmit={isEditMode ? handleEditClick : handleAddClick}
        onCancel={handleCloseModal}
      />
      <Card
        title="Category"
        extra={
          <Button
            className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
            onClick={() => handleOpenModal('Category')}
          >
            Add
          </Button>
        }
      >
        <SettingTable
          data={noticeBoardTypes?.data?.data?.data}
          columns={POSITION_COLUMN(
            (value) => handleDeleteClick(value, 'Category'),
            (value) => handleOpenEditModal(value, 'Category')
          )}
          onAddClick={() => handleOpenModal('Category')}
          isLoading={isLoading || deleteNoticeboardTypeMutation.isLoading}
        />
      </Card>
    </>
  )
}

export default Noticeboard
