import request from 'request-promise'

const COORDS_URL = 'http://maps.google.com/maps/api/geocode/json?address='

export default (events) => {
  return events.map(ev => {
    return ev.location && ev.location.description
      ? request(`${COORDS_URL}${encodeURIComponent(ev.location.description)}`)
        .then(response => {
          const results = JSON.parse(response).results
          if (results.length) {
            ev.location.coordinates = results[0].geometry.location
          }
          return ev
        })
      : ev
  })
}
