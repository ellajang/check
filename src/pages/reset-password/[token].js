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

import GMETitle from 'src/views/onboard-merchant/GMETitle'
import GoBackButton from 'src/views/register/GoBackButton'
import PasswordValidationTrackerBox from './PasswordValidationTracker'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
//import { onPasswordCreateSubmit } from "src/store/apps/register/registerThunk"

import { resetPassword, resetPassResetResponse } from 'src/store/apps/auth'
import Router, { useRouter } from 'next/router'

const FieldTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      // marginLeft: '50px !important',
      minWidth: '33rem'
    }
  })
)

const PasswordResetWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  }
}))

const defaultPasswordValues = {
  newPassword: '',
  confirmPassword: ''
}

const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required(
      'Password is required,Must contain at least one lowercase letter,Must be 8 characters long,Must contain at least one uppercase letter,Must contain at least one number,Must contain at least one special character'
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
    }),
  confirmPassword: yup
    .string()
    .required('Password is required,Passwords must match')
    .test('password-validation', 'Passwords must match', function (value) {
      const errors = []

      if (this.parent.newPassword !== value) {
        errors.push('Passwords must match')
      }

      return errors.length === 0 ? true : this.createError({ message: errors })
    })
})

const ResetPassword = () => {
  const router = useRouter()
  // ** States

  const [values, setValues] = useState({
    showPassword: false
  })

  const [showNewPassTracker, setShowNewPassTracker] = useState(false)
  const [showConfirmPassTracker, setShowConfirmPassTracker] = useState(false)
  const [newerrValue, setNewErrValue] = useState([])
  const [confirmErrValue, setConfirmErrValue] = useState([])

  const { t } = useTranslation()

  const dispatch = useDispatch()
  const { resetPasswordResponse, msg, messageCode } = useSelector(state => state.auth)

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handlePasswordChange = event => {
    if (event.target.value) {
      if (event.target.id === 'new-password') {
        const newPassword = event.target.value

        handlePasswordSubmit(() => {})({ newPassword: newPassword })
        setShowNewPassTracker(true)
        // setShowConfirmPassTracker(false)
      } else if (event.target.id === 'confirm-password') {
        const newPassword = event.target.value

        handlePasswordSubmit(() => {})({ confirmPassword: newPassword })
        setShowConfirmPassTracker(true)
        // setShowNewPassTracker(false)
      }
    } else {
      setShowNewPassTracker(false)
      setShowConfirmPassTracker(false)
    }
  }

  useEffect(() => {
    if (resetPasswordResponse === 'SUCCESS') {
      toast.success(msg)
      dispatch(resetPassResetResponse())
      if (messageCode === 'UPDATED_SUCCESSFULLY') {
        Router.push('/login')
      }
    } else if (msg) {
      toast.error(msg)
      dispatch(resetPassResetResponse())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetPasswordResponse])

  useEffect(() => {
    errNewSetter()
    errConfirmSetter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** Hooks
  const {
    reset: passwordReset,
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,

    formState: { errors }
  } = useForm({
    criteriaMode: 'all',
    mode: 'onSubmit',
    defaultValues: defaultPasswordValues,
    resolver: yupResolver(passwordSchema)
  })

  const onSubmit = data => {
    dispatch(
      resetPassword({
        function: 'UPDATE_DATA',
        scope: 'BYKEYWORD',
        data: {
          password_reset: {
            new_password: data.newPassword,
            confirm_password: data.confirmPassword,
            token: router?.query?.token
          }
        }
      })
    )
  }

  const errNewSetter = async () => {
    await passwordSchema.validate({}, { abortEarly: false }).catch(err => {
      let msg = err.inner[0]?.message.split(',')
      if (newerrValue.length === 0) {
        setNewErrValue(msg)
      }
    })
  }

  const errConfirmSetter = async () => {
    await passwordSchema.validate({}, { abortEarly: false }).catch(err => {
      let msg = err.inner[1]?.message.split(',')
      if (confirmErrValue.length === 0) {
        setConfirmErrValue(msg)
      }
    })
  }

  return (
    <PasswordResetWrapper>
      <Box className='content-center'>
        <Box sx={{ width: 448, height: 600 }}>
          {/* <GoBackButton handlePrev={handlePrev} /> */}
          <GMETitle title='New Password' subTitle='Make it strong to keep your account secure.' />
          <form onSubmit={handlePasswordSubmit(onSubmit)}>
            <Grid container spacing={5} sx={{ mb: 16 }}>
              <FieldTooltip
                title={<PasswordValidationTrackerBox allMsg={newerrValue} message={errors?.newPassword?.message} />}
                placement='right-start'
                open={showNewPassTracker}
                disableHoverListener
              >
                <Grid item xs={12}>
                  <Controller
                    name='newPassword'
                    control={passwordControl}
                    // rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        id='new-password'
                        type={values.showPassword ? 'text' : 'password'}
                        InputProps={{
                          onFocus: event => handlePasswordChange(event),
                          onBlur: () => setShowNewPassTracker(false),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                              >
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
                        error={Boolean(errors.newPassword)}
                        placeholder={t('New Password')}
                        aria-describedby='stepper-linear-password-password'
                      />
                    )}
                  />
                </Grid>
              </FieldTooltip>
              <FieldTooltip
                title={
                  <PasswordValidationTrackerBox allMsg={confirmErrValue} message={errors?.confirmPassword?.message} />
                }
                placement='right-start'
                open={showConfirmPassTracker}
                disableHoverListener
              >
                <Grid item xs={12}>
                  <Controller
                    name='confirmPassword'
                    control={passwordControl}
                    // rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        id='confirm-password'
                        type={values.showPassword ? 'text' : 'password'}
                        InputProps={{
                          onFocus: event => handlePasswordChange(event),
                          onBlur: () => setShowConfirmPassTracker(false),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                              >
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
                        error={Boolean(errors.confirmPassword)}
                        placeholder={t('Confirm Password')}
                        aria-describedby='stepper-linear-password-password'
                      />
                    )}
                  />
                </Grid>
              </FieldTooltip>
            </Grid>

            <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
              <Translations text='Continue' />
            </Button>
          </form>
        </Box>
      </Box>
    </PasswordResetWrapper>
  )
}

// ResetPassword.getLayout = page => <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>
ResetPassword.guestGuard = true

export default ResetPassword
