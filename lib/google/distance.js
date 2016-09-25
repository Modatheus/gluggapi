import request from 'request-promise'

const DIST_URL = 'http://maps.googleapis.com/maps/api/distancematrix/'

export default (events, lat, lon) => {
  return events.map(ev => {
    const url = `${DIST_URL}?origins=${lat},${lon}&destinations=${encodeURIComponent(ev.location.description)}&key=${process.env.GMATRIX_API_KEY}`
    console.log(url)
    return ev.location && ev.location.description
      ? request(url)
        .then(response => {
          console.log(response)
          return ev
        })
      : ev
  })
}
