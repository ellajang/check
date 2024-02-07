export default function formatDateUTC(convertMe) {
  const originalDate = new Date(convertMe)

  const simpleDateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  })

  const simpleDateFormatted = simpleDateFormat.format(originalDate)

  const [month, day, year] = simpleDateFormatted.split('/')
  const newDateFormat = `${year}-${month}-${day}`

  return newDateFormat
}
