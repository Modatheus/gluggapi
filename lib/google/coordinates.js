import request from 'request-promise'

const COORDS_URL = 'http://maps.google.com/maps/api/geocode/json?address='

export default (events) => {
  return events.map(event => {
    return event.location && event.location.description
      ? request(`${COORDS_URL}${encodeURIComponent(event.location.description)}`)
        .then(response => {
          const results = JSON.parse(response).results
          if (results.length) {
            event.location.coordinates = results[0].geometry.location
          }
          return event
        })
      : event
  })
}
