import {React, Fragment, useState, useEffect} from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import {styled, useTheme} from '@mui/material/styles'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Custom Component Imports
import GMETitle from './GMETitle'

import { updateBusinessAddress } from 'src/store/apps/onboarding'
import { useAuth } from 'src/hooks/useAuth'
import FallbackSpinner from 'src/layouts/components/spinner'
import Box from "@mui/material/Box";
import DialogAddressHtml from "../components/dialog/DialogAddressHTML";
import {Icon} from "@iconify/react";
import {updateAddressScope} from "../../store/apps/category";

const businessAddressSchema = yup.object().shape({
  postalCode: yup.string().required('This field is mandatory').max(15, 'Please enter a maximum of 15 characters.'),
  addressLine1: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  addressLine2: yup.string().max(50, 'Please enter a maximum of 50 characters.'),
})

const StyledGetAddressButton = styled(Button)(({ theme }) => ({
  transition: 'background-color 0.3s, color 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));


const StepBusinessAddress = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { businessAddress, countryOfResidence } = onboarding
  const { localCountry, countries, countryError, loading } = useSelector(state => state.category)
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const handleAddressDialog = (show) => {
    setShowAddressDialog(show)
  }

  // ** Hooks

  let defaultCountry = ''
  if (businessAddress?.country && countries?.length > 0) {
    defaultCountry = businessAddress.country
  } else if (countryOfResidence?.country && countries?.length > 0) {
    defaultCountry = countryOfResidence.country
  } else if (auth?.user?.incorporation_country && countries?.length > 0) {
    defaultCountry = countries.find(country => country.country_code === auth.user?.incorporation_country)
      ? auth.user?.incorporation_country
      : ''
  } else if (localCountry && countries?.length > 0) {
    defaultCountry = localCountry
  } else if (countries?.length > 0) {
    defaultCountry = 'KR'
  } else {
    defaultCountry = ''
  }
  const defaultCont = defaultCountry

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(businessAddressSchema),
    defaultValues: {
      country: defaultCont,
      postalCode: businessAddress.postalCode,
      addressLine1: businessAddress.addressLine1,
      addressLine2: businessAddress.addressLine2,
    }
  })

  useEffect(()=>{
    reset({
      country: defaultCont,
      postalCode: businessAddress.postalCode,
      addressLine1: businessAddress.addressLine1,
      addressLine2: businessAddress.addressLine2,
    })
  },[businessAddress])

  const onSubmit = data => {
    dispatch(updateBusinessAddress(data))
    handleNext()
  }

  const handleGetAddress = () => {
    setShowAddressDialog(true)
  }


  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {countryError && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {countryError}
            </Alert>
          )}
          <Grid container spacing={4}>
            <GMETitle title='Business Address' subTitle='Principal place of business' />
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
                    {...(errors.country && { helperText: <Translations text='This field is mandatory' /> })}
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
                    {...(errors.postalCode && { helperText: <Translations text={errors.postalCode.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3} sm={3}>
              <StyledGetAddressButton
                onClick={handleGetAddress}
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
                    {...(errors.addressLine1 && { helperText: <Translations text={errors.addressLine1.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='addressLine2'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Address Line 2')}
                    error={Boolean(errors.addressLine2)}
                    aria-describedby='validation-address-line-2'
                    {...(errors.addressLine2 && { helperText: <Translations text={errors.addressLine2.message} /> })}
                  />
                )}
              />
            </Grid>
            {/*<Grid item xs={12} sm={12}>*/}
            {/*  <Controller*/}
            {/*    name='city'*/}
            {/*    control={control}*/}
            {/*    rules={{ required: true }}*/}
            {/*    render={({ field: { value, onChange } }) => (*/}
            {/*      <CustomTextField*/}
            {/*        fullWidth*/}
            {/*        value={value}*/}
            {/*        onChange={onChange}*/}
            {/*        placeholder={t('City')}*/}
            {/*        error={Boolean(errors.city)}*/}
            {/*        aria-describedby='validation-city'*/}
            {/*        {...(errors.city && { helperText: <Translations text={errors.city.message} /> })}*/}
            {/*      />*/}
            {/*    )}*/}
            {/*  />*/}
            {/*</Grid>*/}

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
      <DialogAddressHtml
        handleDialog={handleAddressDialog}
        show={showAddressDialog}
        scope={'businessAddress'}
      />
    </Fragment>
  )
}

export default StepBusinessAddress
