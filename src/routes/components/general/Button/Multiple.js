import React, {Component} from 'react'
import {DownOutlined} from '@ant-design/icons'
import {Button, Card, Dropdown, Menu} from 'antd'

function handleMenuClick(e) {
  console.log('click', e)
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)

class Multiple extends Component {
  render() {
    return (
      <Card className="gx-card" title="Multiple">
        <Button type="primary">primary</Button>
        <Button>secondary</Button>
        <Dropdown overlay={menu}>
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      </Card>
    )
  }
}

export default Multiple
