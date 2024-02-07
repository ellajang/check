import { Fragment, useState, React, forwardRef, useEffect } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomInput from 'src/views/onboard-merchant/PickersCustomInput'
import { Controller, useForm } from 'react-hook-form'
import Translations from 'src/layouts/components/Translations'
import { getAllBusinessTypes, getAllCountries } from 'src/store/apps/category'
import { getMerchants, createBusinessDetails, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { useAuth } from 'src/hooks/useAuth'

const DetailsEditView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { t } = useTranslation()
  const { merchants, error, loading, message, responseStatus, messageCode } = useSelector(state => state.onboarding)
  const { countries, businessTypes, countryError, businessTypeError } = useSelector(state => state.category)

  useEffect(() => {
    if (!(merchants.length > 0)) {
      dispatch(
        getMerchants({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            query_params: {
              by: 'MERCHANT_ID',
              value: auth?.user?.source_id
            }
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!(countries.length > 0)) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!(businessTypes.length > 0)) {
      dispatch(
        getAllBusinessTypes({
          function: 'SEARCH',
          scope: 'BYKEYWORD',
          data: {
            query_params: {
              for_one: 'BUSINESS_TYPE'
            }
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      if (messageCode === 'UPDATED_SUCCESSFULLY') {
        Router.push('/onboarding/documents/business-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      console.log('msg', message)
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      phone: '',
      phoneCode: '',
      legalBusinessName: '',
      businessNameNative: '',
      businessType: '',
      registrationNumber: '',
      doi: '',
      businessWebsite: ''
    }
  })

  useEffect(() => {
    if (countries && merchants && businessTypes) {
      console.log('before reset', merchants)
      reset({
        phone: merchants[0]?.phone_number,
        phoneCode: merchants[0]?.phone_code,
        legalBusinessName: merchants[0]?.business_name,
        businessNameNative: merchants[0]?.business_name_native,
        businessType: merchants[0]?.business_type,
        registrationNumber: merchants[0]?.bizz_reg_no,
        doi: merchants[0]?.incorporation_date ? new Date(merchants[0]?.incorporation_date) : '',
        businessWebsite: merchants[0]?.website
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchants, reset])

  const checkPhoneCode = watch('phoneCode')

  const onSubmit = data => {
    console.log('Data', data)
    dispatch(
      createBusinessDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchant: {
            ...merchants[0],
            phone_code: data.phoneCode,
            phone_number: data.phone,
            business_name: data.legalBusinessName,
            business_name_native: data.businessNameNative,
            business_type: data.businessType,
            incorporation_date: data.doi,
            bizz_reg_no: data.registrationNumber,
            website: data.businessWebsite
          }
        }
      })
    )
  }

  return (
    <Box className='content-center'>
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 432 }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Button
            sx={{
              '& svg': { mr: 2 },
              ':hover': {
                bgcolor: 'secondary.luma',
                color: 'primary'
              },
              p: 0
            }}
            onClick={() => {
              Router.push('/onboarding/documents/business-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Business Details' />
          </Typography>
        </Box>
        <Box>
          <DatePickerWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Controller
                        name='phoneCode'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            select
                            fullWidth
                            SelectProps={{
                              value: value,
                              onChange: e => onChange(e)
                            }}
                            id='validation-country-select'
                            error={Boolean(errors.phoneCode)}
                            aria-describedby='validation-country-select'
                            {...(errors.phoneCode && { helperText: <Translations text='This field is mandatory' /> })}
                            sx={{
                              '& .MuiSelect-select .notranslate::after': '+82'
                                ? {
                                    content: `"Code"`,
                                    opacity: 0.42
                                  }
                                : {}
                            }}
                          >
                            {countries?.length > 0 ? (
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
                                        alt={country.country}
                                        style={{ width: '15px', height: '15px', marginRight: '4px', marginTop: '4px' }}
                                      />
                                      <Typography>{country.phone_code}</Typography>
                                    </Grid>
                                  </MenuItem>
                                )
                              })
                            ) : (
                              <MenuItem></MenuItem>
                            )}
                          </CustomTextField>
                        )}
                      />
                    </Grid>

                    <Grid item xs>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{
                          required: { value: true, message: t('This field is mandatory') },
                          pattern: { value: /[0-9]+/i, message: t('Please enter numbers only') },
                          minLength: { value: 10, message: t('Minimum 10 Characters') }
                        }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            type='tel'
                            value={value}
                            disabled={!checkPhoneCode}
                            onChange={onChange}
                            error={Boolean(errors.phone)}
                            placeholder={t('Phone Number')}
                            aria-describedby='stepper-linear-phone-phone'
                            {...(errors.phone && { helperText: errors.phone.message })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='legalBusinessName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Legal Business Name (in English)')}
                        error={Boolean(errors.legalBusinessName)}
                        aria-describedby='validation-legal-business-name'
                        {...(errors.legalBusinessName && {
                          helperText: <Translations text='This field is mandatory' />
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='businessNameNative'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Business Name (in Native Language)')}
                        error={Boolean(errors.businessNameNative)}
                        aria-describedby='validation-business-name-native'
                        {...(errors.businessNameNative && {
                          helperText: <Translations text='This field is mandatory' />
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='businessType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-business-type'
                        error={Boolean(errors.businessType)}
                        aria-describedby='validation-business-type'
                        {...(errors.businessType && { helperText: <Translations text='This field is mandatory' /> })}
                        sx={{
                          '& .MuiSelect-select .notranslate::after': 'Business Type'
                            ? {
                                content: `"${t('Business Type')}"`,
                                opacity: 0.42
                              }
                            : {}
                        }}
                      >
                        {businessTypes?.length > 0 ? (
                          businessTypes.map((type, index) => {
                            return (
                              <MenuItem key={index} value={type.category_code}>
                                {type.description}
                              </MenuItem>
                            )
                          })
                        ) : (
                          <MenuItem></MenuItem>
                        )}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='registrationNumber'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Registration Number')}
                        error={Boolean(errors.registrationNumber)}
                        aria-describedby='validation-registration-number'
                        {...(errors.registrationNumber && {
                          helperText: <Translations text='This field is mandatory' />
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='doi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      // <Box className='customDatePickerWidth'>
                      <DatePicker
                        dateFormat='yyyy-MM-dd'
                        showYearDropdown
                        showMonthDropdown
                        scrollableYearDropdown={true}
                        selected={value}
                        maxDate={new Date()}
                        id='month-year-dropdown'
                        placeholderText={t('Date of Incorporation')}
                        popperPlacement={popperPlacement}
                        onChange={onChange}
                        customInput={
                          <CustomInput
                            fullWidth
                            icon='uil:calender'
                            error={Boolean(errors.doi)}
                            aria-describedby='validation-registration-number'
                            {...(errors.doi && { helperText: <Translations text='This field is mandatory' /> })}
                          />
                        }
                      />
                      // </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='businessWebsite'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Business Website') + '(' + t('Optional') + ')'}
                        error={Boolean(errors.businessWebsite)}
                        aria-describedby='validation-business-website'
                        {...(errors.businessWebsite && { helperText: <Translations text='This field is mandatory' /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                  <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                    <Translations text='Update' />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DatePickerWrapper>
        </Box>
      </Box>
    </Box>
  )
}

export default DetailsEditView
