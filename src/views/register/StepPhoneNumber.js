// ** React Imports
import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import MuiFormControlLabel from '@mui/material/FormControlLabel'

import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'

//import { onUserPhoneSubmit } from "src/store/apps/register/registerThunk"

import { createPhone, updatePhone } from 'src/store/apps/register'

import { getAllCountries } from 'src/store/apps/category'
import { Typography } from '@mui/material'

const phoneSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      { message: 'Please enter valid number', excludeEmptyString: false }
    )
    .required('This field is mandatory')
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

const StepPhoneNumber = ({ handleNext, handlePrev, handleSkipPhone }) => {
  const dispatch = useDispatch()
  const registrationStatus = useSelector(state => state.register)
  const { responseStatus, signupStatus, sourceId, error, message } = registrationStatus

  const { phone, signupKey, email } = useSelector(state => state.register)

  const { countries } = useSelector(state => state.category)

  const { t } = useTranslation()

  const defaultPhoneValues = {
    phoneFlag: '+82',
    phone: phone
  }

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && signupStatus === 'ADDED') {
      toast.success(t(message))
      handleNext()
    } else if (responseStatus === 'FAILURE' && signupStatus === 'ALREADY_REGISTERED') {
      toast.error(t('Phone number has already been registered.'), { duration: 5000 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus, signupStatus, message, handleNext])

  useEffect(() => {
    dispatch(
      getAllCountries({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'COUNTRY'
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // ** Hooks
  const {
    reset: phoneReset,
    control: control,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors }
  } = useForm({
    defaultValues: defaultPhoneValues,
    resolver: yupResolver(phoneSchema)
  })

  const onSubmit = data => {
    // console.log('dataa', data)
    dispatch(
      updatePhone({
        phoneCode: data.phoneFlag,
        phone: data.phone
      })
    )

    dispatch(
      createPhone({
        function: 'ADD_PHONE',
        data: {
          phone: {
            source_type: 'USER_SIGNUP',
            phone_code: data.phoneFlag,
            phone_number: data.phone,
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
      <GoBackButton handlePrev={handlePrev} handleNext={handleNext} skip={true} handleSkip={handleSkipPhone} />
      {error && (
        <Alert severity='error' sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <GMETitle title='Mobile Number' subTitle='Please enter your mobile number to receive a confirmation code.' />
      <form key={0} onSubmit={handlePhoneSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ mb: 16 }}>
          <Grid item xs={4}>
            {countries && (
              <Controller
                name='phoneFlag'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    // sx={{ paddingRight: '20px !important' }}
                    select
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e)
                    }}
                    id='validation-country-select'
                    // error={Boolean(error.select)}
                    aria-describedby='validation-country-select'
                    // {...(error.select && { helperText: "This field is mandatory" })}
                  >
                    {countries.length > 0 &&
                      countries.map((country, index) => {
                        return (
                          <MenuItem key={index} value={country.phone_code}>
                            <Grid
                              sx={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                justifyContent: 'flex-start',
                                alignContent: 'center'
                              }}
                            >
                              <img
                                src={country.icon}
                                alt={'flag of ' + country.country}
                                style={{ width: '15px', height: '15px', marginRight: '4px', marginTop: '4px' }}
                              />
                              <Typography>{country.phone_code}</Typography>
                            </Grid>
                          </MenuItem>
                        )
                      })}
                  </CustomTextField>
                )}
              />
            )}
          </Grid>

          <Grid item xs>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
              render={({ field: { value = '', onChange } }) => (
                <CustomTextField
                  fullWidth
                  autoFocus
                  type='number'
                  value={value}
                  onChange={onChange}
                  error={Boolean(phoneErrors.phone)}
                  // InputProps={{
                  //   startAdornment: (
                  //     <InputAdornment position='start'>
                  //       <img src='/images/logo/nep.png' alt='nepal' style={{ marginRight: "8px" }}></img> (+1)
                  //     </InputAdornment>
                  //   )
                  // }}
                  placeholder={t('Mobile Number')}
                  aria-describedby='stepper-linear-phone-phone'
                  {...(phoneErrors.phone && { helperText: t(phoneErrors.phone.message) })}
                />
              )}
            />
          </Grid>
        </Grid>

        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepPhoneNumber
