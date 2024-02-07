import { useEffect, React, Fragment, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import Alert from '@mui/material/Alert'
// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'
import { getAllBusinessTypes, getAllCountries, getGeoInfo } from 'src/store/apps/category'
import GMETitle from './GMETitle'
import { useAuth } from 'src/hooks/useAuth'
import { updateBusinessDetails } from 'src/store/apps/onboarding'
import { CircularProgress, Typography } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const businessDetailSchema = yup.object().shape({
  phone: yup
    .string()
    .required('This field is mandatory')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Please enter valid phone number.'
    )
    .max(11, 'Please enter a maximum of 11 characters.')
    .min(10, 'Please enter a minimum of 10 characters.'),
  legalBusinessName: yup
    .string()
    .required('This field is mandatory')
    .matches(/^[A-Za-z\s]+$/, 'Please enter english charecters only.')
    .max(50, 'Please enter a maximum of 50 characters.'),
  businessNameNative: yup.string().max(50, 'Please enter a maximum of 50 characters.'),
  registrationNumber: yup
    .string()
    .required('This field is mandatory')
    .max(15, 'Please enter a maximum of 15 characters.'),
  businessWebsite: yup
    .string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .matches(
      /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
      'Please enter a valid website.'
    )
})

const StepBusinessDetails = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { businessDetails, countryOfResidence } = onboarding

  const { localPhoneCode, businessTypes, countries, businessTypeError, loading } = useSelector(state => state.category)

  // ** Hooks
  useEffect(() => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  let defaultPhoneCode = ''
  if (businessDetails?.phoneCode && countries?.length > 0) {
    defaultPhoneCode = businessDetails.phoneCode
  } else if (countryOfResidence?.country && countries?.length > 0) {
    defaultPhoneCode = countries.find(country => country.country_code === countryOfResidence.country)?.phone_code
      ? countries.find(country => country.country_code === countryOfResidence.country)?.phone_code
      : ''
  } else if (auth.user?.incorporation_country && countries?.length > 0) {
    defaultPhoneCode = countries.find(country => country.country_code === auth.user.incorporation_country)?.phone_code
      ? countries.find(country => country.country_code === auth.user.incorporation_country)?.phone_code
      : ''
  } else if (localPhoneCode && countries?.length > 0) {
    defaultPhoneCode = localPhoneCode
  } else if (countries?.length > 0) {
    defaultPhoneCode = '+82'
  } else {
    defaultPhoneCode = ''
  }

  const defPhCode = defaultPhoneCode

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(businessDetailSchema),
    defaultValues: {
      phone: businessDetails.phone,
      phoneCode: defPhCode,
      legalBusinessName: businessDetails.legalBusinessName,
      businessNameNative: businessDetails.businessNameNative,
      businessType: businessDetails.businessType,
      registrationNumber: businessDetails.registrationNumber,
      doi: businessDetails.doi,
      businessWebsite: businessDetails.businessWebsite
    }
  })

  const checkPhoneCode = watch('phoneCode')

  console.log('hikujhiuh', checkPhoneCode)

  const onSubmit = data => {
    // console.log('date check', monthYear.getDate())
    // data.dob = monthYear.date
    // data.dob = data.dob.toLocaleDateString('sv-SE')
    console.log('Data', data)

    dispatch(updateBusinessDetails(data))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {businessTypeError && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {businessTypeError}
            </Alert>
          )}
          <Grid container spacing={4}>
            <GMETitle title='Business Details' subTitle='Tell us about your business' />
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
                                content: `"${t('Code')}"`,
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
                      required: { value: true }
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
                        {...(errors.phone && { helperText: t(errors.phone.message) })}
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
                      helperText: <Translations text={errors.legalBusinessName.message} />
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
                      helperText: <Translations text={errors.businessNameNative.message} />
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
                            {t(type.description)}
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
                      helperText: <Translations text={errors.registrationNumber.message} />
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
                  <DatePicker
                    dateFormat='yyyy-MM-dd'
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown={true}
                    selected={value}
                    id='month-year-dropdown'
                    placeholderText={t('Date of Incorporation')}
                    maxDate={new Date()}
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
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='businessWebsite'
                control={control}
                //  rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Business Website') + '(' + t('Optional') + ')'}
                    error={Boolean(errors.businessWebsite)}
                    aria-describedby='validation-business-website'
                    {...(errors.businessWebsite && {
                      helperText: <Translations text={errors.businessWebsite.message} />
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>

          {loading && (
            <Grid
              item
              xs
              sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', mt: 10 }}
            >
              <FallbackSpinner />
            </Grid>
          )}

          <Button disabled={loading} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
            <Translations text='Continue' />
          </Button>
        </form>
      </DatePickerWrapper>
    </Fragment>
  )
}

export default StepBusinessDetails
