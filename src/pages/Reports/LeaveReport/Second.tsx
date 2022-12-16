import React from 'react'
import CommonQuarters from './Common'

function Second({
  fromDate,
  toDate,
  quarter,
  positions,
}: {
  fromDate: string
  toDate: string
  quarter: number
  positions: {_id: string; name: string}
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

export default Second
