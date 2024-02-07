import { useEffect, React, Fragment, useState } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useAuth } from 'src/hooks/useAuth'
// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'
import Translations from 'src/layouts/components/Translations'

import { createMerchantOnboarding, resetOnboardingStatus, updateAlmostThereMonthly } from 'src/store/apps/onboarding'
import { getAllMonthlyRevenueType } from 'src/store/apps/category'
import { Alert, CircularProgress, List, ListItem, Typography } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    backgroundColor: '#FAFAFA',
    border: '1px solid #D9D9D9',
    gap: '8px',
    padding: '16px',
    textTransform: 'none',
    justifyContent: 'flex-start',
    marginBottom: '16px',

    '&.Mui-selected': {
      borderLeft: '1px solid #D9D9D9 !important',
      backgroundColor: '#1890ff',
      color: '#FAFAFA'
    },
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #D9D9D9'
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #D9D9D9'
    }
  }
}))

const AlmostThereMonthly = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()

  const {
    personalDetails,
    natureOfBusiness,
    countryOfResidence,
    businessAddress,
    businessDetails,
    companyRepresentative,
    listOfDirectors,
    listOfStockholders,
    bankDetails,
    almostThereSelection,
    almostThereMonthly,
    responseStatus,
    message,
    messageCode,
    onboardLoading
  } = useSelector(state => state.onboarding)
  const { monthlyRevenueType, monthlyRevenueTypeError, loading } = useSelector(state => state.category)
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** Hooks
  useEffect(() => {
    dispatch(
      getAllMonthlyRevenueType({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'MONTHLY_REVENUE'
          }
        }
      })
    )
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      Router.push('/onboarding/documents')
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, responseStatus])

  // const {
  //   control,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: {
  //     makePayment: almostThereSelection.makePayment,
  //     getPaid: almostThereSelection.getPaid
  //   }
  // })

  const handleMonthlyRevenue = (event, value) => {
    setMonthlyRevenue(value)
  }

  const onSubmit = () => {
    // console.log('date check', monthYear.getDate())
    // data.dob = monthYear.date
    // data.dob = data.dob.toLocaleDateString('sv-SE')
    const data = {
      monthlyRevenue: monthlyRevenue
    }
    console.log('type', almostThereSelection)

    const makePaymentData = almostThereSelection.makePayment.map(value => {
      return { service_type: value }
    })

    const getPaidData = almostThereSelection.getPaid.map(value => {
      return { service_type: value }
    })
    dispatch(updateAlmostThereMonthly(data))
    console.log('test data', makePaymentData)
    console.log(auth)

    const companyRep = companyRepresentative.map(
      ({ nameEnglish, nameKorean, designation, nationality, address, phone, phoneCode, idCopy }) => ({
        full_name: nameEnglish,
        full_name_native: nameKorean,
        designation: designation,
        nationality: nationality,
        address1: address,
        phone_code: phoneCode,
        phone_number: phone,
        documents: idCopy
          ? [
              {
                doc_type: 'PERSONAL_ID',
                association_type: 'REPRESENTATIVE',
                doc_name: idCopy.name,
                file: idCopy.base64
              }
            ]
          : undefined
      })
    )

    const stockhold = listOfStockholders.map(({ name, nationality, dob, pos, idCopy }) => ({
      full_name: name,
      nationality: nationality,
      dob: dob,
      percentage_of_share: pos,
      documents: idCopy
        ? [
            {
              doc_type: 'PERSONAL_ID',
              association_type: 'STOCKHOLDER',
              doc_name: idCopy.name,
              file: idCopy.base64
            }
          ]
        : undefined
    }))

    const direct = listOfDirectors.map(({ name, nationality, dob }) => ({
      full_name: name,
      nationality: nationality,
      dob: dob
    }))

    console.log('rep', companyRep)

    const postData = {
      function: 'ADD_DATA',
      scope: 'MULTIPLE',
      data: {
        user: {
          first_name: personalDetails.firstName,
          middle_name: personalDetails.middleName,
          last_name: personalDetails.lastName,
          full_name_native: personalDetails.fullNameNative,
          dob: personalDetails.dob,
          country: countryOfResidence.country
        },
        merchant: {
          id: auth?.user?.source_id,
          email_id: auth?.user?.email_id,
          phone_code: businessDetails.phoneCode,
          phone_number: businessDetails.phone,
          incorporation_country: auth.user?.incorporation_country,
          business_name: businessDetails.legalBusinessName,
          business_name_native: businessDetails.businessNameNative,
          business_type: businessDetails.businessType,
          industry_type: natureOfBusiness.industryType,
          product_type: natureOfBusiness.productType,
          business_nature: natureOfBusiness.nob,
          incorporation_date: businessDetails.doi,
          bizz_reg_no: businessDetails.registrationNumber,
          business_profile: natureOfBusiness.describe,
          postal_code: businessAddress.postalCode,
          address1: businessAddress.addressLine1,
          address2: businessAddress.addressLine2,
          city: businessAddress.city,
          website: businessDetails.businessWebsite,
          approx_txn_monthly_volume: data.monthlyRevenue
        },
        merchants_bank_detail: {
          bic_code: bankDetails.bankName,
          account_name: bankDetails.accountName,
          account_number: bankDetails.accountNumber,
          swift_code: bankDetails.swiftBic,
          ifsc_code: bankDetails.ifscCode,
          iban_cbu_card_number: bankDetails.cardNumber
        },
        merchants_directors_details: direct,
        merchants_representatives_details: companyRep,
        merchants_stockholders_details: stockhold,
        make_payment_infos: makePaymentData,
        get_payment_infos: getPaidData
      }
    }
    console.log('rqudata', postData)
    dispatch(createMerchantOnboarding(postData))
    // handleNext()
  }

  return (
    <Fragment>
      <Grid container spacing={4}>
        {monthlyRevenueTypeError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {monthlyRevenueTypeError}
          </Alert>
        )}
        <GMETitle title="You're almost there!" subTitle='Tell us how much you plan to send using GMEBiz' />
        <Grid item xs={12}>
          <StyledToggleButtonGroup
            orientation='vertical'
            fullWidth
            value={monthlyRevenue}
            onChange={handleMonthlyRevenue}
            exclusive
          >
            {monthlyRevenueType?.length > 0
              ? monthlyRevenueType.map((types, index) => {
                  return (
                    <ToggleButton fullWidth key={index} value={types.category_code} color='primary'>
                      <Grid container>
                        <Grid item xs>
                          <Translations text={types.description} />
                        </Grid>
                        <Grid item xs sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {monthlyRevenue === types.category_code && <Icon icon='teenyicons:tick-circle-solid' />}
                        </Grid>
                      </Grid>
                    </ToggleButton>
                  )
                })
              : ''}
          </StyledToggleButtonGroup>
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
        onClick={onSubmit}
        variant='contained'
        sx={{ mb: 4, mt: 16 }}
      >
        <Translations text='Finish' />
      </Button>
    </Fragment>
  )
}

export default AlmostThereMonthly
