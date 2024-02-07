// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

import LanguageDropdown from 'src/layouts/components/shared/LanguageDropdown'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const GMELogo = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 52,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12)
}))

const LeftWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12),
  '& .img-mask': {
    left: 0
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 826
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper

  // [theme.breakpoints.up('md')]: {
  //   maxWidth: 600
  // },
  // [theme.breakpoints.up('lg')]: {
  //   maxWidth: 600
  // },
  // [theme.breakpoints.up('xl')]: {
  //   maxWidth: 750
  // }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

const defaultValues = {
  password: '',
  email: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const { t } = useTranslation()

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const { email, password } = data

    auth.login({
      function: 'AUTHENTICATE',
      data: {
        user_auth: {
          username: email,
          password: password
        }
      }
    })
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'customColors.bodyBg' }}>
      {!hidden ? (
        <LeftWrapper>
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <GMELogo alt='GME logo' src={'/images/logo/logo.png'} />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={'/images/pages/avatar1.png'}
                  alt='Unlock Global Payment Opportunities'
                  height='38'
                  width='38'
                />
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  <Translations text='Unlock Global Payment Opportunities' />
                </Typography>
                <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                  <Translations text='Sign up with us to seamlessly Make Payments and GET PAID in various currencies.' />
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                color: 'text.disabled',
                '& .MuiDivider-wrapper': { px: 6 },
                fontSize: theme.typography.body2.fontSize,
                my: theme => `${theme.spacing(6)} !important`
              }}
            ></Divider>
            {/*  */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <img src={'/images/pages/fx-avatar.png'} alt='effortless fx and transfers' height='38' width='38' />
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  <Translations text='Effortless FX & Transfers' />
                </Typography>
                <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                  <Translations text='International transfers made easy: send your funds at competitive rates and unmatched speed.' />
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                color: 'text.disabled',
                '& .MuiDivider-wrapper': { px: 6 },
                fontSize: theme.typography.body2.fontSize,
                my: theme => `${theme.spacing(6)} !important`
              }}
            ></Divider>
            {/*  */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={'/images/pages/payment-links-avatar.png'}
                  alt='online payment and payment links'
                  height='38'
                  width='38'
                />
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  <Translations text='Streamlined Online Payments & Payment Links' />
                </Typography>
                <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                  <Translations text='Select from various payment methods to suit your business needs.' />
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                color: 'text.disabled',
                '& .MuiDivider-wrapper': { px: 6 },
                fontSize: theme.typography.body2.fontSize,
                my: theme => `${theme.spacing(6)} !important`
              }}
            ></Divider>
          </Box>
        </LeftWrapper>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {hidden && <GMELogo alt='GME logo' src={'/images/logo/logo.png'} />}
            </Box>
            <Box sx={{ my: 6 }}>
              <Typography variant='titleGME' sx={{ mb: 1.5 }}>
                <Translations text='Log In' />
              </Typography>
              <Typography sx={{ color: 'text.grey2' }}>
                <Translations text='to your GMEBiz account' />
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder={t('Email')}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: t(errors.email.message) })}
                      id='input-with-icon-textfield'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='eva:email-fill' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder={t('Password')}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: t(errors.password.message) })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:password' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label={<Translations text='Remember Me' />}
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography component={LinkStyled} href='/forgot-password'>
                  <Translations text='Forgot your password? Reset now!' />
                </Typography>
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                <Translations text='Sign In' />
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>
                  <Translations text='New to GMEBiz?' />
                </Typography>
                <Typography href='/register' component={LinkStyled}>
                  <Translations text='Sign Up' />
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', height: '10%', alignItems: 'flex-start', justifyContent: 'center', gap: 6 }}>
          <Typography sx={{ paddingTop: '5px' }}>
            &copy; <Translations text='GMEBiz. All rights reserved.' />
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ paddingTop: '5px' }}>{t('Choose Language')}:</Typography>
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
