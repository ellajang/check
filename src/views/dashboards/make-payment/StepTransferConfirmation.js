// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

import { getAllPaymentReasons, getAllBanks } from 'src/store/apps/category'
import {
  getServiceFee,
  getFxQuote,
  confirmTransaction,
  updateTansactionId,
  resetToast,
  resetFile
} from 'src/store/apps/payment'
import GMETitle from './GMETitle'
import FallbackSpinner from 'src/@core/components/spinner'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

import formatMoney from 'src/utils/formatMoney'
import DeleteConfirm from 'src/layouts/components/custom-dialog/confirm-delete'

export const StepTransferConfirmation = ({ handleBack, handleNext }) => {
  const dispatch = useDispatch()
  const auth = useAuth()
  const { t } = useTranslation()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const {
    createTransaction,
    recipientDetails,
    applicantDetails,
    serviceFee,
    //finalServiceCharge,
    fxQuote,
    confirmTransactionResponse,
    fxInfo
  } = useSelector(state => state.payment)
  const { paymentReasons, banks, countries, loading } = useSelector(state => state.category)

  const reasonOfPayment = paymentReasons?.find(option => {
    return createTransaction?.paymentReason === option.category_code
  })

  const bank = banks?.find(option => {
    return recipientDetails?.bank === option.bank_code
  })

  const count = countries?.find(country => applicantDetails?.country === country.country_code)

  useEffect(() => {
    dispatch(
      getFxQuote({
        function: 'GET_FX_QUOTE',
        data: {
          fx_info: {
            collection_ccy: createTransaction?.collectionCurrency,
            collection_country: createTransaction?.collectionCountry,
            payout_ccy: createTransaction?.payoutCurrency,
            payout_country: createTransaction?.payoutCountry,
            source_type: 'MERCHANT',
            source_id: auth?.user?.source_id,
            amount: Number(createTransaction?.collectionAmount),
            collection_to_payout: true
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // console.log('final servcie charge', finalServiceCharge)
    if (confirmTransactionResponse?.status === 'SUCCESS') {
      dispatch(updateTansactionId(confirmTransactionResponse?.transaction_request_details?.id))
      toast.success(confirmTransactionResponse?.message)
      dispatch(resetToast())
      handleNext()
    } else if (confirmTransactionResponse?.status === 'FAILURE') {
      toast.error('Something is not Right !')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTransactionResponse])

  const handleFileDelete = () => {
    handleDeleteModalClose()
    dispatch(resetFile())
  }

  const onConfirmationClick = () => {
    console.log('pressed')

    dispatch(
      confirmTransaction({
        function: 'CREATE_TRANSACTION_REQUEST',
        scope: 'SINGLE',
        data: {
          transaction_requests: [
            {
              //  merchant_id: fxQuote?.source_id,
              invoice_number: createTransaction?.invoiceNumber,
              source_id: auth?.user?.source_id ?? '',
              //  invoice_path: createTransaction?.invoiceFileName,
              documents: createTransaction?.invoiceFile
                ? [
                    {
                      doc_type: 'INVOICE',
                      association_type: 'TRANSACTION_REQUEST',
                      doc_name: createTransaction.invoiceFileName,
                      file: createTransaction.invoiceFile
                    }
                  ]
                : undefined,
              base_rate: createTransaction?.rate,
              exchange_quote_id: fxQuote?.quote_id,
              // sender_bank_code: bank.bank_code,
              // sender_bank_branch: recipientDetails?.bankBranch,
              // sender_account_name: recipientDetails?.accountName,
              sender_name: applicantDetails?.businessName,
              sender_applicants_name: applicantDetails?.fullName,
              sender_phone_number: applicantDetails?.phoneNumber,
              sender_date_of_incorporation: applicantDetails?.doi,
              sender_country: applicantDetails?.country,
              sender_address: applicantDetails?.address,
              receiver_type: recipientDetails?.accountType,
              receiver_phone_code: recipientDetails?.phoneCode,
              receiver_phone_no: recipientDetails?.phoneNumber,
              receiver_name: recipientDetails?.name,
              receiver_email: recipientDetails?.email,
              receiver_business_reg_number: recipientDetails?.regNumber,
              receiver_legal_person_name: recipientDetails?.legalPersonName,
              receiver_bank_code: recipientDetails?.bank,
              receiver_bank_branch: recipientDetails?.bankBranch,
              receiver_account_name: recipientDetails?.accountName,
              receiver_account_number: recipientDetails?.accountNumber,
              receiver_bank_routing_number: recipientDetails?.routingNumber,
              receiver_bank_swift_bic: recipientDetails?.swiftBIC,
              txn_reason: createTransaction.paymentReason,
              quote_key: fxQuote?.quote_key,
              collection_country: createTransaction?.collectionCountry,
              payout_country: createTransaction?.payoutCountry,
              fx_info: { ...fxQuote }
            }
          ]
        }
      })
    )
  }

  if (loading) {
    return <FallbackSpinner />
  }
  const handleDeleteModalClickOpen = () => setOpenDeleteModal(true)
  const handleDeleteModalClose = () => setOpenDeleteModal(false)

  return (
    <Fragment>
      <DeleteConfirm
        handleDeleteModalClose={handleDeleteModalClose}
        handleDeleteConfirm={handleFileDelete}
        open={openDeleteModal}
      />
      <Grid container spacing={4}>
        <GMETitle title={t('Confirmation')} subTitle={t('Review and confirm your payment details')} />
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>
            <Translations text='Payment Details' />{' '}
          </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='You send exactly' />
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>
                {createTransaction.collectionCurrency} {formatMoney(createTransaction.collectionAmount)}
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
              <Typography sx={{ color: 'text.secondary' }}>
                {' '}
                <Translations text='Recipient receives' />
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>
                {createTransaction.payoutCurrency} {formatMoney(createTransaction.payoutAmount)}
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Invoice Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{createTransaction?.invoiceNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Reason' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                <Translations text={reasonOfPayment?.description} />
              </Typography>
            </Box>
            {/* <Box
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Payment Method' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                <Translations text='Bank Transfer' />
              </Typography>
            </Box> */}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>
            <Translations text='Recipient Details' />{' '}
          </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Name' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails.name}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Phone Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails.phoneNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Email' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails.email}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Registration Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.regNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text="Business Representative's Name" />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.legalPersonName}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Bank Name' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                <Translations text={bank?.bank_name} />
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Branch' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                <Translations text='Branch' />
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Account Holder Name' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.accountName}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Account Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.accountNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Routing Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.routingNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Swift BIC' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{recipientDetails?.swiftBIC}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>
            <Translations text="Sender's Details" />
          </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text={`Sender's Name`} />
              </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text={`Applicant's Name`} />
              </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Phone Number' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{applicantDetails.phoneNumber}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Date of Birth' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                {applicantDetails?.doi ? format(applicantDetails.doi, 'yyyy-MM-dd') : ''}
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Country' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{count?.country}</Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Address' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>{applicantDetails.address}</Typography>
            </Box>
          </Box>
        </Grid>

        {createTransaction?.invoiceFileName !== '' && (
          <Fragment>
            <Grid item xs={12} sm={12}>
              <Typography variant='h5'>
                <Translations text='Invoice Details' />{' '}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  mb: 4,
                  rowGap: 1,
                  columnGap: 4,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'secondary.main'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <Icon display='inline' icon='icomoon-free:file-pdf' />
                  <Typography sx={{ ml: '8px', color: 'secondary.main' }} display='inline'>
                    {createTransaction?.invoiceFileName}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => {
                      handleDeleteModalClickOpen()
                    }}
                    sx={{
                      '&:hover': {
                        background: '#fff'
                      }
                    }}
                  >
                    <Icon color='#1890FF' display='inline' icon='ant-design:delete-outlined' />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Fragment>
        )}

        <Grid item xs={12} sm={12}>
          <Typography variant='h5'>
            <Translations text='Price Details' />{' '}
          </Typography>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Invoice Total' />
              </Typography>
              <Typography sx={{ color: 'text.primary' }}>
                {createTransaction?.collectionCurrency}{' '}
                {fxQuote?.service_fee && fxQuote?.collection_amount
                  ? formatMoney(Number(fxQuote.collection_amount) - Number(fxQuote.service_fee))
                  : 0}
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Service Charge' />
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ color: 'text.primary' }}>
                  {createTransaction?.collectionCurrency} {fxQuote?.service_fee ? formatMoney(fxQuote.service_fee) : 0}
                </Typography>
              </Box>
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
              <Typography sx={{ color: 'text.secondary' }}>
                <Translations text='Total' />
              </Typography>
              <Typography variant='h5' sx={{ color: 'primary.main' }}>
                {createTransaction?.collectionCurrency}{' '}
                {fxQuote?.collection_amount ? formatMoney(fxQuote.collection_amount) : 0}
              </Typography>
            </Box>
          </Box>
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
            <Button onClick={onConfirmationClick} variant='contained'>
              <Translations text='Submit' />
              <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  )
}
