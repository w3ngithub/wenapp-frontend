import React, {ReactElement} from 'react'
import {changeDate} from 'helpers/utils'
import {Divider, Tag} from 'antd'

interface report {
  title: string
  dataIndex?: string
  key: any
  width?: number
  sorter?: (a: any, b: any) => any
  sortOrder?: any
  render?: (text: any, record: any) => ReactElement | null
}

const WORK_LOG_REPORT_COLUMNS = (
  sortedInfo: any,
  screenWidth: number
): report[] => [
  {
    title: 'Users',
    dataIndex: 'user',
    key: 'user',
    sorter: (a, b) => {
      return a.user.toString().localeCompare(b.user.toString())
    },
    sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    render: (text: any, record: any) => {
      return record?.details?.map((x: any, i: number, totalTimeLogs: any) => {
        const totalTimeOfAllProjects = x?.map((log: any) => {
          return log?.totalHours
        })
        const iniVal = 0
        const sumHours = totalTimeOfAllProjects.reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          iniVal
        )
        return (
          <React.Fragment key={i + x?.logType}>
            <div>
              <span style={{marginLeft: '-1px'}}>
                <Tag color="">{changeDate(x?.[0]?.logDate)}</Tag>
              </span>
              <Tag color="cyan" className="gx-ml-4r">
                {' '}
                Time Spent : {sumHours} Hours
              </Tag>
            </div>
            {x.map((item: any) => (
              <div className=" gx-d-flex" key={item.remarks + item.totalHours}>
                <span className="table-longtext" style={{width: '10rem'}}>
                  {item.project?.[0]?.name || 'Other'}
                </span>
                <span
                  style={{maxWidth: screenWidth < 1808 ? '54rem' : '74rem'}}
                >
                  {item.remarks}
                  <Tag color="cyan" className="gx-ml-1">
                    {' '}
                    {+item.totalHours} Hours
                  </Tag>
                </span>
              </div>
            ))}
            <Divider type="horizontal" />
          </React.Fragment>
        )
      })
    },
  },
  {
    title: 'Total Time Spent',
    dataIndex: 'timeSpent',
    key: 'timeSpent',
    sorter: (a, b) => a.timeSpent - b.timeSpent,
    sortOrder: sortedInfo.columnKey === 'timeSpent' && sortedInfo.order,
  },
]

export {WORK_LOG_REPORT_COLUMNS}