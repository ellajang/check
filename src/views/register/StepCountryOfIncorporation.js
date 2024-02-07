// ** React Imports
import { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import MenuItem from '@mui/material/MenuItem'

import { useForm, Controller } from 'react-hook-form'

// ** Custom Component Import
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'

import GMETitle from './GMETitle'
import GoBackButton from './GoBackButton'

import { getIncCountries, getGeoInfo } from 'src/store/apps/category'

import Spinner from 'src/layouts/components/spinner'
import { updateCountryOfIncorporation } from '../../store/apps/register'
import { Typography } from '@mui/material'

const StepCountryOfIncorporation = ({ handleNext, handlePrev }) => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(null)
  const { localCountry, incCountries, incCountryError, loading } = useSelector(state => state.category)

  const { countryOfIncorporation } = useSelector(state => state.register)
  const { t } = useTranslation()

  const defaultValues = {
    countrySelect: countryOfIncorporation
  }

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({ defaultValues })

  const selectedValue = watch('countrySelect', null)

  useEffect(() => {
    dispatch(
      getIncCountries({
        function: 'LIST',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            by: 'IN_CORPORATION'
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const onSubmit = data => {
    dispatch(updateCountryOfIncorporation(data.countrySelect))
    handleNext()
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  if (loading) return <Spinner />

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GoBackButton handlePrev={handlePrev} />
        {incCountryError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {incCountryError}
          </Alert>
        )}

        <GMETitle
          title='Country of Incorporation'
          subTitle="Provide your company's incorporation details for a smooth account opening process"
        />

        <Grid container spacing={5} sx={{ mb: 16 }}>
          <Grid item xs={12}>
            {incCountries && (
              <Controller
                name='countrySelect'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    value={
                      value
                        ? incCountries.find(option => {
                            return value === option.country_code
                          }) ?? null
                        : null
                    }
                    fullWidth
                    options={incCountries}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.country_code : null)
                    }}
                    id='autocomplete-controlled'
                    getOptionLabel={option => t(option.description) || ''}
                    renderOption={(props, option) => (
                      <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                        <img
                          src={`/images/currencies/${option.country_code}.png`}
                          alt={'flag of ' + option.description}
                          style={{ width: '15px', height: '15px', marginRight: '4px' }}
                        />
                        {t(option.description)}
                      </Box>
                    )}
                    renderInput={params => (
                      <CustomTextField
                        error={Boolean(errors.country)}
                        {...(errors.country && { helperText: <Translations text='This field is mandatory' /> })}
                        placeholder={t('Country of Incorporation')}
                        {...params}
                      />
                    )}
                  />
                )}
              />
            )}
          </Grid>
        </Grid>

        <Button onClick={handleSubmit} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepCountryOfIncorporation
