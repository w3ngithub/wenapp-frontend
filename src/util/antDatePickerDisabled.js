export const disabledDate = (current) => {
  return new Date(current).getDay() === 0 || new Date(current).getDay() === 6
}
