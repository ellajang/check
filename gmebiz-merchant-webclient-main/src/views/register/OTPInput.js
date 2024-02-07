import Box from '@mui/material/Box'

import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import Cleave from 'cleave.js/react'

import React, { useMemo } from 'react'
import { RE_DIGIT } from './constants'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

export default function OtpInput({ value, valueLength, onChange }) {
  // ** Hooks
  const theme = useTheme()

  const valueItems = useMemo(() => {
    const valueArray = value.split('')
    const items = []

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i]

      if (RE_DIGIT.test(char)) {
        items.push(char)
      } else {
        items.push('')
      }
    }

    return items
  }, [value, valueLength])

  const focusToNextInput = target => {
    const nextElementSibling = target.nextElementSibling

    if (nextElementSibling) {
      nextElementSibling.focus()
    }
  }

  const focusToPrevInput = target => {
    const previousElementSibling = target.previousElementSibling

    if (previousElementSibling) {
      previousElementSibling.focus()
    }
  }

  const inputOnChange = (e, idx) => {
    console.log('logged')

    const target = e.target
    let targetValue = target.value.trim()
    const isTargetValueDigit = RE_DIGIT.test(targetValue)

    if (!isTargetValueDigit && targetValue !== '') {
      return
    }

    const nextInputEl = target.nextElementSibling

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== '') {
      return
    }

    targetValue = isTargetValueDigit ? targetValue : ' '

    const targetValueLength = targetValue.length

    if (targetValueLength === 1) {
      const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1)

      onChange(newValue)

      if (!isTargetValueDigit) {
        return
      }

      focusToNextInput(target)
    } else if (targetValueLength === valueLength) {
      onChange(targetValue)

      target.blur()
    }
  }

  const inputOnKeyDown = e => {
    const { key } = e
    const target = e.target

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault()

      return focusToNextInput(target)
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault()

      return focusToPrevInput(target)
    }

    const targetValue = target.value

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length)

    if (e.key !== 'Backspace' || targetValue !== '') {
      return
    }

    focusToPrevInput(target)
  }

  const inputOnFocus = e => {
    const { target } = e

    // keep focusing back until previous input
    // element has value
    const prevInputEl = target.previousElementSibling

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus()
    }

    target.setSelectionRange(0, target.value.length)
  }

  return (
    <div className='otp-group'>
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          pattern='\d{1}'
          maxLength={valueLength}
          className='otp-input'
          value={digit}
          autoFocus={idx === 0}
          onChange={e => inputOnChange(e, idx)}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
        />
      ))}
    </div>
  )

  // return (
  //   <CleaveWrapper
  //     sx={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'space-between'
  //     }}
  //   >
  //     {valueItems.map((digit, idx) => (
  //       <Box
  //         key={idx}
  //         type='text'
  //         inputMode='numeric'
  //         autoComplete='one-time-code'
  //         pattern='\d{1}'
  //         maxLength={valueLength}
  //         value={digit}
  //         component={CleaveInput}
  //         onKeyDown={inputOnKeyDown}
  //         onFocus={inputOnFocus}
  //         onChange={e => inputOnChange(e, idx)}
  //         options={{ phone: true, phoneRegionCode: 'AU' }}
  //         sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
  //       />
  //     ))}
  //   </CleaveWrapper>
  // )
}
