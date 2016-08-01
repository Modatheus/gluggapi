import request from 'request-promise'
import moment from 'moment'

import getPercipitationInfo from './percipitation'

const APP_ID = process.env.APP_ID
const API_BASE_URL = 'http://api.openweathermap.org'

export default async ({lat, lon}) => {
  const current = await currentWeather(lat, lon)
  const forecasts = await weatherForecast(lat, lon)
  const forecast = forecasts.map(cast => {
    cast.general = {
      sunrise: current.general.sunrise,
      sunset: current.general.sunset
    }
    return cast
  })
  return { current, forecast }
}

export const weatherForecast = (lat, lon) => {
  const url = `${API_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${APP_ID}`
  return request(url)
    .then(jsonResponse => {
      const response = JSON.parse(jsonResponse)
      const sortedForecasts = response.list.sort((a, b) => {
        return a.dt - b.dt
      })
      const time = moment(new Date())
      const nextForecastIndex = Math.max(sortedForecasts.findIndex(forecast => {
        return moment(forecast.dt_txt, 'YYYY-MM-DD hh:mm:ss').isAfter(time)
      }), 0)
      const forecasts = sortedForecasts
        .slice(nextForecastIndex, nextForecastIndex + 3)
        .map(({weather, main, clouds, dt_txt}) => {
          return {
            time: dt_txt,
            meta: {
              clouds: clouds.all,
              weatherType: weather[0].main,
              description: weather[0].description,
              temp: main.temp
            }
          }
        })
      return forecasts
    })
}

export const currentWeather = (lat, lon) => {
  const url = `${API_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${APP_ID}`
  return request(url)
    .then(response => {
      const {name, weather, main, wind, sys, rain, snow, clouds} = JSON.parse(response)
      return {
        wind,
        percipitation: getPercipitationInfo(rain, snow),
        general: {
          sunset: sys.sunset,
          sunrise: sys.sunrise,
          country: sys.country,
          city: name
        },
        meta: {
          clouds: clouds.all,
          weatherType: weather[0].main,
          description: weather[0].description,
          temp: main.temp,
          tempMin: main.temp_min,
          tempMax: main.temp_max,
          humidity: main.humidity
        }
      }
    })
}
