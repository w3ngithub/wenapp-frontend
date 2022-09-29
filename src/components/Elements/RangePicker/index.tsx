import React from 'react'
import {DatePicker} from 'antd'
import useWindowsSize from 'hooks/useWindowsSize'

const {RangePicker: DateRangePicker} = DatePicker

function RangePicker({
  handleChangeDate,
  date,
}: {
  handleChangeDate: any
  date: any
}) {
  const {innerWidth} = useWindowsSize()

  return (
    <DateRangePicker
      onChange={handleChangeDate}
      value={date}
      style={{width: innerWidth <= 640 ? '100%' : '240px'}}
    />
  )
}

export default RangePicker
