/**
 * timezone list by offsets, hours
 */

export const timezones = new Array(25).fill(0).map((n, i) => {
  let hour = i - 12
  let hours = hour > 0 ? '+' + hour : '' + hour
  return {
    hours,
    title: hours === '0' ? 'UTC' : hours,
    minites: hour * 60
  }
})
