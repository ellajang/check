import { useEffect, React, Fragment, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
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
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updateNatureOfBusiness } from 'src/store/apps/onboarding'
import { getAllIndustryTypes, getAllProductTypes } from 'src/store/apps/category'
import { Alert, CircularProgress, Typography } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const nobSchema = yup.object().shape({
  nob: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  describe: yup.string().max(150, 'Please enter a maximum of 150 characters.')
})

const StepNatureOfBusiness = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { natureOfBusiness } = onboarding

  const { industryTypes, loading, industryTypesError } = useSelector(state => state.category)

  // const [industry, setIndustry] = useState('')

  // const [product, setProduct] = useState('')

  // ** Hooks
  useEffect(() => {
    dispatch(
      getAllIndustryTypes({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_nested: 'INDUSTRY_TYPE',
            by: 'CATEGORY_TYPE'
          }
        }
      })
    )
  }, [dispatch])

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      industryType: natureOfBusiness.industryType,
      productType: natureOfBusiness.productType,
      nob: natureOfBusiness.nob,
      describe: natureOfBusiness.describe
    }
  })

  const industry = watch('industryType', '')
  const product = watch('productType', '')

  const onSubmit = data => {
    // console.log('date check', monthYear.getDate())
    // data.dob = monthYear.date
    // data.dob = data.dob.toLocaleDateString('sv-SE')
    console.log('Data', data)

    dispatch(updateNatureOfBusiness(data))
    handleNext()
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {industryTypesError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {t(industryTypesError)}
          </Alert>
        )}
        <GMETitle
          title='Nature Of Business'
          subTitle='Select a category to speed up the business verification process'
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='industryType'
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
                  id='validation-type-of-industry'
                  error={Boolean(errors.select)}
                  aria-describedby='validation-type-of-industry'
                  {...(errors.select && { helperText: <Translations text='This field is mandatory' /> })}
                  sx={{
                    '& .MuiSelect-select .notranslate::after': 'Industry Type'
                      ? {
                          content: `"${t('Industry Type')}"`,
                          opacity: 0.42
                        }
                      : {}
                  }}
                >
                  {/* {industryTypes.length > 0 && */}
                  {industryTypes?.length > 0 ? (
                    industryTypes.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.category_code}>
                          <Translations text={type.description} />
                        </MenuItem>
                      )
                    })
                  ) : (
                    <MenuItem></MenuItem>
                  )}
                </CustomTextField>
              )}
            />
          </Grid>
          {industry && (
            <Grid item xs={12} sm={12}>
              <Controller
                name='productType'
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
                    id='validation-type-of-product'
                    error={Boolean(errors.select)}
                    aria-describedby='validation-type-of-product'
                    {...(errors.select && { helperText: <Translations text='This field is mandatory' /> })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Product Type'
                        ? {
                            content: `"${t('Product Type')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {industryTypes?.length > 0 ? (
                      industryTypes.map(type => {
                        return (
                          type.category_code == industry &&
                          type?.nested_data &&
                          type.nested_data.map((product, index) => {
                            return (
                              <MenuItem key={index} value={product.category_code}>
                                <Translations text={product.description} />
                              </MenuItem>
                            )
                          })
                        )
                      })
                    ) : (
                      <MenuItem />
                    )}
                  </CustomTextField>
                )}
              />
            </Grid>
          )}
          {product == 'OTHERS' && (
            <Grid item xs={12} sm={12}>
              <Controller
                name='nob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    fullWidth
                    onChange={onChange}
                    placeholder={t('Specify your nature of business')}
                    error={Boolean(errors.nob)}
                    aria-describedby='validation-type-of-product'
                    {...(errors.nob && { helperText: <Translations text={errors.nob.message} /> })}
                  />
                )}
              />
            </Grid>
          )}

          {product && (
            <>
              <Grid item xs={12} sm={12}>
                <Grid container sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Grid item xs={6}>
                    <Typography variant='h5'>
                      <Translations text='Describe your business' />
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Icon icon='ic:outline-info' />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='describe'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      fullWidth
                      multiline
                      onChange={onChange}
                      placeholder={t('Description')}
                      error={Boolean(errors.describe)}
                      aria-describedby='validation-type-of-product'
                      {...(errors.describe && { helperText: <Translations text={errors.describe.message} /> })}
                    />
                  )}
                />
              </Grid>
            </>
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

export default StepNatureOfBusiness
