import React from 'react'
import '@ant-design/compatible/assets/index.css'
import {Button, Modal} from 'antd'

function LogHoursModal({toggle, onClose, totalHours}) {
  const handleCancel = () => {
    onClose()
  }
  return (
    <Modal
      title="Log Hours"
      visible={toggle}
      mask={false}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      <h3>Total Log Hours : {totalHours}</h3>
    </Modal>
  )
}

export default LogHoursModal
