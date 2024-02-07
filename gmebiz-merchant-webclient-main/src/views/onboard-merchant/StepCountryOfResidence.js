import { useEffect, React, Fragment, useState, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'

import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

// ** Custom Component Imports
import { useAuth } from 'src/hooks/useAuth'
import GMETitle from './GMETitle'
import { getAllCountries, getGeoInfo } from 'src/store/apps/category'
import { updateCountryOfResidence } from 'src/store/apps/onboarding'
import { CircularProgress, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import FallbackSpinner from 'src/layouts/components/spinner'

const StepCountryOfResidence = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const prevValueRef = useRef()
  // ** Hooks
  const onboarding = useSelector(state => state.onboarding)
  const { countryOfResidence } = onboarding
  const { localCountry, countries, getGeoInfoError, countryError, loading } = useSelector(state => state.category)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      country: ''
    }
  })

  let defaultCountry = ''

  if (!(countries?.length > 0)) {
    defaultCountry = ''
  } else if (countryOfResidence?.country) {
    defaultCountry = countryOfResidence.country
  } else if (auth?.user?.incorporation_country) {
    defaultCountry = countries.find(country => country.country_code === auth.user?.incorporation_country)
      ? auth.user?.incorporation_country
      : ''
  } else if (localCountry) {
    defaultCountry = localCountry
  } else {
    defaultCountry = 'KR'
  }

  useEffect(() => {
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
  }, [dispatch])

  useEffect(() => {
    if (countries) {
      setValue('country', defaultCountry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, setValue])

  const onSubmit = data => {
    dispatch(updateCountryOfResidence(data))
    handleNext()
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {getGeoInfoError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {t(getGeoInfoError)}
          </Alert>
        )}
        {countryError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {countryError}
          </Alert>
        )}
        <GMETitle
          title={`Applicant's Country of Residence`}
          subTitle='The terms and service applicable to you will depend on your country of residence.'
        />
        {/* <Grid item xs={12} sm={12}>
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
                          <Typography>
                            <Translations text={country.country} />
                          </Typography>
                        </Grid>
                      </MenuItem>
                    )
                  })
                ) : (
                  <MenuItem></MenuItem>
                )}
              </CustomTextField>
            )}
          />
        </Grid> */}

        <Grid item xs={12}>
          {countries && (
            <Controller
              name='country'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomAutocomplete
                  value={
                    value
                      ? countries.find(option => {
                          return value === option.country_code
                        }) ?? null
                      : null
                  }
                  fullWidth
                  options={countries}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.country_code : null)
                  }}
                  id='autocomplete-controlled'
                  getOptionLabel={option => t(option.country) || ''}
                  renderOption={(props, option) => (
                    <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                      <img
                        src={option.icon}
                        alt={'flag of ' + option.country}
                        style={{ width: '15px', height: '15px', marginRight: '4px' }}
                      />
                      {t(option.country)}
                    </Box>
                  )}
                  renderInput={params => (
                    <CustomTextField
                      error={Boolean(errors.country)}
                      {...(errors.country && { helperText: <Translations text='This field is mandatory' /> })}
                      placeholder={t('Country of Residence')}
                      {...params}
                    />
                  )}
                />
              )}
            />
          )}
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
    </Fragment>
  )
}

export default StepCountryOfResidence
