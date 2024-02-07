// ** React Imports
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
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

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'

//import { onPhoneOTPSubmit } from "src/store/apps/register/registerThunk"

import { createPhoneOtp, resendPhoneOtp } from 'src/store/apps/register'

import OtpInput from './OTPInput'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

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

const StepOTPCode = ({ handleNext, handlePrev }) => {
  const dispatch = useDispatch()
  // ** State
  const [isBackspace, setIsBackspace] = useState(false)

  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, error, sourceId, message } = registrationStatus

  // ** Hooks
  const theme = useTheme()

  const [phoneOTP] = useState({ otp1: null, otp2: null, otp3: null, otp4: null, otp5: null, otp6: null })

  const { phone, phoneCode, email, signupKey } = useSelector(store => store.register)

  const { t } = useTranslation()

  //const subTitle = `Please enter the code we have sent to ${phone}`
  const subTitle = 'Please enter the code we’ve sent to'

  useEffect(() => {
    console.log('phone otp useeffect')
    // send  user to OTP page if email registration post was sent successfully
    if (responseStatus === 'SUCCESS' && signupStatus === 'VERIFIED') {
      toast.success(t(message))
      handleNext()
    } else if (responseStatus === 'SUCCESS' && signupStatus === 'SENT') {
      toast.success(t(message))
    } else if (signupStatus === 'MISMATCH') {
      toast.error(t(message))
    } else if (signupStatus === 'EXPIRED') {
      toast.error(t(message))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, message, handleNext])

  const [otp, setOtp] = useState('')
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const onChange = value => setOtp(value)

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

  const onOTPSubmit = e => {
    //console.log("data is", data)
    //console.log("source id", sourceId)

    e.preventDefault()

    const otpCode = otp

    console.log('otp submit', otpCode)

    if (!otpCode) {
      toast.error('Please enter a valid OTP')

      return
    }

    dispatch(
      createPhoneOtp({
        function: 'VALIDATE_OTP',
        data: {
          otp: {
            contact_info: email,
            phone_code: phoneCode,
            phone_number: phone,
            otp_code: otpCode,
            source_type: 'USER_SIGNUP',
            source_id: sourceId,
            otp_type: 'SMS',
            signup_key: signupKey
          }
        }
      })
    )
  }

  const resendPhoneOtpSubmit = () => {
    console.log('code resent')
    dispatch(
      resendPhoneOtp({
        function: 'REQUEST_OTP',
        data: {
          otp: {
            otp_type: 'SMS',
            source_type: 'USER_SIGNUP',
            phone_code: phoneCode,
            phone_number: phone,
            source_id: sourceId,
            contact_info: email,
            signup_key: signupKey
          }
        }
      })
    )
  }

  return (
    <>
      <form onSubmit={onOTPSubmit}>
        <GoBackButton handlePrev={handlePrev} handleNext={handleNext} />

        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' sx={{ mb: 1.5 }}>
            <Translations text='We have sent you a OTP' />
          </Typography>
          <Typography color='text.secondary' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
            <Translations text={subTitle} /> {phone}
          </Typography>
        </Box>

        <OtpInput value={otp} valueLength={6} onChange={onChange} />

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {seconds > 0 || minutes > 0 ? (
            <Typography color='text.grey'>
              OTP Expires in: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Typography>
          ) : (
            <Typography color='text.grey'>Didn't recieve code? </Typography>
          )}
          <Button onClick={resendPhoneOtpSubmit} sx={{ py: 1, paddingLeft: 1, paddingRight: 22 }}>
            <Translations text='Resend Code' />
          </Button>
        </Box>

        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Submit OTP' />
        </Button>
      </form>
    </>
  )
}

export default StepOTPCode
