// ** React Imports
import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import Link from 'next/link'

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

const StepEmailCode = ({ handleNext, handlePrev }) => {
  const dispatch = useDispatch()
  // ** State
  const [isBackspace, setIsBackspace] = useState(false)
  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, sourceId, signupKey, error, message } = registrationStatus
  // ** Hooks
  const theme = useTheme()
  const { t } = useTranslation()
  const email = useSelector(store => store.register.email)

  const yourEmail = `${email}`
  //{<Translations text='We’ve sent you an email' />}

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && signupStatus === 'VERIFIED') {
      toast.success(t(message))
      handleNext()
    } else if (responseStatus === 'SUCCESS' && signupStatus === 'SENT') {
      toast.success(t(message))
    } else if (responseStatus === 'FAILURE' && signupStatus === 'MISMATCH') {
      toast.error(message)
    } else if (responseStatus === 'FAILURE' && signupStatus === 'EXPIRED') {
      toast.error(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, message, handleNext])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (value1, event, onChange) => {
    console.log('ok ok ok', event.target.value)

    if (!isBackspace) {
      onChange(event)

      const form = event.target.form

      const index = [...form].indexOf(event.target)

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

  const onEmailCodeSubmit = data => {
    const otpCode = data.val1 + data.val2 + data.val3 + data.val4 + data.val5 + data.val6

    console.log('souce id', sourceId)

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

  //console.log('loggg cleaver')

  return (
    <>
      <GoBackButton handlePrev={handlePrev} handleNext={handleNext} />

      <GMETitle title={<Translations text='We’ve sent you an email' />} />

      <form onSubmit={handleSubmit(onEmailCodeSubmit)}>
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
          <Button onClick={resendEmailOtpSubmit} sx={{ py: 1, px: 1 }}>
            Resend Code
          </Button>
        </Box>
        <Box sx={{ mb: 6, mt: 8 }}>
          <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
            <Translations text='Make sure you have entered the correct email address. Also check your spam folder.' />
          </Typography>
        </Box>
        {error && (
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          Submit OTP
        </Button>
      </form>
    </>
  )
}

export default StepEmailCode
