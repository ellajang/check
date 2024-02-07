import { React, Fragment, useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

import DatePicker, { registerLocale } from 'react-datepicker'

import ko from 'date-fns/locale/ko'
import en from 'date-fns/locale/en-GB'
import subYears from 'date-fns/subYears'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports

import { useForm, Controller } from 'react-hook-form'

import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updatePersonalDetails } from 'src/store/apps/onboarding'
import Translations from 'src/layouts/components/Translations'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import authConfig from 'src/configs/auth'

registerLocale('ko', ko)
registerLocale('en', en)

const detailSchema = yup.object().shape({
  firstName: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  middleName: yup.string().max(50, 'Please enter a maximum of 50 characters.'),
  lastName: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),
  fullNameNative: yup.string().max(50, 'Please enter a maximum of 50 characters.')
})

const StepPersonalDetails = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()

  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { personalDetails } = useSelector(state => state.onboarding)

  const userLanguage = localStorage.getItem(authConfig.selectedLanguage)

  // ** Hooks

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { ...personalDetails },
    resolver: yupResolver(detailSchema)
  })

  const onSubmit = data => {
    dispatch(updatePersonalDetails(data))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <GMETitle
              title="Applicant's Details"
              subTitle='Please provide the name of the individual applying on behalf of the company.'
            />
            <Grid item xs={12} sm={12}>
              <Controller
                name='firstName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Given Name (in English)')}
                    error={Boolean(errors.firstName)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.firstName && { helperText: <Translations text={errors?.firstName?.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='middleName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Middle Name (in English)') + '(' + t('Optional') + ')'}
                    error={Boolean(errors.middleName)}
                    aria-describedby='validation-basic-middle-name'
                    {...(errors.middleName && { helperText: <Translations text={errors?.middleName?.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='lastName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Surname (in English)')}
                    error={Boolean(errors.lastName)}
                    aria-describedby='validation-basic-last-name'
                    {...(errors.lastName && { helperText: <Translations text={errors?.lastName?.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='fullNameNative'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Full Name (in Native Language)')}
                    error={Boolean(errors.fullNameNative)}
                    aria-describedby='validation-basic-full-name-native'
                    {...(errors.fullNameNative && {
                      helperText: <Translations text={errors?.fullNameNative?.message} />
                    })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Controller
                name='dob'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    dateFormat='yyyy-MM-dd'
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown={true}
                    selected={value}
                    openToDate={new Date('1980-01-01')}
                    id='month-year-dropdown'
                    placeholderText={t('Date of Birth')}
                    popperPlacement={popperPlacement}
                    maxDate={subYears(new Date(), 14)}
                    onChange={onChange}
                    locale={userLanguage === 'ko' ? 'ko' : 'en'}
                    customInput={
                      <CustomInput
                        fullWidth
                        icon='uil:calender'
                        error={Boolean(errors.dob)}
                        aria-describedby='validation-basic-last-name'
                        {...(errors.dob && { helperText: <Translations text='This field is mandatory' /> })}
                      />
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
            <Translations text='Continue' />
          </Button>
        </form>
      </DatePickerWrapper>
    </Fragment>
  )
}

export default StepPersonalDetails
