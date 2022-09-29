import React from 'react'
import DragAndDropFile from '../DragAndDropFile'

function UploadFiles({files, setFiles}) {
  return (
    <div>
      <DragAndDropFile
        allowMultiple={false}
        files={files}
        setFiles={setFiles}
        displayType="picture"
      />
    </div>
  )
}

export default UploadFiles
