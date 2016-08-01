

export default (rain, snow) => {
  if (rain && snow) {
    const rainAmount = rain['1h'] || rain['3h'] || 0
    const snowAmount = snow['1h'] || snow['3h'] || 0
    return {
      type: 'Sleet',
      amount: (rainAmount + snowAmount) / 2
    }
  } else if (rain) {
    const rainAmount = rain['1h'] || rain['3h'] || 0
    return {
      type: 'Rain',
      amount: rainAmount
    }
  } else if (snow) {
    const snowAmount = snow['1h'] || snow['3h'] || 0
    return {
      type: 'Snow',
      amount: snowAmount
    }
  } else {
    return {
      type: 'Unknown',
      amount: 0
    }
  }
}
