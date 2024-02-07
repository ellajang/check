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
import { getAllBanks } from 'src/store/apps/category'
import { getMerchantBanks, createBankDetails, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { useAuth } from 'src/hooks/useAuth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const bankInfoSchema = yup.object().shape({
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
    .max(11, 'Please enter a maximum of 11 characters.'),
    // .min(8, 'Please enter a minimum of 8 characters.'),
  ifscCode: yup
    .string()
    .matches(/[a-z0-9A-Z]+/g, 'Please Enter alpha numeric value only.')
    .max(15, 'Please enter a maximum of 15 characters.'),
  cardNumber: yup
    .string()
    .matches(/[a-z0-9A-Z]+/g, 'Please Enter alpha numeric value only.')
    .max(15, 'Please enter a maximum of 15 characters.')
})

const DetailsEditView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { t } = useTranslation()

  const {
    merchantBanks,
    error,
    loading,
    message,
    responseStatus,
    messageCode
  } = useSelector(state => state.onboarding)
  const { banks, banksError } = useSelector(state => state.category)

  const merchantId = auth?.user?.source_id

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
    getValues
  } = useForm({
    resolver: yupResolver(bankInfoSchema),
    defaultValues: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      swiftBic: '',
      ifscCode: '',
      cardNumber: ''
    }
  })

  useEffect(() => {
    if (!(merchantBanks?.length > 0)) {
      dispatch(
        getMerchantBanks({
          function: 'SEARCH',
          scope: 'ALL',
          data: {
            query_params: {
              by: 'MERCHANT_ID',
              value: merchantId
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
        Router.push('/onboarding/documents/bank-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !='NO_RESULT_FOUND') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  useEffect(() => {
    if (!(banks?.length > 0)) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  useEffect(() => {
    if (banks && merchantBanks) {
      reset({
        bankName: merchantBanks[0]?.bic_code,
        accountName: merchantBanks[0]?.account_name,
        accountNumber: merchantBanks[0]?.account_number,
        swiftBic: merchantBanks[0]?.swift_code,
        ifscCode: merchantBanks[0]?.ifsc_code,
        cardNumber: merchantBanks[0]?.iban_cbu_card_number
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantBanks, reset])

  const onSubmit = data => {
    merchantBanks?.length > 0 ? dispatch(
      createBankDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchants_bank_detail: {
            ...merchantBanks[0],
            bank_id: banks.find(item=>item.bank_code === data.bankName)?.id,
            bic_code: data?.bankName,
            account_name: data.accountName,
            account_number: data.accountNumber,
            swift_code: data.swiftBic,
            ifsc_code: data.ifscCode,
            iban_cbu_card_number: data.cardNumber
          }
        }
      })
    ) : dispatch(createBankDetails({
      function: 'ADD_DATA',
      scope: 'SINGLE',
      data: {
        merchants_bank_detail: {
          merchant_id: merchantId,
          bank_id: banks.find(item=>item.bank_code === data.bankName)?.id,
          account_name: data.accountName,
          account_number: data.accountNumber,
          swift_code: data.swiftBic,
          ifsc_code: data.ifscCode,
          iban_cbu_card_number: data.cardNumber,
          bic_code: data.bankName
        }
      }
    }))
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
              Router.push('/onboarding/documents/bank-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back'/>
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Bank Info' />
          </Typography>
        </Box>

        <Box>
          <DatePickerWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
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
                            setValue('bankName', e.target.value)
                            setValue('swiftBic', banks?.find(bank => bank.bank_code === e.target.value)?.swift_code)
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
                        {...(errors.accountNumber && {
                          helperText: <Translations text={errors.accountNumber.message} />
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
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                  <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                    <Translations text='Update'/>
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
