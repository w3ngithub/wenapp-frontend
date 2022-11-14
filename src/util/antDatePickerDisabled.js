import { MuiFormatDate } from 'helpers/utils'
import moment from 'moment'

export const disabledDate = (current) => {
  return new Date(current).getDay() === 0 || new Date(current).getDay() === 6
}

export const disabledAfterToday = (current) => {
  return current && current.valueOf() >= Date.now()
}

// export function disableDateRanges({startDate, endDate}) {
//   console.log({startDate, endDate})
//   return function disabledDate(current) {
//     console.log('current', current)
//     return current > moment(startDate) && current <= moment(endDate)
//   }
// }

export function disableDateRanges(immediateApprovalLeaves) {
  const paternityStartDate = moment(immediateApprovalLeaves?.[0]?.date)
  const startTime = paternityStartDate?.startOf('day')?._d
  const newDate = new Date(paternityStartDate?._d)
  const paternityEndDate = new Date(newDate.setDate(startTime?.getDate() + 4))
  const startDate = new Date(MuiFormatDate(paternityStartDate))
  const endDate = new Date(MuiFormatDate(paternityEndDate))
  console.log({startDate, endDate})
  return function disabledDate(current) {
    return current > moment(startDate) && current <= moment(endDate)
  }
}