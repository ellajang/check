// ** React Imports
import { React, useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

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

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import toast from 'react-hot-toast'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
//import CustomRadioAccountType from 'src/views/forms/form-elements/custom-inputs/CustomRadioAccountType'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'
import PasswordValidationTrackerBox from './PasswordValidationTrackerBox'

//import { onPasswordCreateSubmit } from "src/store/apps/register/registerThunk"

import { createPassword } from 'src/store/apps/register'

const defaultPasswordValues = {
  password: ''
}

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required(
      'Password is mandatory, Must contain at least one lowercase letter, Must be 8 characters long, Must contain at least one uppercase letter, Must contain at least one number, Must contain at least one special character'
    )
    .test('password-validation', 'Password does not meet the criteria', function (value) {
      const errors = []

      if (!/[a-z]/.test(value)) {
        errors.push('Must contain at least one lowercase letter')
      }

      if (!/[A-Z]/.test(value)) {
        errors.push('Must contain at least one uppercase letter')
      }

      if (!/[0-9]/.test(value)) {
        errors.push('Must contain at least one number')
      }

      if (!/[!@#\$%\^&\*]/.test(value)) {
        errors.push('Must contain at least one special character')
      }

      if (value.length < 8) {
        errors.push('Must be 8 characters long')
      }

      return errors.length === 0 ? true : this.createError({ message: errors.join(', ') })
    })
})

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

const StepCreatePassword = ({ handlePasswordCreate, handlePrev }) => {
  // ** States

  const [values, setValues] = useState({
    showPassword: false
  })

  const [passwordValue, setPasswordValue] = useState('')
  const [showTracker, setShowTracker] = useState(false)

  const { t } = useTranslation()

  const dispatch = useDispatch()
  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, sourceId, signupKey, message } = registrationStatus

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handlePasswordChange = event => {
    const newPassword = event.target.value
    setPasswordValue(newPassword)
    handlePasswordSubmit(() => {})({ password: newPassword })
    setShowTracker(true)
  }

  const { email, password } = registrationStatus

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && signupStatus === 'SUCCESS') {
      //toast.success(message)
      toast.success(t('User registered successfully!'), { duration: 7000 })
      handlePasswordCreate()
    } else if (responseStatus !== null && responseStatus !== 'SUCCESS') {
      toast.error(t(message))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, message, handlePasswordCreate])

  // ** Hooks
  const {
    reset: passwordReset,
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors }
  } = useForm({
    criteriaMode: 'all',
    defaultValues: { password },
    resolver: yupResolver(passwordSchema)
  })

  const onSubmit = data => {
    //console.log('dataa', data)
    //setFormData({ ...formData, password: data.password })
    // handleNext()

    //    {
    //     "function": "SET_PASSWORD",
    //     "data": {
    // "user_signup_password": {
    //     "contact_info":"brock2@yopmail.com",
    //     "source_type":"USER_SIGNUP",
    //     "source_id":44,
    //     "password":"P4@modUjkl"
    // }
    //     }
    // }

    dispatch(
      createPassword({
        function: 'SET_PASSWORD',
        data: {
          user_signup_password: {
            contact_info: email,
            source_type: 'USER_SIGNUP',
            source_id: sourceId,
            signup_key: signupKey,
            password: data.password
          }
        }
      })
    )
  }

  useEffect(() => {
    if (passwordErrors?.password?.message) {
      setShowTracker(true)
    }
    if (Object.values(passwordErrors).length === 0) {
      setTimeout(() => {
        setShowTracker(false)
      }, 1000)
    }
  }, [passwordErrors])

  return (
    <>
      <GoBackButton handlePrev={handlePrev} />
      <GMETitle title='Create a password' subTitle='Create a strong password for account security.' />
      <form key={0} onSubmit={handlePasswordSubmit(onSubmit)}>
        <Grid container spacing={5} sx={{ mb: 16 }}>
          <Grid item xs={12}>
            <Controller
              name='password'
              control={passwordControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  id='input-password'
                  type={values.showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  value={value}
                  onChange={event => {
                    onChange(event)
                    handlePasswordChange(event)
                  }}
                  error={Boolean(passwordErrors.password)}
                  placeholder={t('Password')}
                  aria-describedby='stepper-linear-password-password'
                />
              )}
            />

            {showTracker && <PasswordValidationTrackerBox errors={passwordErrors} />}
          </Grid>
        </Grid>

        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepCreatePassword
