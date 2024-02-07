// ** React Imports
import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

// ** MUI Components

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import FormControl from '@mui/material/FormControl'

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

import { createEmail, updateEmail } from 'src/store/apps/register'

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'
import FallbackSpinner from 'src/layouts/components/spinner'

const emailSchema = yup.object().shape({
  email: yup.string().email('Please input a valid email address').required('Email is a mandatory field')
})

const StepEmail = ({ handleNext, handlePrev, handleSkipToPhone, handleSkipToPassword }) => {
  const dispatch = useDispatch()
  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, loading, error } = registrationStatus
  const { accountType, countryOfIncorporation, email } = useSelector(store => store.register)

  const { t } = useTranslation()

  const defaultEmailValues = {
    email: email
  }

  useEffect(() => {
    console.log('heeeeelo', responseStatus, signupStatus)
    if (responseStatus === 'SUCCESS') {
      if (signupStatus === 'CREATED') {
        toast.success(t('User registered successfully!'))
        handleNext()
      }
    } else if (responseStatus === 'FAILURE') {
      if (signupStatus === 'ALREADY_SIGNED_UP') {
        toast.error(t('User already exists! Please login or proceed with password recovery.'), { duration: 6000 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, handleNext, handleSkipToPhone, handleSkipToPassword, dispatch])

  // ** Hooks
  const {
    reset: emailReset,
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors }
  } = useForm({
    defaultValues: defaultEmailValues,
    resolver: yupResolver(emailSchema)
  })

  const onSubmit = data => {
    dispatch(updateEmail(data.email))

    dispatch(
      createEmail({
        function: 'SIGNUP_REQUEST',
        data: {
          user_signup: {
            source_type: 'MERCHANT',
            association_type: accountType,
            contact_type: 'EMAIL',
            contact_info: data.email,
            incorporation_country: countryOfIncorporation
          }
        }
      })
    )
  }

  return (
    <>
      <GoBackButton handlePrev={handlePrev} handleNext={handleNext} />

      {error && (
        <Alert severity='error' sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <GMETitle title='Email Address' subTitle='Please enter the email address for an account creation and login.' />
      <form key={0} autoComplete='off' onSubmit={handleEmailSubmit(onSubmit)}>
        <Grid container spacing={5} sx={{ mb: 16 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='email'
                control={emailControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    // type='email'
                    value={value}
                    onChange={onChange}
                    error={Boolean(emailErrors.email)}
                    placeholder={t('Email')}
                    aria-describedby='stepper-linear-email-email'
                    {...(emailErrors.email && { helperText: t(emailErrors.email.message) })}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        {loading ? <FallbackSpinner /> : null}
        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepEmail
