import { useEffect, React, Fragment, useState } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import Translations from 'src/layouts/components/Translations'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updateBankDetails } from 'src/store/apps/onboarding'
import { getAllBanks } from 'src/store/apps/category'
import { Alert, CircularProgress } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const bankDetailsSchema = yup.object().shape({
  bankName: yup.string().required('This field is mandatory'),
  accountNumber: yup
    .string()
    .required('This field is mandatory')
    .matches(/[a-z0-9A-Z]+/g, 'Please Enter alpha numeric value only.')
    .max(15, 'Please enter a maximum of 15 characters.'),
  accountName: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  swiftBic: yup
    .string()
    .required('This field is mandatory')
    .matches(/[a-z0-9A-Z]+/g, 'Please Enter alpha numeric value only.')
    .max(11, 'Please enter a maximum of 11 characters.')
    .min(8, 'Please enter a minimum of 8 characters.'),
  ifscCode: yup
    .string()
    .matches(/[a-z0-9A-Z]+/g, {
      message: 'Please Enter alpha numeric value only.',
      excludeEmptyString: true
    })
    .max(15, 'Please enter a maximum of 15 characters.'),
  cardNumber: yup
    .string()
    .matches(/[a-z0-9A-Z]+/g, {
      message: 'Please Enter alpha numeric value only.',
      excludeEmptyString: true
    })
    .max(15, 'Please enter a maximum of 15 characters.')
})

const StepBankDetails = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { bankDetails, businessDetails } = useSelector(state => state.onboarding)
  const { banks, banksError, loading } = useSelector(state => state.category)

  // ** Hooks
  useEffect(() => {
    dispatch(
      getAllBanks({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            by: 'COUNTRY',
            value: 'KR'
          }
        }
      })
    )
  }, [dispatch])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(bankDetailsSchema),
    defaultValues: {
      bankName: bankDetails.bankName,
      accountName: bankDetails?.accountName
        ? bankDetails.accountName
        : businessDetails?.legalBusinessName
        ? businessDetails.legalBusinessName
        : '',
      accountNumber: bankDetails.accountNumber,
      swiftBic: bankDetails.swiftBic,
      ifscCode: bankDetails.ifscCode,
      cardNumber: bankDetails.cardNumber
    }
  })

  // const bankWatch = watch('bankName')

  console.log('context state', auth)

  const onSubmit = data => {
    dispatch(updateBankDetails(data))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {banksError && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {banksError}
            </Alert>
          )}
          <Grid container spacing={4}>
            <GMETitle
              title='Bank Details'
              subTitle='Input your company bank details; this bank will be used for deposits and withdrawals. You can update the bank information later.'
            />
            <Grid item xs={12} sm={12}>
              <Controller
                name='bankName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    SelectProps={{
                      value: value,
                      onChange: e => {
                        onChange(e)
                        setValue('swiftBic', banks.find(bank => bank.bank_code === e.target.value).swift_code)
                      }
                    }}
                    id='validation-country-select'
                    error={Boolean(errors.bankName)}
                    aria-describedby='validation-country-select'
                    {...(errors.bankName && { helperText: <Translations text={errors.bankName.message} /> })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Bank Name'
                        ? {
                            content: `"${t('Bank Name')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {banks?.length > 0 ? (
                      banks.map((bank, index) => {
                        return (
                          <MenuItem key={index} value={bank.bank_code}>
                            <Translations text={bank.bank_name} />
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
            <Grid item xs={12} sm={12}>
              <Controller
                name='accountName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Account Name')}
                    error={Boolean(errors.accountName)}
                    aria-describedby='validation-account-name'
                    {...(errors.accountName && { helperText: <Translations text={errors.accountName.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='accountNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Account Number')}
                    error={Boolean(errors.accountNumber)}
                    aria-describedby='validation-account-number'
                    {...(errors.accountNumber && { helperText:
                        <Translations text={errors?.accountNumber?.message ?? 'This field is mandatory'} />
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='swiftBic'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Swift BIC')}
                    error={Boolean(errors.swiftBic)}
                    aria-describedby='validation-swift-bic'
                    {...(errors.swiftBic && { helperText: <Translations text={errors.swiftBic.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='ifscCode'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('IFSC Code') + '(' + t('Optional') + ')'}
                    error={Boolean(errors.ifscCode)}
                    aria-describedby='validation-ifsc-code'
                    {...(errors.ifscCode && { helperText: <Translations text={errors.ifscCode.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='cardNumber'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('IBAN/CBU/Card Number')}
                    error={Boolean(errors.cardNumber)}
                    aria-describedby='validation-card-number'
                    {...(errors.cardNumber && { helperText: <Translations text={errors.cardNumber.message} /> })}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <Button
                component='label'
                variant='contained'
                sx={{ bgcolor: '#fff', color: 'text.primary' }}
                type='submit'
              >
                Send Code
              </Button>
            </Grid> */}
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

export default StepBankDetails
