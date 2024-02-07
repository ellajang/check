// ** React Imports
import { Fragment, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'

import { Autocomplete, Stack, TextField } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Icon Imports

// ** Custom Components Imports

import CustomTextField from 'src/@core/components/mui/text-field'
import { getAllCountries, getAllBanks, getBankBranch, getAllAccountTypes } from 'src/store/apps/category'
import { getMerchants } from 'src/store/apps/onboarding'
// ** Redux Toolkit
import { updateRecipientDetails } from 'src/store/apps/payment'
import { useAuth } from 'src/hooks/useAuth'
import GMETitle from './GMETitle'
import Spinner from 'src/layouts/components/spinner'

const recipientSchema = yup.object().shape({
  accountType: yup.string().required('This field is mandatory'),
  phoneNumber: yup.number().required('This field is mandatory'),
  name: yup.string().required('This field is mandatory'),
  email: yup.string().email('Must be a valid Email').required('Email is Required'),
  // regNumber: yup.string().required('This field is mandatory'),
  bank: yup.string().required('This field is mandatory'),
  bankBranch: yup.string().required('This field is mandatory'),
  accountName: yup.string().required('This field is mandatory'),
  accountNumber: yup.string().required('This field is mandatory'),
  routingNumber: yup.string(),
  swiftBIC: yup.string().required('This field is mandatory')
})

export const StepRecipientDetails = ({ handleBack, handleNext }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const auth = useAuth()

  const { countries, banks, banksError, branch, accountTypes, loading } = useSelector(
    state => state.category
  )
  const { createTransaction, recipientDetails } = useSelector(state => state.payment)

  useEffect(() => {
    if (accountTypes.length > 0) {
      setValue('accountType', accountTypes[0].category_code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountTypes])

  useEffect(() => {
    dispatch(
      getAllAccountTypes({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'ACCOUNT_TYPE'
          }
        }
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

    dispatch(
      getAllBanks({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            by: 'COUNTRY',
            value: createTransaction?.payoutCountry
          }
        }
      })
    )

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (branch?.length > 0) {
      setValue('bankBranch', branch[0]?.bank_code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch])

  useEffect(() => {
    if (countries?.length > 0 && createTransaction?.payoutCountry) {
      const result = countries.find(country => {
        return country.country_code === createTransaction.payoutCountry
      })

      setValue('phoneCode', result.phone_code)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, createTransaction])

  // useEffect(() => {
  //   if (createTransaction?.payoutCountry !== '') {
  //     const { payoutCountry } = createTransaction
  //     dispatch(
  //       getAllBanks({
  //         function: 'SEARCH',
  //         scope: 'BYKEYWORD',
  //         data: {
  //           query_params: {
  //             by: 'COUNTRY',
  //             value: payoutCountry
  //           }
  //         }
  //       })
  //     )
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [createTransaction])

  // ** Hooks
  const {
    watch,
    // mode: onChange,
    control: control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      ...recipientDetails
    },
    resolver: yupResolver(recipientSchema)
  })

  const bankWatcher = watch('bank', '')
  const accountTypeWatcher = watch('accountType', '')

  const onSubmit = data => {
    dispatch(updateRecipientDetails({ ...data }))
    handleNext()
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <GMETitle
            title={t('Recipient Details')}
            subTitle={t("Input the details of your recipient's business and bank account")}
          />

          {banksError && (
            <Alert severity='error' sx={{ mb: 4, ml: 4 }}>
              Error While Retrieving Banks
            </Alert>
          )}
          <Grid item xs={12} sm={12}>
            {accountTypes?.length > 0 && (
              <Controller
                name='accountType'
                control={control}
                // rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e)
                    }}
                    id='validation-type-of-product'
                    error={Boolean(errors.accountType)}
                    aria-describedby='validation-type-of-product'
                    {...(errors.accountType && { helperText: <Translations text='This field is mandatory' /> })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Select Business'
                        ? {
                            content: `"${t('Select Business')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {accountTypes.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.category_code}>
                          {t(type.description)}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            )}
          </Grid>
          <Grid item xs={4}>
            {countries && countries.length > 0 && (
              <Controller
                name='phoneCode'
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
                    error={Boolean(errors.phoneCode)}
                    aria-describedby='validation-country-select'
                    {...(errors.phoneCode && { helperText: <Translations text='This field is mandatory' /> })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Phone Code'
                        ? {
                            content: `"${t('Phone Code')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
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
              name='phoneNumber'
              control={control}
              // rules={{ required: true }}
              render={({ field: { value = '', onChange } }) => (
                <CustomTextField
                  fullWidth
                  //autoFocus
                  type='number'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.phoneNumber)}
                  placeholder={accountTypeWatcher === 'BUSINESS' ? t('Business Phone Number') : t('Phone Number')}
                  aria-describedby='stepper-linear-phone-phone'
                  {...(errors.phoneNumber && { helperText: t('This field is mandatory') })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='name'
              control={control}
              // rules={{
              //   required: true
              // }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  placeholder={accountTypeWatcher === 'BUSINESS' ? t('Business Name') : t('Name')}
                  {...(errors.name && { helperText: t('This field is mandatory') })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='email'
              control={control}
              // rules={{
              //   required: true
              // }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder={accountTypeWatcher === 'BUSINESS' ? t('Business Email') : t('Email')}
                  {...(errors.email && { helperText: t(errors.email.message) })}
                />
              )}
            />
          </Grid>
          {/*{accountTypeWatcher === 'BUSINESS' && (*/}
          {/*  <Grid item xs={12} sm={12}>*/}
          {/*    <Controller*/}
          {/*      name='regNumber'*/}
          {/*      control={control}*/}
          {/*      render={({ field: { value, onChange } }) => (*/}
          {/*        <CustomTextField*/}
          {/*          fullWidth*/}
          {/*          value={value}*/}
          {/*          onChange={onChange}*/}
          {/*          error={Boolean(errors.regNumber)}*/}
          {/*          placeholder={t('Registration Number')}*/}
          {/*          {...(errors.regNumber && { helperText: t(errors.regNumber.message) })}*/}
          {/*        />*/}
          {/*      )}*/}
          {/*    />*/}
          {/*  </Grid>*/}
          {/*)}*/}

          {accountTypeWatcher === 'BUSINESS' && (
            <Grid item xs={12} sm={12}>
              <Controller
                name='businessAddress'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.businessAddress)}
                    placeholder={t('Business Address')}
                    {...(errors.businessAddress && { helperText: t(errors.businessAddress.message) })}
                  />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <Controller
              name='bank'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomAutocomplete
                  multiple={false}
                  value={
                    value
                      ? banks.find(option => {
                          return value === option.bank_code
                        }) ?? null
                      : null
                  }
                  fullWidth
                  options={banks ? banks : []}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.bank_code : null)
                    setValue('swiftBIC', newValue ? newValue.swift_code : '')
                    dispatch(
                      getBankBranch({
                        function: 'LIST',
                        scope: 'BYKEYWORD',
                        data: {
                          query_params: {
                            value: newValue ? newValue.bank_code : null
                          }
                        }
                      })
                    )
                  }}
                  id='autocomplete-controlled'
                  getOptionLabel={option => option.bank_name || ''}
                  // renderOption={(props, option) => option.bank_name}
                  renderInput={params => (
                    <CustomTextField
                      error={Boolean(errors.bank)}
                      {...(errors.bank && { helperText: <Translations text='This field is mandatory' /> })}
                      placeholder='Banks'
                      {...params}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {bankWatcher && (
            <Grid item xs={12} sm={12}>
              {branch.length > 0 && (
                <Controller
                  name='bankBranch'
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
                      id='validation-type-of-product'
                      error={Boolean(errors.bankBranch)}
                      aria-describedby='validation-type-of-product'
                      {...(errors.bankBranch && { helperText: <Translations text='This field is mandatory' /> })}
                      sx={{
                        '& .MuiSelect-select .notranslate::after': 'Select Branch'
                          ? {
                              content: `"${t('Select Branch')}"`,
                              opacity: 0.42
                            }
                          : {}
                      }}
                    >
                      {branch.map((branchEach, index) => {
                        return (
                          <MenuItem key={index} value={branchEach.bank_code}>
                            {branchEach.bank_name === 'DEFAULT' ? 'DEFAULT BRANCH' : branchEach.bank_name}
                          </MenuItem>
                        )
                      })}
                    </CustomTextField>
                  )}
                />
              )}
            </Grid>
          )}

          {bankWatcher && (
            <Fragment>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='accountName'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.accountName)}
                      placeholder={t('Beneficiary Name')}
                      {...(errors.accountName && { helperText: t(errors.accountName.message) })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller
                  name='accountNumber'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.accountNumber)}
                      placeholder={t('Beneficiary Account Number')}
                      {...(errors.accountNumber && { helperText: t(errors.accountNumber.message) })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='routingNumber'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.routingNumber)}
                      placeholder={t('Routing Number (Optional)')}
                      {...(errors.routingNumber && { helperText: t(errors.routingNumber.message) })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='swiftBIC'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      disabled
                      //  label='SWIFT CODE'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.swiftBIC)}
                      placeholder='Swift BIC'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Typography variant='overline' color='text.grey'>
                              SWIFT
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                      {...(errors.swiftBIC && { helperText: t(errors.swiftBIC.message) })}
                    />
                  )}
                />
              </Grid>
            </Fragment>
          )}

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
    </Fragment>
  )
}
