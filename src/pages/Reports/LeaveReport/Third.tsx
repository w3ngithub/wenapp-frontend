import React from 'react'
import CommonQuarters from './Common'

function Third({
  fromDate,
  toDate,
  quarter,
  positions,
}: {
  fromDate: any
  toDate: any
  quarter: number
  positions: any
}) {
  return (
    <CommonQuarters
      fromDate={fromDate}
      toDate={toDate}
      quarter={quarter}
      positions={positions}
    />
  )
}

export default Third
