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
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
import subYears from 'date-fns/subYears'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updateListOfDirectors } from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import { Alert, CircularProgress } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const dirSchema = yup.object().shape({
  name: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.')
})

const StepListOfDirectors = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const id = Date.now().toString(36)

  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { listOfDirectors } = onboarding
  const { nationalities, nationalitiesError, loading } = useSelector(state => state.category)

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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(dirSchema),
    defaultValues: {
      id: listOfDirectors[0]?.id ? listOfDirectors[0].id : id,
      name: listOfDirectors[0]?.name ? listOfDirectors[0].name : '',
      nationality: listOfDirectors[0]?.nationality ? listOfDirectors[0]?.nationality : '',
      dob: listOfDirectors[0]?.dob ? listOfDirectors[0]?.dob : ''
    }
  })

  const onSubmit = data => {
    // console.log('date check', monthYear.getDate())
    // data.dob = monthYear.date
    // data.dob = data.dob.toLocaleDateString('sv-SE')
    console.log('Data', data)

    dispatch(updateListOfDirectors([data]))
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
              title='List of Directors'
              subTitle='Please list the name (s) of Director (s) or Authorative Signatory (ies)'
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
                )}
              />
            </Grid>
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

export default StepListOfDirectors
