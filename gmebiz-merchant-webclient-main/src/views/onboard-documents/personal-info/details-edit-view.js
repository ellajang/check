import { React, Fragment, useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Router from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

import Button from '@mui/material/Button'

import DatePicker, { registerLocale } from 'react-datepicker'

import ko from 'date-fns/locale/ko'
import en from 'date-fns/locale/en-GB'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports

import { useForm, Controller } from 'react-hook-form'

import toast from 'react-hot-toast'

// ** Custom Component Imports
import CustomInput from '/src/views/onboard-merchant/PickersCustomInput'

import GMETitle from '/src/views/onboard-merchant/GMETitle'

import { createPersonalDetails, getMerchantPersonalDetails, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { getAllCountries } from 'src/store/apps/category'
import subYears from 'date-fns/subYears'

import authConfig from 'src/configs/auth'
import { MenuItem, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import FallbackSpinner from 'src/layouts/components/spinner'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const detailSchema = yup.object().shape({
  firstName: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  middleName: yup.string().max(50, 'Please enter a maximum of 50 characters.'),
  lastName: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  fullNameNative: yup.string().max(50, 'Please enter a maximum of 50 characters.')
})

registerLocale('ko', ko)
registerLocale('en', en)

const DetailsEditView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const auth = useAuth()

  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { merchantPersonalDetails, responseStatus, message, onboardLoading, messageCode } = useSelector(
    state => state.onboarding
  )
  const { countries, loading } = useSelector(state => state.category)

  const userLanguage = localStorage.getItem(authConfig.selectedLanguage)

  // ** Hooks

  useEffect(() => {
    dispatch(
      getMerchantPersonalDetails({
        function: 'SEARCH',
        scope: 'SINGLE'
      })
    )
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
  }, [dispatch])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())

      if (message === 'Updated successfully.') {
        Router.push('/onboarding/documents/personal-info')
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
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(detailSchema),
    defaultValues: {
      firstName: merchantPersonalDetails?.first_name ? merchantPersonalDetails.first_name : '',
      middleName: merchantPersonalDetails?.middle_name ? merchantPersonalDetails.middle_name : '',
      lastName: merchantPersonalDetails?.last_name ? merchantPersonalDetails.last_name : '',
      fullNameNative: merchantPersonalDetails?.full_name_native ? merchantPersonalDetails.full_name_native : '',
      dob: merchantPersonalDetails?.dob ? new Date(merchantPersonalDetails.dob) : '',
      country: merchantPersonalDetails?.country ? merchantPersonalDetails.country : ''
    }
  })

  useEffect(() => {
    if (merchantPersonalDetails) {
      reset({
        firstName: merchantPersonalDetails?.first_name ? merchantPersonalDetails.first_name : '',
        middleName: merchantPersonalDetails?.middle_name ? merchantPersonalDetails.middle_name : '',
        lastName: merchantPersonalDetails?.last_name ? merchantPersonalDetails.last_name : '',
        fullNameNative: merchantPersonalDetails?.full_name_native ? merchantPersonalDetails.full_name_native : '',
        dob: merchantPersonalDetails?.dob ? new Date(merchantPersonalDetails.dob) : '',
        country: merchantPersonalDetails?.country ? merchantPersonalDetails.country : ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantPersonalDetails, reset])

  const onSubmit = data => {
    dispatch(
      createPersonalDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          user: {
            ...merchantPersonalDetails,
            user_type: auth.user.user_type,
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            full_name_native: data.fullNameNative,
            dob: data.dob,
            country: data.country
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
              Router.push('/onboarding/documents/personal-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box>
          <DatePickerWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <GMETitle title='Personal Details' />
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='firstName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Given Name (in English)')}
                        error={Boolean(errors.firstName)}
                        aria-describedby='validation-basic-first-name'
                        {...(errors.firstName && { helperText: <Translations text={errors.firstName.message} /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='middleName'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Middle Name') + '(' + t('Optional') + ')'}
                        error={Boolean(errors.middleName)}
                        aria-describedby='validation-basic-middle-name'
                        {...(errors.middleName && { helperText: <Translations text={errors.middleName.message} /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='lastName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Surname (in English)')}
                        error={Boolean(errors.lastName)}
                        aria-describedby='validation-basic-last-name'
                        {...(errors.lastName && { helperText: <Translations text={errors.lastName.message} /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='fullNameNative'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Native Name')}
                        error={Boolean(errors.fullNameNative)}
                        aria-describedby='validation-basic-full-name-native'
                        {...(errors.fullNameNative && {
                          helperText: <Translations text={errors.fullNameNative.message} />
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Controller
                    name='dob'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        dateFormat='yyyy-MM-dd'
                        showYearDropdown
                        showMonthDropdown
                        scrollableYearDropdown={true}
                        yearDropdownItemNumber={100}
                        selected={value}
                        openToDate={new Date('1980-01-01')}
                        maxDate={subYears(new Date(), 14)}
                        id='month-year-dropdown'
                        placeholderText={t('Date of Birth')}
                        popperPlacement={popperPlacement}
                        onChange={onChange}
                        locale={userLanguage === 'ko' ? 'ko' : 'en'}
                        customInput={
                          <CustomInput
                            fullWidth
                            icon='uil:calender'
                            error={Boolean(errors.dob)}
                            aria-describedby='validation-basic-last-name'
                            {...(errors.dob && { helperText: <Translations text='This field is mandatory' /> })}
                          />
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='country'
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
                        error={Boolean(errors.country)}
                        aria-describedby='validation-country-select'
                        {...(errors.country && { helperText: <Translations text='This field is mandatory' /> })}
                        sx={{
                          '& .MuiSelect-select .notranslate::after': 'Country'
                            ? {
                                content: `"${t('Country')}"`,
                                opacity: 0.42
                              }
                            : {}
                        }}
                      >
                        {countries?.length > 0 ? (
                          countries.map((country, index) => {
                            return (
                              <MenuItem key={index} value={country.country_code}>
                                <img
                                  src={country.icon}
                                  alt={'flag of ' + country.country}
                                  style={{ width: '14px', height: '14px', marginRight: '4px' }}
                                />
                                <Translations text={country.country} />
                              </MenuItem>
                            )
                          })
                        ) : (
                          <MenuItem />
                        )}
                      </CustomTextField>
                    )}
                  />
                </Grid>
              </Grid>
              {(loading || onboardLoading) && (
                <Grid
                  item
                  xs
                  sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', mt: 10 }}
                >
                  <FallbackSpinner />
                </Grid>
              )}

              <Button
                disabled={loading || onboardLoading}
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mb: 4, mt: 16 }}
              >
                <Translations text='Update' />
              </Button>
            </form>
          </DatePickerWrapper>
        </Box>
      </Box>
    </Box>
  )
}

export default DetailsEditView
