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
      <div style={{marginLeft: '35%', fontSize: '20px'}}>
        <p>Total Log Hours</p>
        <span style={{marginLeft: '20%'}}>{totalHours}</span>
      </div>
    </Modal>
  )
}

export default LogHoursModal
