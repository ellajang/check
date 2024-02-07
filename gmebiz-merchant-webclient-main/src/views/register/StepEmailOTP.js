// ** React Imports
import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { styled, useTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
//import CustomRadioAccountType from 'src/views/forms/form-elements/custom-inputs/CustomRadioAccountType'
import Translations from 'src/layouts/components/Translations'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'

//import { onEmailOTPSubmit } from "src/store/apps/register/registerThunk"

import { createEmailOtp, resendEmailOtp } from 'src/store/apps/register'

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'

import OtpInput from './OTPInput'

const StepEmailOTP = ({ handleNext, handlePrev }) => {
  const dispatch = useDispatch()

  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, sourceId, signupKey, error, message } = registrationStatus

  const email = useSelector(store => store.register.email)

  const subTitle = `Please enter the code we’ve sent to ${email}`

  const { t } = useTranslation()

  const [otp, setOtp] = useState('')
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const onChange = value => setOtp(value)

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && signupStatus === 'VERIFIED') {
      toast.success(t(message))
      handleNext()
    } else if (responseStatus === 'SUCCESS' && signupStatus === 'SENT') {
      toast.success(t(message))
    } else if (responseStatus === 'FAILURE' && signupStatus === 'MISMATCH') {
      toast.error(t(message))
    } else if (responseStatus === 'FAILURE' && signupStatus === 'EXPIRED') {
      toast.error(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, message, handleNext])

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval)
        } else {
          setSeconds(59)
          setMinutes(minutes - 1)
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds])

  const onEmailCodeSubmit = e => {
    e.preventDefault()
    const otpCode = otp

    //console.log('otp entered', otpCode)

    if (!otpCode) {
      toast.error(t('Please enter a valid OTP'))

      return
    }

    dispatch(
      createEmailOtp({
        function: 'VALIDATE_OTP',
        data: {
          otp: {
            contact_info: email,
            otp_code: otpCode,
            source_type: 'USER_SIGNUP',
            source_id: sourceId,
            otp_type: 'EMAIL',
            signup_key: signupKey
          }
        }
      })
    )
  }

  const resendEmailOtpSubmit = () => {
    console.log('code resent')
    dispatch(
      resendEmailOtp({
        function: 'REQUEST_OTP',
        data: {
          otp: {
            contact_info: email,
            otp_type: 'EMAIL',
            source_id: sourceId,
            source_type: 'USER_SIGNUP',
            signup_key: signupKey
          }
        }
      })
    )
  }

  return (
    <>
      <form onSubmit={onEmailCodeSubmit}>
        <GoBackButton handlePrev={handlePrev} handleNext={handleNext} />

        <GMETitle title='We’ve sent you an email' subTitle='Please enter the code we’ve sent to' />

        <OtpInput value={otp} valueLength={6} onChange={onChange} />

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {seconds > 0 || minutes > 0 ? (
            <Typography color='text.grey'>
              <Translations text='OTP Expires in' /> : {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Typography>
          ) : (
            <Typography color='text.grey'>
              <Translations text="Didn't receive code?" />{' '}
            </Typography>
          )}

          <Button onClick={resendEmailOtpSubmit} sx={{ py: 1, paddingLeft: 1, paddingRight: 22 }}>
            <Translations text='Resend Code' />
          </Button>
          {/* <Typography sx={{ paddingRight: 22 }} color='text.grey'>
            OTP Expires in : 01:20
          </Typography> */}
        </Box>
        <Box sx={{ mb: 6, mt: 8 }}>
          <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
            <Translations text='Make sure you have entered the correct email address. Also check your spam folder.' />
          </Typography>
        </Box>
        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Submit OTP' />
        </Button>
      </form>
    </>
  )
}

export default StepEmailOTP
