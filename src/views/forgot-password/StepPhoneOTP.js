// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

// ** MUI Components
import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import MuiFormControlLabel from '@mui/material/FormControlLabel'

import { styled, useTheme } from '@mui/material/styles'

import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'

import Translations from 'src/layouts/components/Translations'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'

import GMETitle from 'src/views/register/GMETitle'
import GoBackButton from 'src/views/register/GoBackButton'

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

const StepPhoneOTP = ({ handleNext, handlePrev }) => {
  // ** States
  const [values, setValues] = useState({
    showPassword: false,
    showConfirmPassword: false
  })

  // ** Hooks
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
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
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  return (
    <>
      <GoBackButton handlePrev={handlePrev} />

      <GMETitle title='We have sent you a OTP' subTitle='Please enter the code we’ve sent to' />

      <form onSubmit={handleSubmit(() => true)}>
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
            <Translations text='Please enter a valid OTP' />
          </FormHelperText>
        ) : null}
      </form>
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
          <Translations text='Resend Code' />
        </Typography>
      </Box>

      <Button onClick={handleNext} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
        <Translations text='Continue' />
      </Button>
    </>
  )
}

export default StepPhoneOTP
