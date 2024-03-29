import React from 'react'
import {Card, Tree} from 'antd'

const TreeNode = Tree.TreeNode

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {title: '0-0-0-0', key: '0-0-0-0'},
          {title: '0-0-0-1', key: '0-0-0-1'},
          {title: '0-0-0-2', key: '0-0-0-2'},
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {title: '0-0-1-0', key: '0-0-1-0'},
          {title: '0-0-1-1', key: '0-0-1-1'},
          {title: '0-0-1-2', key: '0-0-1-2'},
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {title: '0-1-0-0', key: '0-1-0-0'},
      {title: '0-1-0-1', key: '0-1-0-1'},
      {title: '0-1-0-2', key: '0-1-0-2'},
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]

class BasicControl extends React.Component {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  }
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onCheck = (checkedKeys) => {
    this.setState({checkedKeys})
  }
  onSelect = (selectedKeys, info) => {
    this.setState({selectedKeys})
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }

  render() {
    return (
      <Card title="Basic Control" className="gx-card">
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </Card>
    )
  }
}

export default BasicControl
