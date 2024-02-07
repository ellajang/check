// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import subYears from 'date-fns/subYears'
import * as yup from 'yup'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'

// ** Icon Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { getAllCountries, getAllLanguages } from 'src/store/apps/category'

import { updateUserProfile, resetProfileToast } from 'src/store/apps/profile'
import toast from 'react-hot-toast'

import getProfileBase64 from 'src/utils/getProfileBase64'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = ({ userProfile }) => {
  const dispatch = useDispatch()

  const initialImg = userProfile?.profile_image ? userProfile?.profile_image : '/images/avatars/default.png.png'

  // ** State

  const [inputValue, setInputValue] = useState('')
  const [imgSrc, setImgSrc] = useState(initialImg)

  const { countries, languages } = useSelector(state => state.category)

  const { updateStatus, updateMessage } = useSelector(state => state.profile)

  const { t } = useTranslation()

  // ** Hooks

  const schema = yup.object().shape({
    firstName: yup.string().required('This field is mandatory').max(50, 'This field must be at most 50 characters'),
    middleName: yup.string().max(50, 'This field  must be at most 50 characters'),
    lastName: yup.string().required('This field is mandatory').max(50, 'This field  must be at most 50 characters'),
    fullNameNative: yup.string().max(50, 'This field  must be at most 50 characters'),
    phone: yup.string().max(11, 'This field must be at most 11 digits '),
    address1: yup.string().max(150, 'This field must be at most 150 character'),
    address2: yup.string().max(150, 'This must be at most 150 character')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      middleName: userProfile?.middle_name || '',
      fullNameNative: userProfile?.full_native_name || '',
      email: userProfile?.email_id || '',
      phoneCode: userProfile?.phone_code || '+82',
      phone: userProfile?.phone_number || '',
      country: userProfile?.country || '',
      address1: userProfile?.address1 || '',
      address2: userProfile?.address2 || '',
      gender: userProfile?.gender || '',
      dob: userProfile?.dob ? new Date(userProfile?.dob) : '',
      languagePreference: userProfile?.language_preference || 'US',
      notificationPreference: userProfile?.notification_preference || 'NO'
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const dob = data?.dob ? dayjs(data?.dob).format('YYYY-MM-DD') : "";
    dispatch(
      updateUserProfile({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          user: {
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            email_id: data.email,
            phone_code: data.phoneCode,
            phone_number: data.phone,
            full_native_name: data.fullNameNative,
            country: data.country,
            gender: data.gender,
            dob: dob,
            address2: data.address2,
            address1: data.address1,
            language_preference: data.languagePreference,
            notification_preference: data.notificationPreference,
            profile_image: imgSrc
          }
        }
      })
    )
  }

  const setImage = async e => {
    const file = e.target.files[0]
    const base64File = await getProfileBase64(file)
    setImgSrc(base64File.base64)
    //console.log('whats in bse64', base64)
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

    dispatch(
      getAllLanguages({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'LANGUAGE'
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (updateStatus === 'SUCCESS') {
      toast.success(t(updateMessage))
      dispatch(resetProfileToast())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStatus])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        {/* Account Details Card */}
        <Grid item xs={12}>
          <Card sx={{ mx: '12%' }}>
            <CardHeader title={t('Profile Details')} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt={t('Profile picture')} />
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      <Translations text='Upload new picture' />
                      <input
                        hidden
                        type='file'
                        value={inputValue}
                        accept='image/png, image/jpeg'
                        onChange={e => {
                          setImage(e)
                        }}
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                    <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                      <Translations text='Allowed PNG or JPEG format, Maximum size of 800KB.' />
                    </Typography>
                  </div>
                </Box>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={5}>
                  {/*<Grid item xs={12} sm={1}>*/}
                  {/*  <Controller*/}
                  {/*    name='salutation'*/}
                  {/*    control={control}*/}
                  {/*    // rules={{ required: true }}*/}
                  {/*    render={({ field: { value, onChange } }) => (*/}
                  {/*      <CustomTextField*/}
                  {/*        select*/}
                  {/*        fullWidth*/}
                  {/*        label={t('Salutation')}*/}
                  {/*        SelectProps={{*/}
                  {/*          value: value,*/}
                  {/*          onChange: e => onChange(e)*/}
                  {/*        }}*/}
                  {/*      >*/}
                  {/*        <MenuItem value='MR'>{t('Mr')}</MenuItem>*/}
                  {/*        <MenuItem value='MS'>{t('Ms')}</MenuItem>*/}
                  {/*      </CustomTextField>*/}
                  {/*    )}*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='firstName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={
                            <Typography>
                              <Translations text='Given Name (in English)' /> <span style={{ color: 'red' }}>*</span>
                            </Typography>
                          }
                          placeholder={t('Given Name')}
                          aria-describedby='validation-basic-first-name'
                          error={Boolean(errors.firstName)}
                          {...(errors.firstName && { helperText: t(errors.firstName.message) })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='middleName'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={t('Middle Name (in English)')}
                          placeholder={t('Middle Name')}
                          aria-describedby='validation-basic-middle-name'
                          error={Boolean(errors.middleName)}
                          {...(errors.middleName && { helperText: t(errors.middleName.message) })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='lastName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={
                            <Typography>
                              <Translations text='Surname (in English)' /> <span style={{ color: 'red' }}>*</span>
                            </Typography>
                          }
                          placeholder={t('Surname')}
                          aria-describedby='validation-basic-last-name'
                          error={Boolean(errors.lastName)}
                          {...(errors.lastName && { helperText: t(errors.lastName.message) })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='fullNameNative'
                      control={control}
                      //  rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={t('Full Name (in Native Language)')}
                          placeholder={t('Full Name')}
                          error={Boolean(errors.fullNameNative)}
                          aria-describedby='validation-basic-native-name'
                          {...(errors.fullNameNative && { helperText: t(errors.fullNameNative.message) })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          disabled
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={t('Email')}
                          placeholder={t('Email')}
                          error={Boolean(errors.email)}
                          aria-describedby='validation-basic-email'
                          {...(errors.email && { helperText: <Translations text='This field is mandatory' /> })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='phone'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          type='number'
                          onChange={onChange}
                          label={t('Phone Number')}
                          placeholder={t('Phone Number')}
                          error={Boolean(errors.phone)}
                          aria-describedby='validation-basic-phone'
                          {...(errors.phone && { helperText: t(errors.phone.message) })}
                          InputProps={{
                            startAdornment: countries && (
                              <Controller
                                name='phoneCode'
                                control={control}
                                // rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    // sx={{ paddingRight: '20px !important' }}
                                    select
                                    fullWidth
                                    SelectProps={{
                                      value: value,
                                      onChange: e => onChange(e)
                                    }}
                                    // label={t('Phone Code')}
                                    sx={{
                                      width: '60%',
                                      marginLeft: -3,
                                      paddingRight: 5,

                                      '& .MuiInputBase-root': {
                                        border: 'none'
                                      }
                                    }}
                                    id='validation-code-select'
                                    // error={Boolean(error.select)}
                                    aria-describedby='validation-code-select'
                                    // {...(error.select && { helperText: "This field is mandatory" })}
                                  >
                                    {countries.length > 0 &&
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
                                                alt={'flag of ' + country.country}
                                                style={{
                                                  width: '15px',
                                                  height: '15px',
                                                  marginRight: '4px',
                                                  marginTop: '4px'
                                                }}
                                              />
                                              <Typography>{country.phone_code}</Typography>
                                            </Grid>
                                          </MenuItem>
                                        )
                                      })}
                                  </CustomTextField>
                                )}
                              />
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='country'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label={t('Country')}
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e)
                          }}
                          error={Boolean(errors.country)}
                          {...(errors.country && { helperText: <Translations text='This field is mandatory' /> })}
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
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='address1'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={t('Address 1')}
                          placeholder={t('Address 1')}
                          error={Boolean(errors.address1)}
                          aria-describedby='validation-basic-address1'
                          {...(errors.address1 && { helperText: t(errors.address1.message) })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='address2'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label={t('Address 2')}
                          placeholder={t('Address 2')}
                          error={Boolean(errors.address2)}
                          aria-describedby='validation-basic-address2'
                          {...(errors.address2 && { helperText: t(errors.address2.message) })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='dob'
                      control={control}
                      //   rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          dateFormat='yyyy-MM-dd'
                          selected={value}
                          showYearDropdown
                          showMonthDropdown
                          openToDate={new Date('1980-01-01')}
                          maxDate={subYears(new Date(), 14)}
                          onChange={e => onChange(e)}
                          placeholderText={t('Date of Birth')}
                          customInput={
                            <CustomInput
                              value={value}
                              onChange={onChange}
                              label={t('Date of Birth')}
                              error={Boolean(errors.dob)}
                              aria-describedby='validation-basic-dob'
                              {...(errors.dob && { helperText: 'This field is mandatory' })}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='gender'
                      control={control}
                      //  rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e)
                          }}
                          label={t('Gender')}
                        >
                          <MenuItem value='Male'>{t('Male')}</MenuItem>
                          <MenuItem value='Female'>{t('Female')}</MenuItem>
                          <MenuItem value='Other'>{t('Other')}</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='languagePreference'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label={t('Language Preference')}
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e)
                          }}
                        >
                          {languages?.length > 0 ? (
                            languages.map((language, index) => {
                              return (
                                <MenuItem key={index} value={language.category_code}>
                                  <Grid
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'nowrap',
                                      justifyContent: 'flex-start',
                                      alignContent: 'center'
                                    }}
                                  >
                                    <Typography>
                                      <Translations text={language.description} />
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
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='notificationPreference'
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label={t('Notification Preference')}
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e)
                          }}
                        >
                          <MenuItem value='NO'>{t('No')}</MenuItem>
                          <MenuItem value='EMAIL'>{t('Email')}</MenuItem>
                          <MenuItem value='SMS'>{t('Sms')}</MenuItem>
                          <MenuItem value='SMS_AND_EMAIL'>{t('Sms and Email')}</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      pt: theme => `${theme.spacing(6.5)} !important`
                    }}
                  >
                    <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                      <Translations text='Save Changes' />
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TabAccount
