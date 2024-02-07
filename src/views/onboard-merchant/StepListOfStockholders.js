import { React, Fragment, useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import { Icon } from '@iconify/react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'
import getBase64 from 'src/utils/getBase64'
import subYears from 'date-fns/subYears'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updateListOfStockholders } from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import { Alert, CircularProgress } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const stockSchema = yup.object().shape({
  name: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  pos: yup
    .string()
    .required('This field is mandatory')
    .matches(/^[0-9]*$/, 'Please enter numbers only.')
    .test('value-comp', 'Value must be minimum or maximum', function (value) {
      const errors = []

      if (Number(value) < 10) {
        errors.push('Please enter a value equal to or greater than 10')
      }

      if (Number(value) > 100) {
        errors.push('Please enter a value up to a maximum of 100')
      }

      return errors.length === 0 ? true : this.createError({ message: errors })
    })
})

const StepListOfStockholders = ({ handleNext }) => {
  const [baseImage, setBaseImage] = useState('')
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const id = Date.now().toString(36)
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { listOfStockholders } = onboarding
  const { localCountry, countries, nationalities, nationalitiesError, loading } = useSelector(state => state.category)

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    backgroundColor: '#FFFFFF'
  })

  //** Hooks
  useEffect(() => {
    if (!nationalities?.length > 0) {
      dispatch(
        getAllNationalities({
          function: 'SEARCH',
          scope: 'BYKEYWORD',
          data: {
            query_params: {
              for_one: 'NATIONALITY'
            }
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const {
    control,
    watch,
    resetField,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(stockSchema),
    defaultValues: {
      id: listOfStockholders[0]?.id ? listOfStockholders[0].id : id,
      name: listOfStockholders[0]?.name ? listOfStockholders[0].name : '',
      nationality: listOfStockholders[0]?.nationality ? listOfStockholders[0]?.nationality : '',
      dob: listOfStockholders[0]?.dob ? listOfStockholders[0]?.dob : '',
      pos: listOfStockholders[0]?.pos ? listOfStockholders[0]?.pos : '',
      idFile: listOfStockholders[0]?.idFile ? listOfStockholders[0]?.idFile : ''
    }
  })

  const watchFile = watch('idFile', '')

  const setImage = async e => {
    const file = e.target.files[0]
    const base64 = await getBase64(file)
    setBaseImage(base64)
  }

  const handleClick = () => {
    console.log('file reset')
    setValue('idFile', '')
  }

  const onSubmit = data => {
    // console.log('date check', monthYear.getDate())
    // data.dob = monthYear.date
    // data.dob = data.dob.toLocaleDateString('sv-SE')
    console.log('Data', data)

    dispatch(updateListOfStockholders([{ ...data, idCopy: baseImage }]))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {nationalitiesError && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {nationalitiesError}
            </Alert>
          )}
          <Grid container spacing={4}>
            <GMETitle
              title='List of Stockholders'
              subTitle='Please list the name (s) of stockholder (s) holding shares above 10%'
            />

            <Controller
              name='id'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <VisuallyHiddenInput
                  id='id'
                  readOnly
                  value={value}
                  error={Boolean(errors.id)}
                  aria-describedby='stepper-linear-file-upload'
                  {...(errors.id && { helperText: <Translations text='This field is mandatory' /> })}
                />
              )}
            />

            <Grid item xs={12} sm={12}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Name')}
                    error={Boolean(errors.name)}
                    aria-describedby='validation-name'
                    {...(errors.name && { helperText: <Translations text={errors.name.message} /> })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Controller
                name='nationality'
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
                    id='validation-nationality-select'
                    error={Boolean(errors.nationality)}
                    aria-describedby='validation-nationality-select'
                    {...(errors.nationality && { helperText: <Translations text='This field is mandatory' /> })}
                    sx={{
                      '& .MuiSelect-select .notranslate::after': 'Nationality'
                        ? {
                            content: `"${t('Nationality')}"`,
                            opacity: 0.42
                          }
                        : {}
                    }}
                  >
                    {nationalities?.length > 0 ? (
                      nationalities.map((nationality, index) => {
                        return (
                          <MenuItem key={index} value={nationality.category_code}>
                            <Translations text={nationality.description} />
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

            <Grid item xs={12} sm={12}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  // <Box className='customDatePickerWidth'>
                  <DatePicker
                    dateFormat='yyyy-MM-dd'
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown={true}
                    selected={value}
                    openToDate={new Date('1980-01-01')}
                    id='month-year-dropdown'
                    placeholderText={t('Date of Birth')}
                    maxDate={subYears(new Date(), 14)}
                    popperPlacement={popperPlacement}
                    onChange={onChange}
                    customInput={
                      <CustomInput
                        fullWidth
                        icon='uil:calender'
                        error={Boolean(errors.dob)}
                        aria-describedby='validation-date-of-birth'
                        {...(errors.dob && { helperText: <Translations text='This field is mandatory' /> })}
                      />
                    }
                  />
                  // </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='pos'
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Percentage of Share')}
                    error={Boolean(errors.pos)}
                    aria-describedby='validation-pos'
                    {...(errors.pos && { helperText: <Translations text={errors.pos.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                component='label'
                variant='contained'
                sx={{ bgcolor: '#fff', color: 'text.primary' }}
                startIcon={<Icon icon='material-symbols:upload' />}
              >
                <Translations text='Upload ID Copy' />
                <Controller
                  name='idFile'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <VisuallyHiddenInput
                      id='idFile'
                      type='file'
                      value={value?.fileName}
                      onChange={event => {
                        setImage(event)
                        onChange(event.target.files[0])
                      }}
                      error={Boolean(errors.idCopyStock)}
                      aria-describedby='stepper-linear-file-upload'
                      {...(errors.idCopyStock && { helperText: <Translations text='This field is mandatory' /> })}
                    />
                  )}
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography sx={{ color: 'text.disabled' }}>
                <Translations text='Acceptable file size is less than 5MB, jpg, png or pdf' />
              </Typography>
            </Grid>
            {getValues('idFile') && (
              <Grid item xs={12} sm={12}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    height: '66px',
                    border: `1px solid `,
                    borderColor: 'secondary.main',
                    padding: '9px 8px 9px 8px'
                  }}
                >
                  <Grid item xs={2}>
                    <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography color='#1890FF'>{getValues('idFile').name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      onClick={handleClick}
                      sx={{
                        '&:hover': {
                          background: '#fff'
                        }
                      }}
                    >
                      <Icon color='#1890FF' icon='ant-design:delete-outlined' width='14' height='14' />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
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
      </DatePickerWrapper>
    </Fragment>
  )
}

export default StepListOfStockholders
