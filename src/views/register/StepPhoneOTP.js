// ** React Imports
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import Link from 'next/link'

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

const defaultValues = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}

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

  //const subTitle = `Please enter the code we have sent to ${phone}`
  const subTitle = 'Please enter the code we’ve sent to'

  useEffect(() => {
    console.log('phone otp useeffect')
    // send  user to OTP page if email registration post was sent successfully
    if (responseStatus === 'SUCCESS' && signupStatus === 'VERIFIED') {
      toast.success(message)
      handleNext()
    } else if (responseStatus === 'SUCCESS' && signupStatus === 'SENT') {
      toast.success(message)
    } else if (responseStatus === 'FAILURE' && signupStatus === 'MISMATCH') {
      toast.error(message)
    } else if (responseStatus === 'FAILURE' && signupStatus === 'EXPIRED') {
      toast.error(message)
    }
  }, [responseStatus, signupStatus, message, handleNext])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: phoneOTP })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (value1, event, onChange) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form

      // console.log('loggg now form', form)
      const index = [...form].indexOf(event.target)

      // setFormData({
      //   ...formData,
      //   phoneOTP: { ...phoneOTP, [value1]: event.target.value }
      // })

      // console.log('loggg now form index', index)
      // console.log('loggg now form otp value 1', value1)
      //console.log('form[index].value', form[index].value)
      //console.log('form[index].value.length', form[index].value.length)
      if (index === 5) {
        console.log('last box')
      } else if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const onOTPSubmit = data => {
    console.log('otp submit')
    //console.log("data is", data)
    //console.log("source id", sourceId)

    const otpCode = data.val1 + data.val2 + data.val3 + data.val4 + data.val5 + data.val6

    console.log('whats otp code', otpCode)

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

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={event => handleChange(`otp${index + 1}`, event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  return (
    <>
      <GoBackButton handlePrev={handlePrev} handleNext={handleNext} />

      <Box sx={{ mb: 6 }}>
        <Typography variant='titleGME' sx={{ mb: 1.5 }}>
          <Translations text='We have sent you a OTP' />
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
          <Translations text={subTitle} /> {phone}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onOTPSubmit)}>
        <CleaveWrapper
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...(errorsArray.length && {
              '& .invalid:focus': {
                borderColor: theme => `${theme.palette.error.main} !important`,
                boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
              }
            })
          }}
        >
          {renderInputs()}
        </CleaveWrapper>
        {errorsArray.length ? (
          <FormHelperText sx={{ color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}>
            Please enter a valid OTP
          </FormHelperText>
        ) : null}

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Button onClick={resendPhoneOtpSubmit} sx={{ py: 1, px: 1 }}>
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
