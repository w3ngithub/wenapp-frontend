import {Button, Modal} from 'antd'
import Map from 'components/Elements/Map'
import React from 'react'

function LocationMap({
  title,
  open,
  onClose,
  location,
}: {
  title: string
  open: boolean
  onClose: () => void
  location: number[] | undefined
}) {
  return (
    <Modal
      title={title}
      style={{flexDirection: 'row'}}
      visible={open}
      mask={false}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Map
        position={
          Array.isArray(location) && location?.length === 2
            ? location
            : undefined
        }
        name={title}
      />
    </Modal>
  )
}

export default LocationMap
