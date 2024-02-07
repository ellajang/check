import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

import GMETitle from 'src/views/register/GMETitle'
import GoBackButton from 'src/views/register/GoBackButton'

// ** Redux Actions
import { resetPassword, resetPassResetResponse } from 'src/store/apps/auth'
import { useEffect } from 'react'

const defaultEmailValues = {
  email: ''
}

const emailSchema = yup.object().shape({
  email: yup.string().email().required()
})

const StepRecoverPassword = ({ handleNext, handlePrev, setEmail }) => {
  const dispatch = useDispatch()
  const { resetPasswordResponse, messageCode, msg } = useSelector(state => state.auth)
  const { t } = useTranslation()

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors }
  } = useForm({
    defaultValues: defaultEmailValues,
    resolver: yupResolver(emailSchema)
  })

  useEffect(() => {
    if (resetPasswordResponse === 'SUCCESS') {
      toast.success(msg)
      dispatch(resetPassResetResponse())
      if (messageCode === 'PASSWORD_RESET_LINK_SENT') {
        handleNext()
      }
    } else if (msg) {
      toast.error(msg)
      dispatch(resetPassResetResponse())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetPasswordResponse])

  const onSubmit = data => {
    setEmail(data.email)

    dispatch(
      resetPassword({
        function: 'GENERATE',
        scope: 'BYKEYWORD',
        data: {
          password_reset: {
            email_id: data.email
          }
        }
      })
    )
  }

  return (
    <>
      <GoBackButton handlePrev={handlePrev} />

      <GMETitle title='Recover Password' subTitle='Enter your registered email to recover your password' />
      <form key={0} onSubmit={handleEmailSubmit(onSubmit)}>
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
                    type='email'
                    value={value}
                    onChange={onChange}
                    error={Boolean(emailErrors.email)}
                    placeholder={t('Email')}
                    aria-describedby='stepper-linear-email-email'
                    {...(emailErrors.email && { helperText: emailErrors.email.message })}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepRecoverPassword
