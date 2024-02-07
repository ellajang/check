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
import { createVirtualAccount, updateVirtualAccount, updateDepositMethod, resetToast } from 'src/store/apps/payment'
// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Demo Components Imports
import CustomRadioDeposit from 'src/layouts/components/custom-radio/deposit'

import GMETitle from './GMETitle'
import formatMoney from 'src/utils/formatMoney'
import FallbackSpinner from "../../../layouts/components/spinner";



const icons = [
  { icon: 'tabler:building-bank', iconProps: { fontSize: '2.25rem', style: { marginRight: 8 } } },
  { icon: 'tabler:wallet', iconProps: { fontSize: '2.25rem', style: { marginRight: 8 } } },
  { icon: 'tabler:cash-banknote', iconProps: { fontSize: '2.25rem', style: { marginRight: 8 } } }
]

export const StepLocalCollection = ({ handleBack, handleNext }) => {
  const dispatch = useDispatch()
  const auth = useAuth()
  const { t } = useTranslation()

  const data = [
    {
      title: t('Bank Deposit (Virtual Account)'),
      value: 'BANK_DEPOSIT',
      disabled: false
    },
    {
      title: t('Wallet'),
      value: 'WALLET',
      disabled: true
    },
    {
      title: t('Cash'),
      value: 'CASH',
      disabled: true
    }
  ]

  const { createTransaction, depositMethod, transactionId, virtualAccountResponse, loading: virtualAccountLoading } = useSelector(
    state => state.payment
  )

  const defaultValues = {
    depositMethod: depositMethod ? depositMethod : 'BANK_DEPOSIT'
  }

  useEffect(() => {
    // console.log('final servcie charge', finalServiceCharge)
    if (virtualAccountResponse?.status === 'SUCCESS') {
      dispatch(updateVirtualAccount(virtualAccountResponse?.transaction_request_details?.transaction_requests[0]))
      toast.success(virtualAccountResponse?.message)
      dispatch(resetToast())
      handleNext()
    } else if (virtualAccountResponse?.status === 'FAILURE') {
      toast.error(t('Something is not Right !'))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualAccountResponse])

  const onSubmit = data => {
    dispatch(updateDepositMethod(data.depositMethod))
    dispatch(
      createVirtualAccount({
        function: 'GET_VIRTUAL_ACCOUNT',
        scope: 'SINGLE',
        data: {
          virtual_account: {
            source_id: auth?.user?.source_id,
            source_type: 'MERCHANT',
            txn_req_id: transactionId
          }
        }
      })
    )
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  if(virtualAccountLoading){
    return <FallbackSpinner />
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <GMETitle title={t('Please choose the fund deposit method')} />
          <Grid item xs={12} sm={12}>
            <Typography variant='h5'>{t('Total Amount')} </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='h2' sx={{ color: 'primary.main' }}>
              {createTransaction?.collectionCurrency} {formatMoney(createTransaction?.collectionAmount)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}></Grid>

          <Grid container direction='column' spacing={4} sx={{ mb: 16, mt: 8 }}>
            <Controller
              name='depositMethod'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                <Fragment>
                  {data.map((singleOption, index) => {

                    return (
                      <CustomRadioDeposit
                        key={index}
                        // data={data[index]}
                        data={singleOption}
                        selected={value}
                        icon={icons[index].icon}
                        iconProps={icons[index].iconProps}
                        handleChange={onChange}
                        gridProps={{ sm: 3, xs: 3 }}
                      />
                    )
                  })}
                </Fragment>
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
    </Fragment>
  )
}
