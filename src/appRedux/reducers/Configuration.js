import {
  UPDATE_LATE_ARRIVAL_THRESHOLD,
  UPDATE_ALLOCATED_OFFICE_HOURS,
} from 'constants/ActionTypes'

const INIT_STATE = {
  lateArrivalThreshold: '',
  allocatedOfficeHours: '',
}
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_LATE_ARRIVAL_THRESHOLD: {
      return {
        ...state,
        lateArrivalThreshold: action.payload,
      }
    }
    case UPDATE_ALLOCATED_OFFICE_HOURS: {
      return {
        ...state,
        allocatedOfficeHours: action.payload,
      }
    }
    default:
      return state
  }
}
