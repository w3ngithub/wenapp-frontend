import React, {useState} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Alert, Button, Modal, Spin} from 'antd'
import DragAndDropFile from 'components/Modules/DragAndDropFile'
import {importUsers} from 'services/users/userDetails'
import {csvFileToArray} from 'helpers/utils'
import {notification} from 'helpers/notification'
import {CANCEL_TEXT} from 'constants/Common'

const validFiles = ['application/vnd.ms-excel', 'text/csv']

function ImportUsers({toggle, onClose, files, setFiles}) {
  const fileReader = new FileReader()

  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation((usersToImport) => importUsers(usersToImport), {
    onSuccess: (response) => {
      if (response.status) {
        notification({
          message: 'Users Imported Successfully',
          type: 'success',
        })

        queryClient.invalidateQueries(['users'])
        handleCancel()
      } else {
        notification({
          message: response?.data?.message || 'Import Failed',
          type: 'error',
        })
      }
    },
    onError: () => {
      notification({message: 'Import Failed', type: 'error'})
    },
    onSettled: () => {
      setLoading(false)
    },
  })
  const handleCancel = () => {
    onClose()
    setFiles([])
  }

  const handleSubmit = () => {
    if (files.length === 0) return
    try {
      setLoading(true)
      const file = files[0]?.originFileObj
      if (file) {
        fileReader.onload = function (event) {
          const csvOutput = csvFileToArray(event.target.result)
          mutation.mutate(csvOutput)
        }

        fileReader.readAsText(file)
      }
    } catch (error) {
      notification({message: 'Import Failed', type: 'error'})

      setLoading(false)
    }
  }

  const isFileVlaid =
    files.length !== 0 && !validFiles.includes(files[0]?.originFileObj.type)

  return (
    <Modal
      title={'Import Co-workers'}
      visible={toggle}
      onOk={handleSubmit}
      onCancel={handleCancel}
      mask={false}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {CANCEL_TEXT}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={loading || isFileVlaid}
        >
          Import
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <DragAndDropFile
          allowMultiple={false}
          files={files}
          setFiles={setFiles}
          label={'Click or drag valid CSV file to this area to upload'}
        />
      </Spin>

      {isFileVlaid && (
        <Alert
          style={{marginTop: '20px'}}
          message="Invalid File! Please provide valid CSV file"
          type="error"
          showIcon
        />
      )}
    </Modal>
  )
}
export default ImportUsers
