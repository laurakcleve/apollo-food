import moment from 'moment'

const DISPLAY_FORMAT = 'M/D/YY'
const PG_FORMAT = 'YYYY-MM-DD'

export const unixTimeToPg = (unixString) => {
  return moment(Number(unixString)).format(PG_FORMAT)
}

export const unixTimeToFormatted = (unixString) => {
  return moment(Number(unixString)).format(DISPLAY_FORMAT)
}

export const formattedTimeToPg = (formattedString) => {
  return moment(formattedString, DISPLAY_FORMAT).format(PG_FORMAT)
}

export const getExpiration = (daysLeft) => {
  return moment()
    .add(daysLeft, 'days')
    .format(PG_FORMAT)
}

export const getDaysLeft = (expiration) => {
  return moment(Number(expiration)).diff(moment(), 'days')
}
