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
import { Translation, useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

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
import { useAuth } from 'src/hooks/useAuth'
import GMETitle from './GMETitle'
import getBase64 from 'src/utils/getBase64'
import { updateCompanyRepresentative, resetCompanyRepresentativeFile } from 'src/store/apps/onboarding'
import { getAllCountries, getAllNationalities, getAllDesignations } from 'src/store/apps/category'
import { Alert, CircularProgress } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'
import CardCommonDocuments from "../onboard-documents/common/CardCommonDocuments";
import handleDocumentValidation from "../../utils/documentValidation";
import subYears from "date-fns/subYears";

const companyRepSchema = yup.object().shape({
  nameEnglish: yup
    .string()
    .required('This field is mandatory')
    .matches(/^[A-Za-z\s]+$/, 'Please enter english charecters only.')
    .max(50, 'Please enter a maximum of 50 characters.'),

  nameKorean: yup.string().max(50, 'Please enter a maximum of 50 characters.'),
  address: yup.string().required('This field is mandatory').max(50, 'Please enter a maximum of 50 characters.'),

  phone: yup
    .string()
    .required('This field is mandatory')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Please enter valid phone number.'
    )
    .max(11, 'Please enter a maximum of 11 characters.')
    .min(10, 'Please enter a minimum of 10 characters.')
})

