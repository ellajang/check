// ** React Imports

import {useState, useEffect, Fragment, forwardRef, useMemo} from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'
import Spinner from 'src/layouts/components/spinner'

import Translations from 'src/layouts/components/Translations'

// ** Redux Toolkit
import {resetFxInfoToast, updateCreateTransaction} from 'src/store/apps/payment'
import { getExchangeRate, getValidCurrencies, resetExchangeToast, resetFile } from 'src/store/apps/payment'
import { getAllPaymentReasons } from 'src/store/apps/category'

import { NumericFormat } from 'react-number-format'
import GMETitle from './GMETitle'
import FileDropZone from './FileDropZone'

import formatMoney from 'src/utils/formatMoney'
import InputAdornment from "@mui/material/InputAdornment";
import CardCommonDocuments from "../../onboard-documents/common/CardCommonDocuments";
import underScoreTextRemove from "../../../utils/underScoreTextRemove";
import Avatar from "@mui/material/Avatar";

export const StepCreateTransaction = ({ handleBack, handleNext }) => {
  const [files, setFiles] = useState([])
  const [minimal, setMinimal] = useState(false)
  const [autoFocus, setAutoFocus] = useState(true)
  const [prevPayCurr, setPrevPayCurr] = useState(true)
  const [timer, setTimer] = useState(null)
  const [payDirection, setPayDirection] = useState(true)
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const auth = useAuth()
  const { paymentReasons } = useSelector(state => state.category)
  const { createTransaction, validCurrencies, validCurrenciesError } = useSelector(state => state.payment)
  const { fxInfo, loading, exchangeError } = useSelector(state => state.payment)
  const {merchantProfile} = useSelector(state=>state.profile);

  // ** Hooks
  const {
    watch,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    reset
  } = useForm({
    defaultValues: {
      ...createTransaction,
    }
  })

  const watchCollectionCurrency = watch('collectionCurrencyObj', '')
    ? JSON.parse(watch('collectionCurrencyObj', ''))
    : ''

  useEffect(() => {
    if(createTransaction?.collectionCurrencyObj === "") {
      if (validCurrencies && Object.keys(validCurrencies).length > 0) {
        const colCont = Object.keys(validCurrencies)[0]
        const colCurr = Object.keys(validCurrencies[Object.keys(validCurrencies)[0]])[0]
        setValue('collectionCurrencyObj', JSON.stringify({ [colCont]: colCurr }))
      }
    }
  }, [validCurrencies, createTransaction?.collectionCurrencyObj])

  useEffect(() => {
      if(createTransaction?.payoutCurrencyObj === ""){
        if (validCurrencies && watchCollectionCurrency && Object.keys(validCurrencies).length > 0 && prevPayCurr) {
          const payCont = Object.keys(
            validCurrencies[Object.keys(watchCollectionCurrency)[0]][
              watchCollectionCurrency[Object.keys(watchCollectionCurrency)[0]]
              ]
          )[0]

          const payCurr =
            validCurrencies[Object.keys(watchCollectionCurrency)[0]][
              watchCollectionCurrency[Object.keys(watchCollectionCurrency)[0]]
              ][payCont][0]

          setValue('payoutCurrencyObj', JSON.stringify({ [payCont]: payCurr }))
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchCollectionCurrency, createTransaction]
  )


  useEffect(()=>{

  },[fxInfo])

  useEffect(() => {
    if (exchangeError) {
      toast.error(exchangeError)
      dispatch(resetExchangeToast())
    } else if (fxInfo?.fx_info_status === 'NO_MINIMAL_AMOUNT') {
      setMinimal(true)
      setValue('payoutAmount', 0)
    } else if (fxInfo?.fx_info_status === 'NOT_SET') {
      setValue('payoutAmount', 0)
    } else if(fxInfo?.fx_info_status === 'MERCHANT_CURRENCY_NOT_SET'){
      toast.error(underScoreTextRemove(fxInfo?.fx_info_status))
      dispatch(resetFxInfoToast())
    } else if(fxInfo?.fx_info_status === 'PARTNER_RATE_NOT_SET'){
      toast.error(underScoreTextRemove(fxInfo?.fx_info_status))
      dispatch(resetFxInfoToast())
    } else if(fxInfo?.fx_info_status === 'MULTIPLE_PRIMARY_PARTNERS'){
      toast.error(underScoreTextRemove(fxInfo?.fx_info_status))
      dispatch(resetFxInfoToast())
    }
    else {
      setMinimal(false)
      setValue('payoutAmount', fxInfo?.payout_amount)

      setValue('collectionAmount', fxInfo?.collection_amount)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fxInfo, exchangeError])

  useEffect(() => {
    dispatch(
      getValidCurrencies({
        function: 'GET_VALID_CURRENCIES',
        data: {
          fx_info: {
            source_type: 'MERCHANT',
            source_id: auth?.user.source_id
          }
        }
      })
    )

    dispatch(
      getAllPaymentReasons({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'PAYMENT_REASONS'
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const onRefreshFeeClick = () => {
    const collectionCcyStr = JSON?.parse(getValues('collectionCurrencyObj'))
    const collectionCty = Object.keys(collectionCcyStr)[0]
    const collectionCcy = collectionCcyStr[collectionCty]

    const payoutCcyStr = JSON.parse(getValues('payoutCurrencyObj'))
    const payoutCty = Object.keys(payoutCcyStr)[0]
    const payoutCcy = payoutCcyStr[payoutCty]

    dispatch(
      getExchangeRate({
        function: 'GET_FXINFO',
        data: {
          fx_info: {
            collection_ccy: collectionCcy,
            collection_country: collectionCty,
            payout_ccy: payoutCcy,
            payout_country: payoutCty,
            source_type: 'MERCHANT',
            source_id: auth?.user.source_id,
            amount: payDirection ? Number(getValues('collectionAmount')) : Number(getValues('payoutAmount')),
            collection_to_payout: payDirection
          }
        }
      })
    )
  }

  const handleFileDelete = () => {
    setFiles([])
    dispatch(resetFile())
  }

  const onSubmit = data => {
    const collectionCcyStr = JSON.parse(getValues('collectionCurrencyObj'))
    const collectionCty = Object.keys(collectionCcyStr)[0]
    const collectionCcy = collectionCcyStr[collectionCty]

    const payoutCcyStr = JSON.parse(getValues('payoutCurrencyObj'))
    const payoutCty = Object.keys(payoutCcyStr)[0]
    const payoutCcy = payoutCcyStr[payoutCty]

    dispatch(
      updateCreateTransaction({
        ...data,
        serviceFee: fxInfo?.service_fee,
        rate: fxInfo?.rate,
        invoiceFile: files[0]?.base64 ?? '',
        invoiceFileName: files[0]?.name ?? '',
        collectionCountry: collectionCty,
        payoutCountry: payoutCty,
        collectionCurrency: collectionCcy,
        payoutCurrency: payoutCcy
      })
    )
    handleNext()
  }

  if (!validCurrencies) {
    return (
      <>
        <GMETitle title={t('Create Payment')} />

        <Alert severity='warning'>
          <AlertTitle>
            <Translations text={'Currency Not Set'} />{' '}
          </AlertTitle>
          <Translations
            text={
              'Dear merchant, the required configuration to perform the payment is not yet completed for you. Please contact the GMEBiz team for details.'
            }
          />
          <Button
            variant='outlined'
            sx={{ mt: 2 }}
            onClick={() => router.push('/')}
            startIcon={<Icon icon='tabler:arrow-back-up' />}
            size='small'
          >
            Back To Home
          </Button>
        </Alert>
      </>
    )
  }


   if (merchantProfile && merchantProfile !== null && Object?.keys(merchantProfile).length !== 0  && merchantProfile?.status !== 'APPROVED'){
    return (
      <>
        <GMETitle title={t('Create Payment')} />

        <Alert severity='warning'>
          <AlertTitle>{t('KYC is not approved yet')}</AlertTitle>
          {t(
            'Dear merchant, the required configuration to perform the payment is not yet completed for you. Please contact the GMEBiz team for details.'
          )}
          <Button
            variant='outlined'
            sx={{ mt: 2 }}
            onClick={() => router.push('/dashboard')}
            startIcon={<Icon icon='tabler:arrow-back-up' />}
            size='small'
          >
            {t('Back To Dashboard')}
          </Button>
        </Alert>
      </>
    )
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <GMETitle title={t('Create Payment')} />

          {fxInfo?.fx_info_status === 'NOT_SET' && (
            <Alert severity='error' sx={{ mb: 4, ml: 4 }}>
              <Translations text='The currencies and other rates are not set. Please contact the GMEBiz team.' />
            </Alert>
          )}

          <Grid item xs={12} sm={12}>
            <Card
              sx={{
                '& .MuiCardContent-root:last-child': {
                  paddingBottom: 0
                }
              }}
            >
              <CardContent
                sx={{
                  padding: 0
                }}
              >
                <Grid
                  container
                  sx={{ gap: 1, display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Grid item xs={10}>
                    <Controller
                      name='collectionAmount'
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <TextField
                            sx={{ paddingLeft: 3, py: 1 }}
                            fullWidth
                            autoFocus={autoFocus}
                            id='standard-basic'
                            // label='Standard'
                            variant='standard'
                            value={value}
                            onChange={e => {
                              const sentValue = e.target.value
                              setAutoFocus(true)
                              setPayDirection(true)
                              clearTimeout(timer)

                              const collectionCcyStr = JSON.parse(getValues('collectionCurrencyObj'))
                              const collectionCty = Object.keys(collectionCcyStr)[0]
                              const collectionCcy = collectionCcyStr[collectionCty]

                              const payoutCcyStr = JSON.parse(getValues('payoutCurrencyObj'))
                              const payoutCty = Object.keys(payoutCcyStr)[0]
                              const payoutCcy = payoutCcyStr[payoutCty]

                              const newTimer = setTimeout(() => {
                                if (sentValue !== '') {
                                  dispatch(
                                    getExchangeRate({
                                      function: 'GET_FXINFO',
                                      data: {
                                        fx_info: {
                                          collection_ccy: collectionCcy,
                                          collection_country: collectionCty,
                                          payout_ccy: payoutCcy,
                                          payout_country: payoutCty,
                                          source_type: 'MERCHANT',
                                          source_id: auth?.user.source_id,
                                          amount: Number(sentValue),
                                          collection_to_payout: payDirection
                                        }
                                      }
                                    })
                                  )
                                } else if (sentValue === '') {
                                  setValue('payoutAmount', '')
                                }
                              }, 1000)

                              setTimer(newTimer)
                              onChange(e)
                            }}
                            placeholder={t('You send')}
                            InputProps={{
                              endAdornment:
                                watch('collectionAmount') === null ? (
                                  <></>
                                ) : (
                                  <InputAdornment position='end'>
                                    <IconButton onClick={() => setValue('collectionAmount', null)}>
                                      <Icon icon='tabler:x' />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              inputComponent: ({ inputRef, onChange, ...other }) => (
                                <NumericFormat
                                  {...other}
                                  getInputRef={inputRef}
                                  onValueChange={values => {
                                    onChange({
                                      target: {
                                        id: 'standard-basic',
                                        value: values.value
                                      }
                                    })
                                  }}
                                  thousandSeparator=','
                                />
                              ),
                              // input: NumberFormatCustom,
                              disableUnderline: true
                            }}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs>
                    {/* {validCurrencies && validCurrencies.length > 0 && ( */}
                    <Controller
                      name='collectionCurrencyObj'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <TextField
                            sx={{
                              border: 0
                            }}
                            variant='standard'
                            select
                            SelectProps={{
                              value: value,
                              onChange: e => {
                                setPrevPayCurr(true)
                                onChange(e)
                                onRefreshFeeClick()
                              }
                            }}
                            InputProps={{
                              disableUnderline: true
                            }}
                            id='validation-country-select'
                            // error={Boolean(error.select)}
                            aria-describedby='validation-country-select'
                            // {...(error.select && { helperText: "This field is required" })}
                          >
                            {validCurrencies && Object.keys(validCurrencies).length > 0 ? (
                              Object.keys(validCurrencies).map((country, index) => {
                                return Object.keys(validCurrencies[country]).map((currency, index) => {
                                  return (
                                    <MenuItem key={index} value={JSON.stringify({ [country]: currency })}>
                                      <Grid
                                        sx={{
                                          gap: 2,
                                          display: 'flex',
                                          flexWrap: 'nowrap',
                                          justifyContent: 'center',
                                          alignContent: 'center',
                                          padding: 0
                                        }}
                                      >
                                        <img
                                          width={20}
                                          height={20}
                                          src={`/images/currencies/${country}.png`}
                                          alt={'flag of' + country}
                                        />

                                        <Box> {currency}</Box>
                                      </Grid>
                                    </MenuItem>
                                  )
                                })
                              })
                            ) : (
                              <MenuItem />
                            )}
                          </TextField>
                        )
                      }}
                    />
                    {/* )} */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Box sx={{display:'flex', gap: 1, mt:1, alignItems: 'center'}}>
              <Typography fontSize={12} fontWeight={500}>ⓘ</Typography>
              <Typography fontSize={12} variant='caption' > {t('Service charge is inclusive')} </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography display='inline'>
              <Translations text='Service Fee:' />
            </Typography>
            <Typography sx={{ fontWeight: '500', ml: 2 }} display='inline'>
              {fxInfo ? fxInfo.collection_ccy : ''} {fxInfo ? formatMoney(fxInfo.service_fee) : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography display='inline'>
              <Translations text='Today’s exchange rate:' />
            </Typography>
            <Typography sx={{ ml: '2px', fontWeight: '500' }} display='inline'>
              {fxInfo ? formatMoney(fxInfo.rate) : ''}
            </Typography>
            <IconButton aria-label='refresh fee' onClick={onRefreshFeeClick}>
              <Icon icon='tabler:refresh' fontSize={20} />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Card
              sx={{
                '& .MuiCardContent-root:last-child': {
                  paddingBottom: 0
                }
              }}
            >
              <CardContent
                sx={{
                  padding: 0
                }}
              >
                <Grid
                  container
                  sx={{ gap: 1, display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Grid item xs={10}>
                    <Controller
                      name='payoutAmount'
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          sx={{ paddingLeft: 3, py: 1 }}
                          autoFocus={!autoFocus}
                          fullWidth
                          value={value}
                          // value={fxInfo?.payout_amount}
                          onChange={e => {
                            const sentValue = e.target.value
                            setAutoFocus(false)
                            setPayDirection(false)
                            clearTimeout(timer)

                            const collectionCcyStr = JSON.parse(getValues('collectionCurrencyObj'))
                            const collectionCty = Object.keys(collectionCcyStr)[0]
                            const collectionCcy = collectionCcyStr[collectionCty]

                            const payoutCcyStr = JSON.parse(getValues('payoutCurrencyObj'))
                            const payoutCty = Object.keys(payoutCcyStr)[0]
                            const payoutCcy = payoutCcyStr[payoutCty]

                            const newTimer = setTimeout(() => {
                              if (sentValue !== '') {
                                dispatch(
                                  getExchangeRate({
                                    function: 'GET_FXINFO',
                                    data: {
                                      fx_info: {
                                        collection_ccy: collectionCcy,
                                        collection_country: collectionCty,
                                        payout_ccy: payoutCcy,
                                        payout_country: payoutCty,
                                        source_type: 'MERCHANT',
                                        source_id: auth?.user.source_id,
                                        amount: Number(sentValue),
                                        collection_to_payout: payDirection
                                      }
                                    }
                                  })
                                )
                              } else if (sentValue === '') {
                                setValue('collectionAmount', '')
                              }
                            }, 1000)

                            setTimer(newTimer)

                            onChange(e)
                          }}
                          //autoFocus
                          id='standard-basic'
                          // label='Standard'
                          variant='standard'
                          placeholder={t('Recipient receives')}
                          InputProps={{
                            inputComponent: ({ inputRef, onChange, ...other }) => (
                              <NumericFormat
                                {...other}
                                getInputRef={inputRef}
                                onValueChange={values => {
                                  onChange({
                                    target: {
                                      id: 'standard-basic',
                                      value: values.value
                                    }
                                  })
                                }}
                                thousandSeparator=','
                              />
                            ),
                            disableUnderline: true,
                            startAdornment: loading ? <CircularProgress size={20} /> : null
                          }}
                        />
                      )}
                    />
                  </Grid>
                  {/* <Typography variant='body2'>Issues Found</Typography> */}
                  <Grid item xs>
                    {/* {validCurrencies && validCurrencies.length > 0 && ( */}
                    <Controller
                      name='payoutCurrencyObj'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          //disabled
                          sx={{ border: 0 }}
                          variant='standard'
                          select
                          SelectProps={{
                            value: value,
                            onChange: e => {
                              setPrevPayCurr(false)
                              onChange(e)
                              onRefreshFeeClick()
                            }
                          }}
                          InputProps={{
                            disableUnderline: true
                          }}
                          id='validation-country-select'
                          // error={Boolean(error.select)}
                          aria-describedby='validation-country-select'
                          // {...(error.select && { helperText: "This field is required" })}
                        >
                          {validCurrencies &&
                          Object.keys(validCurrencies).length > 0 &&
                          watchCollectionCurrency &&
                          Object.keys(watchCollectionCurrency).length > 0 ? (
                            Object.keys(watchCollectionCurrency).map((country, index) => {
                              return Object.keys(validCurrencies[country][watchCollectionCurrency[country]]).map(
                                (paycont, index) => {
                                  return validCurrencies[country][watchCollectionCurrency[country]][paycont].map(
                                    (curr, index) => {
                                      return (
                                        <MenuItem key={index} value={JSON.stringify({ [paycont]: curr })}>
                                          <Grid
                                            sx={{
                                              gap: 2,
                                              display: 'flex',
                                              flexWrap: 'nowrap',
                                              justifyContent: 'center',
                                              alignContent: 'center',
                                              padding: 0
                                            }}
                                          >
                                            <img
                                              width={20}
                                              height={20}
                                              src={`/images/currencies/${paycont}.png`}
                                              alt={'flag of' + paycont}
                                            />

                                            <Box> {curr}</Box>
                                          </Grid>
                                        </MenuItem>
                                      )
                                    }
                                  )
                                }
                              )
                            })
                          ) : (
                            <MenuItem />
                          )}
                        </TextField>
                      )}
                    />
                    {/* )} */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            {paymentReasons.length > 0 && (
              <Controller
                name='paymentReason'
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
                      }
                    }}
                    id='select-controlled'
                    error={Boolean(errors.paymentReason)}
                    {...(errors.paymentReason && { helperText: t('This field is mandatory') })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Payment Reason'
                        ? {
                            content: `"${t('Payment Reason')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {paymentReasons.map((reason, index) => {
                      return (
                        <MenuItem key={index} value={reason.category_code}>
                          {t(reason.description)}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='h4'>
              <Translations text='Documents' />
            </Typography>
            <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '18px', fontWeight: 400 }}>
              <Translations text='Attach your documents like Invoice or work contract.' />
            </Typography>

            <Controller
              name='invoiceNumber'
              control={control}
              // rules={{
              //   required: true
              // }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  placeholder={t('Invoice Number (Optional)')}
                  type='number'
                  error={Boolean(errors.invoiceNumber)}
                  aria-describedby='validation-invoice-number'
                  {...(errors.invoiceNumber && { helperText: <Translations text='This field is mandatory' /> })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            {files.length === 0 && !createTransaction?.invoiceFile ? (
              <Box sx={{ cursor: 'pointer' }}>
                <FileDropZone files={files} setFiles={setFiles} />
              </Box>
            ) : (
              <CardCommonDocuments
                docName={files.length > 0 ? files[0].name : createTransaction?.invoiceFileName}
                handleClick={handleFileDelete}
              />
            )}
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
              <Button disabled={!isValid === true} type='submit' variant='contained'>
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
