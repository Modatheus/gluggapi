import request from 'request-promise'
import moment from 'moment'

import {coordinates, distance} from '../google'

const API_BASE_URL = 'https://api.cronofy.com/v1'
const headers = {
  'Authorization': `Bearer ${process.env.CRONOFY_TOKEN}`
}

export default ({lat, lon}) => {
  const fromDate = moment().format('YYYY-MM-DD')
  const toDate = moment().add(7, 'days').format('YYYY-MM-DD')
  return request({
    uri: `${API_BASE_URL}/events?from=${fromDate}&to=${toDate}&tzid=Europe/Oslo`,
    headers
  })
  .then(response => {
    const events = JSON.parse(response).events
    return Promise.all(distance(events, lat, lon))
  })
}
