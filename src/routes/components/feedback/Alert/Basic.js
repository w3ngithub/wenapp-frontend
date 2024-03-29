import React from 'react'
import {Alert, Card} from 'antd'

import './basic.less'

const Basic = () => {
  return (
    <Card title="Basic" className="gx-card">
      <Alert message="Success Text" type="success" />
    </Card>
  )
}

export default Basic
