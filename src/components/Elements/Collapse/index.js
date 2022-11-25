import React from 'react'
import {Collapse, Divider, Popconfirm} from 'antd'
import parse from 'html-react-parser'
import CustomIcon from '../Icons'
import {getLocalStorageData} from 'helpers/utils'
import RoleAccess from 'constants/RoleAccess'
import { LOCALSTORAGE_USER } from 'constants/Settings'

const Panel = Collapse.Panel

const Collapses = ({
  data = [],
  defaultActiveKey = ['0'],
  onEditClick,
  onDeleteClick,
  type
}) => {
  const {
    role: {key},
  } = getLocalStorageData(LOCALSTORAGE_USER) || ''

  return (
    <Collapse defaultActiveKey={defaultActiveKey}>
      {data?.map((item, index) => (
        <Panel
          header={
            <div className="gx-d-flex gx-justify-content-between">
              {item?.title}{' '}
              {[
                RoleAccess.Admin,
                RoleAccess.HumanResource,
              ].includes(key) && (
                <div className="gx-d-flex">
                  <span
                    className="gx-link gx-text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditClick(item, type)
                    }}
                  >
                    <CustomIcon name="edit" />
                  </span>
                  <Divider type="vertical" style={{color: 'blue'}} />
                  <Popconfirm
                    title="Are you sure you want to delete?"
                    onConfirm={(e) => {
                      e.stopPropagation()
                      onDeleteClick(item)
                    }}
                    onCancel={(e) => e.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span
                      className="gx-link gx-text-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      {' '}
                      <CustomIcon name="delete" />
                    </span>
                  </Popconfirm>
                </div>
              )}
            </div>
          }
          key={index}
        >
          <p style={{margin: 0}}>{parse(item?.content)}</p>
        </Panel>
      ))}
    </Collapse>
  )
}

export default Collapses
