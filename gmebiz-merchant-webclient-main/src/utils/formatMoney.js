// export default function (number) {
//   if (typeof number !== 'number' || isNaN(number)) {
//     return 'Invalid input'
//   }

//   return number.toLocaleString('en-US', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2
//   })
// }

export default function (number) {
  console.log('format money args', number)
  // let options = { style: 'currency', currency: 'USD' }
  let formatter = new Intl.NumberFormat('en-US')
  let result = formatter.format(Number(number))

  console.log('format money func', result)

  return result
}