const StepCompanyRepresentative = ({ handleNext }) => {
  const [baseImage, setBaseImage] = useState('')

  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { t } = useTranslation()
  const id = Date.now().toString(36)
  // const [monthYear, setMonthYear] = useState(null)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { companyRepresentative, countryOfResidence } = onboarding

  const { designations, nationalities, localPhoneCode, countries, designationsError, nationalitiesError, loading } =
    useSelector(state => state.category)

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

  // ** Hooks
  useEffect(() => {
    // dispatch(
    //   getAllDesignations({
    //     function: 'SEARCH',
    //     scope: 'BYKEYWORD',
    //     data: {
    //       query_params: {
    //         for_one: 'DESIGNATIONS'
    //       }
    //     }
    //   })
    // )
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
    if (!countries.length > 0) {
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
  }, [dispatch])

  let defaultPhoneCode = ''
  if (companyRepresentative[0]?.phoneCode && countries?.length > 0) {
    defaultPhoneCode = companyRepresentative[0].phoneCode
  } else if (countryOfResidence?.country && countries?.length > 0) {
    defaultPhoneCode = countries.find(country => country.country_code === countryOfResidence.country)?.phone_code
      ? countries.find(country => country.country_code === countryOfResidence.country)?.phone_code
      : ''
  } else if (auth.user?.incorporation_country && countries?.length > 0) {
    defaultPhoneCode = countries.find(country => country.country_code === auth.user.incorporation_country)?.phone_code
      ? countries.find(country => country.country_code === auth.user.incorporation_country)?.phone_code
      : ''
  } else if (localPhoneCode && countries?.length > 0) {
    defaultPhoneCode = localPhoneCode
  } else if (countries?.length > 0) {
    defaultPhoneCode = '+82'
  } else {
    defaultPhoneCode = ''
  }

  const defPhCode = defaultPhoneCode

  const {
    control,
    watch,
    resetField,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(companyRepSchema),
    defaultValues: {
      id: companyRepresentative[0]?.id ? companyRepresentative[0].id : id,
      nameEnglish: companyRepresentative[0]?.nameEnglish ? companyRepresentative[0].nameEnglish : '',
      nameKorean: companyRepresentative[0]?.nameKorean ? companyRepresentative[0].nameKorean : '',
      // designation: companyRepresentative[0]?.designation ? companyRepresentative[0].designation : '',
      nationality: companyRepresentative[0]?.nationality ? companyRepresentative[0].nationality : '',
      address: companyRepresentative[0]?.address ? companyRepresentative[0].address : '',
      phone: companyRepresentative[0]?.phone ? companyRepresentative[0].phone : '',
      phoneCode: defPhCode,
      idFile: companyRepresentative[0]?.idFile ? companyRepresentative[0].idFile : '',
      dob: companyRepresentative[0]?.dob ? new Date(companyRepresentative?.dob) : ''
    }
  })

  const watchFile = watch('idFile', '')
  const checkPhoneCode = watch('phoneCode')

  const setImage = async (e, onChange) => {
    const file = e.target.files[0];
    const validation = handleDocumentValidation(file);
    if (validation !== true) {
      toast.error(validation);

      return;
    }

    const base64 = await getBase64(file);
    onChange(file)
    setBaseImage(base64);
  }

  const handleClick = () => {
    setValue('idFile', '')
  }

  const onSubmit = data => {
    dispatch(updateCompanyRepresentative([{ ...data, idCopy: baseImage }]))
    handleNext()
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*{designationsError && (*/}
          {/*  <Alert severity='error' sx={{ mb: 4 }}>*/}
          {/*    {designationsError}*/}
          {/*  </Alert>*/}
          {/*)}*/}
          {nationalitiesError && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {nationalitiesError}
            </Alert>
          )}
          <Grid container spacing={4}>
            <GMETitle
              title={t('CEO Information')}
              subTitle={t('Please list the name (s) of the ceo (s).')}
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
                name='nameEnglish'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Name (in English)')}
                    error={Boolean(errors.nameEnglish)}
                    aria-describedby='validation-name-in-english'
                    {...(errors.nameEnglish && { helperText: <Translations text={errors.nameEnglish.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='nameKorean'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Name (in Native Language)')}
                    error={Boolean(errors.nameKorean)}
                    aria-describedby='validation-name-in-korean'
                    {...(errors.nameKorean && { helperText: <Translations text={errors.nameKorean.message} /> })}
                  />
                )}
              />
            </Grid>
            {/*<Grid item xs={12} sm={12}>*/}
            {/* <Controller*/}
            {/*    name='designation'*/}
            {/*     control={control}*/}
            {/*    rules={{ required: true }}*/}
            {/*    render={({ field: { value, onChange } }) => (*/}
            {/*      <CustomTextField*/}
            {/*        select*/}
            {/*        fullWidth*/}
            {/*        SelectProps={{*/}
            {/*          value: value,*/}
            {/*          onChange: e => onChange(e)*/}
            {/*        }}*/}
            {/*        id='validation-country-select'*/}
            {/*        error={Boolean(errors.designation)}*/}
            {/*        aria-describedby='validation-country-select'*/}
            {/*        {...(errors.designation && { helperText: <Translations text='This field is mandatory' /> })}*/}
            {/*        sx={{*/}
            {/*          '& .MuiSelect-select .notranslate::after': 'Designation'*/}
            {/*            ? {*/}
            {/*                content: `"${t('Designation')}"`,*/}
            {/*                opacity: 0.42*/}
            {/*              }*/}
            {/*            : {}*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {designations?.length > 0 ? (*/}
            {/*          designations.map((designation, index) => {*/}
            {/*            return (*/}
            {/*              <MenuItem key={index} value={designation.category_code}>*/}
            {/*                <Translations text={designation.description} />*/}
            {/*              </MenuItem>*/}
            {/*            )*/}
            {/*          })*/}
            {/*        ) : (*/}
            {/*          <MenuItem />*/}
            {/*        )}*/}
            {/*      </CustomTextField>*/}
            {/*    )}*/}
            {/*  />*/}
            {/*</Grid>*/}
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
                    yearDropdownItemNumber={100}
                    selected={value}
                    openToDate={new Date('1980-01-01')}
                    maxDate={subYears(new Date(), 14)}
                    id='month-year-dropdown'
                    placeholderText={t('Date of Birth')}
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
            <Grid item xs={12} sm={12}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder={t('Address')}
                    error={Boolean(errors.address)}
                    aria-describedby='validation-address'
                    {...(errors.address && { helperText: <Translations text={errors.address.message} /> })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Controller
                    name='phoneCode'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-country-select'
                        error={Boolean(errors.phoneCode)}
                        aria-describedby='validation-country-select'
                        {...(errors.phoneCode && { helperText: <Translations text='This field is mandatory' /> })}
                        sx={{
                          '& .MuiSelect-select .notranslate::after': '+82'
                            ? {
                                content: `"Code"`,
                                opacity: 0.42
                              }
                            : {}
                        }}
                      >
                        {countries?.length > 0 ? (
                          countries.map((country, index) => {
                            return (
                              <MenuItem key={index} value={country.phone_code}>
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
                                    alt={country.country}
                                    style={{ width: '15px', height: '15px', marginRight: '4px' }}
                                  />
                                  <Typography>{country.phone_code}</Typography>
                                </Grid>
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
                <Grid item xs>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='tel'
                        value={value}
                        onChange={onChange}
                        disabled={!checkPhoneCode}
                        error={Boolean(errors.phone)}
                        placeholder={t('Mobile Number')}
                        aria-describedby='stepper-linear-phone-phone'
                        {...(errors.phone && { helperText: <Translations text={errors.phone.message} /> })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
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
                        setImage(event, onChange)
                      }}
                      error={Boolean(errors.idFile)}
                      aria-describedby='stepper-linear-file-upload'
                      {...(errors.idFile && { helperText: <Translations text='This field is mandatory' /> })}
                    />
                  )}
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography sx={{ color: 'text.disabled' }}>
                <Translations text={`Acceptable file size is less than ${process.env.NEXT_PUBLIC_DOCUMENT_LIMIT}MB, jpg, png or pdf`} />
              </Typography>
            </Grid>
            {getValues('idFile') && (
              <CardCommonDocuments handleClick={handleClick} docName={getValues('idFile').name} />
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

export default StepCompanyRepresentative
