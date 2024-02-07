// ** React Imports

import { Fragment, forwardRef, useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useAuth } from 'src/hooks/useAuth'
// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Redux Toolkit
import { updateApplicantDetails, resetConfirmScreen } from 'src/store/apps/payment'
import { getAllCountries } from 'src/store/apps/category'
import { getMerchants } from 'src/store/apps/onboarding'

import GMETitle from './GMETitle'
import { Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { format } from 'date-fns'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const applicantSchema = yup.object().shape({
  businessName: yup.string().required('This field is mandatory'),
  fullName: yup.string().required('This field is mandatory'),
  phoneNumber: yup
    .string()
    .required('This field is mandatory')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Please enter valid phone number.'
    )
    .max(11, 'Please enter a maximum of 11 characters.')
    .min(10, 'Please enter a minimum of 10 characters.'),
  country: yup.string().required('This field is mandatory'),
  address: yup.string().required('This field is mandatory').max(150, 'Please enter a maximum of 150 characters.')
})

export const StepApplicantDetails = ({ handleBack, handleNext }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const auth = useAuth()
  const { applicantDetails } = useSelector(state => state.payment)
  const { countries } = useSelector(state => state.category)
  const { merchants } = useSelector(state => state.onboarding)

  console.log('merchants check', merchants)
  useEffect(() => {
    dispatch(resetConfirmScreen())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // ** Hooks
  const {
    control: control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: yupResolver(applicantSchema),
    defaultValues: {
      businessName: applicantDetails?.businessName
        ? applicantDetails.businessName
        : merchants[0]?.business_name
        ? merchants[0].business_name
        : '',
      fullName: applicantDetails?.fullName ? applicantDetails.fullName : auth?.user ? auth?.user?.full_name : '',
      phoneNumber: applicantDetails?.phoneNumber
        ? applicantDetails.phoneNumber
        : merchants[0]?.phone_number
        ? merchants[0].phone_number
        : '',
      doi: applicantDetails?.doi
        ? applicantDetails.doi
        : merchants[0]?.incorporation_date
        ? new Date(merchants[0].incorporation_date)
        : null,
      country: applicantDetails?.country
        ? applicantDetails.country
        : merchants[0]?.incorporation_country
        ? merchants[0].incorporation_country
        : 'KR',
      address: applicantDetails?.address
        ? applicantDetails.address
        : merchants[0]?.address1
        ? merchants[0].address1
        : ''
    }
  })

  //console.log('cont check', countries)

  const onSubmit = data => {
    dispatch(updateApplicantDetails({ ...data }))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <GMETitle title={t("Sender's Details")} subTitle={t('Enter the details of sender')} />
            <Grid item xs={12} sm={12}>
              <Controller
                name='businessName'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    disabled={merchants[0]?.business_name ? true : false}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.businessName)}
                    placeholder={t(`Sender's Name`)}
                    {...(errors.businessName && { helperText: t(errors.businessName.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='fullName'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    disabled={auth?.user?.full_name ? true : false}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.fullName)}
                    placeholder={t(`Applicant's Name`)}
                    {...(errors.fullName && { helperText: t(errors.fullName.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='phoneNumber'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    disabled={merchants[0]?.phone_number ? true : false}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.phoneNumber)}
                    placeholder={t('Phone Number')}
                    type='number'
                    aria-describedby='stepper-linear-phone-phone'
                    {...(errors.phoneNumber && { helperText: t(errors.phoneNumber.message) })}
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
                    selected={value}
                    showYearDropdown
                    scrollableYearDropdown={true}
                    showMonthDropdown
                    disabled={merchants[0]?.incorporation_date ? true : false}
                    showTimeInput={false}
                    onChange={e => onChange(e)}
                    placeholderText={t('Date of Inc')}
                    maxDate={new Date()}
                    customInput={
                      <CustomInput
                        disabled={merchants[0]?.incorporation_date ? true : false}
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.doi)}
                        aria-describedby='validation-basic-doi'
                        {...(errors.doi && { helperText: t('This field is mandatory') })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            {/* {countries?.length > 0 && ( */}
            <Grid item xs={12} sm={12}>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    // disabled
                    disabled={merchants[0]?.incorporation_country ? true : false}
                    fullWidth
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e)
                    }}
                    id='validation-nationality-select'
                    error={Boolean(errors.country)}
                    {...(errors.country && { helperText: t(errors.country.message) })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Country'
                        ? {
                            content: `"${'Country'}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {countries.map((country, index) => {
                      return (
                        <MenuItem key={index} value={country.country_code}>
                          <Translations text={country.country} />
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
            {/* )} */}
            <Grid item xs={12} sm={12}>
              <Controller
                name='address'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    disabled={auth?.user?.address ? true : false}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.address)}
                    placeholder={t('Business Address')}
                    {...(errors.address && { helperText: t(errors.address.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}></Grid>
            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(1)} !important`, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
                  sx={{
                    '& svg': { mr: 2 },
                    ':hover': {
                      bgcolor: 'secondary.luma',
                      color: 'primary'
                    },
                    p: 0
                  }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
                  <Translations text='Back' />
                </Button>
                <Button type='submit' variant='contained'>
                  <Translations text='Next' />
                  <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DatePickerWrapper>
    </Fragment>
  )
}
