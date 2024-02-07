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
import {styled, useTheme} from '@mui/material/styles'
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
import {getAllCountries} from 'src/store/apps/category'
import {
  getMerchants,
  createBusinessAddress,
  resetOnboardingStatus,
  updateBusinessAddress
} from 'src/store/apps/onboarding'
import { useAuth } from 'src/hooks/useAuth'
import DialogAddressHtml from "../../components/dialog/DialogAddressHTML";

const StyledGetAddressButton = styled(Button)(({ theme }) => ({
  transition: 'background-color 0.3s, color 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const DetailsEditView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { t } = useTranslation()
  const { merchants, error, loading, message, responseStatus, messageCode, editBusinessAddress } = useSelector(state => state.onboarding)
  const { countries, countryError } = useSelector(state => state.category)
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  useEffect(() => {
    if (!(merchants.length > 0)) {
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
    }
    if (!(countries.length > 0)) {
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      if (messageCode === 'UPDATED_SUCCESSFULLY') {
        Router.push('/onboarding/documents/business-address')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      country: '',
      postalCode: '',
      addressLine1: '',
      addressLine2: '',
    }
  })

  useEffect(() => {
    if (countries && merchants) {
      reset({
        country: merchants[0]?.incorporation_country,
        postalCode: editBusinessAddress?.postalCode ?? merchants[0]?.postal_code,
        addressLine1: editBusinessAddress?.addressLine1 ?? merchants[0]?.address1,
        addressLine2: editBusinessAddress?.addressLine2 ?? merchants[0]?.address2,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, merchants, reset, editBusinessAddress])

  const onSubmit = data => {
    dispatch(
      createBusinessAddress({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchant: {
            ...merchants[0],
            incorporation_country: data.country,
            postal_code: data.postalCode,
            address1: data.addressLine1,
            address2: data.addressLine2,
            city: data.city
          }
        }
      })
    )
  }

  const handleAddressDialog = (show) => {
    setShowAddressDialog(show)
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
              Router.push('/onboarding/documents/business-address')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Business Address' />
          </Typography>
        </Box>
        <Box>
          <DatePickerWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='country'
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
                        id='validation-country-select'
                        error={Boolean(errors.country)}
                        aria-describedby='validation-country-select'
                        {...(errors.country && { helperText: <Translations text='This field is required' /> })}
                        sx={{
                          '& .MuiSelect-select .notranslate::after': 'Country'
                            ? {
                                content: `"${t('Country')}"`,
                                opacity: 0.42
                              }
                            : {}
                        }}
                      >
                        {countries?.length > 0 ? (
                          countries.map((country, index) => {
                            return (
                              <MenuItem key={index} value={country.country_code}>
                                <img
                                  src={country.icon}
                                  alt={'flag of ' + country.country}
                                  style={{ width: '14px', height: '14px', marginRight: '4px' }}
                                />
                                <Translations text={country.country} />
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
                <Grid item xs={9} sm={9}>
                  <Controller
                    name='postalCode'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Postal Code')}
                        error={Boolean(errors.postalCode)}
                        aria-describedby='validation-postal-code'
                        {...(errors.postalCode && { helperText: <Translations text='This field is required' /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <StyledGetAddressButton
                    onClick={()=>setShowAddressDialog(true)}
                    size={'small'}
                    color={'secondary'}
                    variant={'contained'}
                    sx={{
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    <Translations text="Find Address"  />
                  </StyledGetAddressButton>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='addressLine1'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Address Line 1')}
                        error={Boolean(errors.addressLine1)}
                        aria-describedby='validation-address-line-1'
                        {...(errors.addressLine1 && { helperText: <Translations text='This field is required' /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='addressLine2'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder={t('Address Line 2')}
                        error={Boolean(errors.addressLine1)}
                        aria-describedby='validation-address-line-2'
                        {...(errors.addressLine1 && { helperText: <Translations text='This field is required' /> })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                  <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                    <Translations text='Update' />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DatePickerWrapper>
        </Box>
      </Box>
      <DialogAddressHtml
        handleDialog={handleAddressDialog}
        show={showAddressDialog}
        scope={'businessAddressEdit'}
      />
    </Box>
  )
}

export default DetailsEditView
