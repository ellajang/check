// ** React Imports
import { Fragment, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

import { getServiceFee, getFxQuote, confirmTransaction, resetToast, resetMakePaymentForm } from 'src/store/apps/payment'

import GMETitle from './GMETitle'
import format from 'date-fns/format'

import formatMoney from 'src/utils/formatMoney'

export const StepLocalCollectionConfirmation = ({ handleNext }) => {
  const dispatch = useDispatch()
  const auth = useAuth()
  const { t } = useTranslation()

  const {
    createTransaction,
    recipientDetails,
    applicantDetails,
    serviceFee,
    //finalServiceCharge,
    fxQuote,
    confirmTransactionResponse,
    fxInfo,
    VirtualAccountData
  } = useSelector(state => state.payment)

  const { banks, banksError, loading } = useSelector(state => state.category)

  const BankName = name => {
    return banks && banks?.length > 0 && name && banks?.find(bank => bank.bank_code === name)?.bank_name
      ? banks.find(bank => bank.bank_code === name).bank_name
      : ''
  }

  // useEffect(() => {
  //   // console.log('final servcie charge', finalServiceCharge)
  //   if (confirmTransactionResponse?.status === 'SUCCESS') {
  //     toast.success(confirmTransactionResponse?.message)
  //     dispatch(resetToast())
  //     handleNext()
  //   } else if (confirmTransactionResponse?.status === 'FAILURE') {
  //     toast.error('Something is not Right !')
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [confirmTransactionResponse])

  const onConfirmationClick = () => {
    console.log('pressed')
    dispatch(resetToast())
    dispatch(resetMakePaymentForm())
    handleNext()
    // dispatch(
    //   confirmTransaction({
    //     function: 'CREATE_TRANSACTION_REQUEST',
    //     scope: 'SINGLE',
    //     data: {
    //       transaction_requests: [
    //         {
    //           merchant_id: fxQuote?.source_id,
    //           invoice_number: createTransaction?.invoiceNumber,
    //           invoice_path: createTransaction?.invoiceFileName,
    //           base_rate: createTransaction?.rate,
    //           exchange_quote_id: fxQuote?.quote_id,
    //           sender_bank_code: '123',
    //           sender_bank_branch: 'smething',
    //           sender_account_name: 'Priyanka Shrestha',
    //           receiver_name: recipientDetails?.name,
    //           receiver_email: recipientDetails?.email,
    //           receiver_bank_code: recipientDetails?.bank,
    //           receiver_account_name: recipientDetails?.accountName,
    //           receiver_account_number: recipientDetails?.accountNumber,
    //           txn_reason: createTransaction.paymentReason,
    //           quote_key: fxQuote?.quote_key,
    //           fx_info: { ...fxQuote }
    //         }
    //       ]
    //     }
    //   })
    // )
  }

  return (
    <Fragment>
      <Grid container spacing={4}>
        <GMETitle title='Local Collection' subTitle='Deposit the amount to your Virtual Account within 2024-04-01' />
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>Deposit Amount </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h2' sx={{ color: 'primary.main' }}>
            {createTransaction.collectionCurrency} {formatMoney(createTransaction.collectionAmount)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>Transaction Details </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Transaction ID</Typography>
              <Typography sx={{ color: 'primary.main' }}>GME2023{VirtualAccountData?.id}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Application Date</Typography>
              <Typography sx={{ color: 'primary.main' }}>
                {VirtualAccountData?.created_date
                  ? format(new Date(VirtualAccountData.created_date), 'yyyy-MM-dd')
                  : ''}
              </Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Status</Typography>
              <Typography sx={{ color: 'text.orange' }}>{VirtualAccountData?.txn_status}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>Virtual Bank Account Details </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Bank Name</Typography>
              <Typography sx={{ color: 'text.primary' }}>{BankName(VirtualAccountData?.sender_bank_code)}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Account Name</Typography>
              <Typography sx={{ color: 'text.primary' }}>{VirtualAccountData?.sender_account_name}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Account Number</Typography>
              <Typography sx={{ color: 'text.primary' }}>{VirtualAccountData?.sender_account_number}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>Depositor Details </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Depositor Name</Typography>
              <Typography sx={{ color: 'text.primary' }}>{applicantDetails?.fullName}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Business Name</Typography>
              <Typography sx={{ color: 'text.primary' }}>{applicantDetails?.businessName}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Depositor Bank</Typography>
              <Typography sx={{ color: 'text.primary' }}>{BankName(VirtualAccountData?.sender_bank_code)}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Account Name</Typography>
              <Typography sx={{ color: 'text.primary' }}>{VirtualAccountData?.sender_account_name}</Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                rowGap: 1,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Account Number</Typography>
              <Typography sx={{ color: 'text.primary' }}>{VirtualAccountData?.sender_account_number}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}></Grid>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(1)} !important`, mb: 4 }}>
          <Button onClick={onConfirmationClick} fullWidth variant='contained' sx={{ mb: 4, mt: 16 }}>
            <Translations text='Finish' />
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  )
}
