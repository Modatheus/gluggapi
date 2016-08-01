import express from 'express'
import {weather, calendar} from './lib'

const app = express()

app.get('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/api/weather', (req, res) => {
  weather(req.query)
    .then(response => res.json(response))
})

app.get('/api/calendar', (req, res) => {
  calendar()
    .then(response => res.json(response))
})

app.listen(3030, () => {
  console.log('Listening on port 3030')
})
