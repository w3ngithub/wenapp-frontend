import React, {useEffect, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {addFaqs, deleteFaqs, editFaqs, getAllFaqs} from 'services/resources'
import {getIsAdmin, handleResponse} from 'helpers/utils'
import {notification} from 'helpers/notification'
import Collapse from 'components/Elements/Collapse'
import CommonResourceModal from 'pages/Settings/CommonResourceModal'
import RoleAccess from 'constants/RoleAccess'
import {useSelector} from 'react-redux'

function Faqs() {
  const {data, isLoading, isError} = useQuery(['faqs'], getAllFaqs)
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [type, setType] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [dataToEdit, setDataToEdit] = useState({})
  const {
    role: {key},
  } = useSelector((state) => state?.auth?.authUser?.user)

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Users!', type: 'error'})
    }
  }, [isError])

  const addFaqMutation = useMutation(addFaqs, {
    onSuccess: (response) =>
      handleResponse(response, 'FAQ added successfully', 'FAQ add failed', [
        handleCloseModal,
        () => queryClient.invalidateQueries(['faqs']),
      ]),
    onError: (error) => {
      notification({
        message: 'FAQ add failed!',
        type: 'error',
      })
    },
  })

  const deleteFaqMutation = useMutation(deleteFaqs, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'FAQ deleted successfully',
        'FAQ type deletion failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['faqs'])]
      ),
    onError: (error) => {
      notification({
        message: 'FAQ Type deletion failed!',
        type: 'error',
      })
    },
  })

  const editFaqMutation = useMutation(editFaqs, {
    onSuccess: (response) =>
      handleResponse(
        response,
        'FAQ updated successfully',
        'FAQ update failed',
        [handleCloseModal, () => queryClient.invalidateQueries(['faqs'])]
      ),
    onError: (error) => {
      notification({
        message: 'FAQ update failed!',
        type: 'error',
      })
    },
  })

  if (isLoading) {
    return <CircularProgress />
  }
  const handleOpenEditModal = (data, type) => {
    setType(type)
    setIsEditMode(true)
    setOpenModal(true)
    setDataToEdit(data)
  }

  const handleOpenModal = (type) => {
    setType(type)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsEditMode(false)
    setDataToEdit({})
    setOpenModal(false)
  }

  const handleAddClick = (input) => {
    addFaqMutation.mutate({title: input?.title, content: input?.content})
  }
  const handleEditClick = (input) => {
    editFaqMutation.mutate({
      id: dataToEdit?._id,
      title: input?.title,
      content: input?.content,
    })
  }

  const handleDeleteClick = (data) => {
    deleteFaqMutation.mutate({id: data?._id})
  }

  return (
    <>
      <CommonResourceModal
        toggle={openModal}
        type={type}
        isEditMode={isEditMode}
        editData={dataToEdit}
        isLoading={addFaqMutation.isLoading}
        onSubmit={isEditMode ? handleEditClick : handleAddClick}
        onCancel={handleCloseModal}
      />
      <Card
        title="FAQS"
        extra={
          [RoleAccess.Admin, RoleAccess.HumanResource].includes(key) &&
          !getIsAdmin() ? (
            <Button
              className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
              onClick={() => handleOpenModal('FAQ')}
            >
              Add
            </Button>
          ) : null
        }
      >
        <Collapse
          data={data?.data?.data?.data}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleDeleteClick}
          type="FAQ"
        />
      </Card>
    </>
  )
}

export default Faqs
