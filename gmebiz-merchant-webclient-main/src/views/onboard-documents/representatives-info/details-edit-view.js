import { useEffect, React, useState } from 'react'
import { Fragment } from 'react'
import Router, { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import {
  createCompanyRepresentative,
  getRepresentatives,
  getDocuments,
  resetOnboardingStatus
} from 'src/store/apps/onboarding'
import { getAllCountries, getAllNationalities, getAllDesignations } from 'src/store/apps/category'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Alert, CircularProgress, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/onboard-merchant/PickersCustomInput'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import getBase64 from 'src/utils/getBase64'
import FallbackSpinner from 'src/layouts/components/spinner'
import CardCommonDocuments from '../common/CardCommonDocuments'
import handleDocumentValidation from '../../../utils/documentValidation'
import subYears from "date-fns/subYears";
import {t} from "i18next";

const DetailsEditView = id => {
  const [baseImage, setBaseImage] = useState('')
  const theme = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const auth = useAuth()

  const { representatives, error, loading, documents, message, responseStatus, messageCode } = useSelector(
    state => state.onboarding
  )

  const { nationalities, localPhoneCode, countries, designationsError, nationalitiesError } = useSelector(
    state => state.category
  )

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
    if (router.isReady)
      dispatch(
        getRepresentatives({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            query_params: {
              by: 'MERCHANTS_REPRESENTATIVES_DETAILS_ID',
              value: router.query.id
            }
          }
        })
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (representatives && representatives.length === 1) {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: representatives[0]?.id,
                association_type: 'REPRESENTATIVE',
                doc_type: 'PERSONAL_ID'
              }
            ]
          }
        })
      )
    }
  }, [dispatch, representatives])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nameEnglish: '',
      nameKorean: '',
      designation: '',
      nationality: '',
      address: '',
      phone: '',
      phoneCode: '',
      idFile: '',
      dob: '',

    }
  })

  useEffect(() => {
    if (representatives) {
      reset({
        nameEnglish: representatives[0]?.full_name ? representatives[0].full_name : '',
        nameKorean: representatives[0]?.full_name_native ? representatives[0].full_name_native : '',
        nationality: representatives[0]?.nationality ? representatives[0].nationality : '',
        address: representatives[0]?.address1 ? representatives[0].address1 : '',
        phone: representatives[0]?.phone_number ? representatives[0].phone_number : '',
        phoneCode: representatives[0]?.phone_code ? representatives[0].phone_code : '',
        dob: representatives[0]?.dob ? new Date(representatives[0].dob) : '',
        idFile: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [representatives, reset])
  //
  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY') {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: representatives[0]?.id,
                association_type: 'REPRESENTATIVE',
                doc_type: 'PERSONAL_ID'
              }
            ]
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, responseStatus])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      if (messageCode === 'UPDATED_SUCCESSFULLY') {
        Router.push('/onboarding/documents/representatives-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const setImage = async (e, onChange) => {
    const file = e.target.files[0]
    const validation = handleDocumentValidation(file)
    if (validation !== true) {
      toast.error(validation)

      return
    }

    const base64 = await getBase64(file)
    onChange(file)
    setBaseImage(base64)
  }

  const watchFile = watch('idFile', '')
  const checkPhoneCode = watch('phoneCode')

  const resetFile = () => {
    setValue('idFile', '')
  }

  const handleClick = id => {
    dispatch(
      getDocuments({
        function: 'DELETE',
        scope: 'SINGLE',
        data: {
          documents: [
            {
              id: id,
              association_id: representatives[0]?.id,
              association_type: 'REPRESENTATIVE',
              doc_type: 'PERSONAL_ID'
            }
          ]
        }
      })
    )
  }

  const onSubmit = data => {
    dispatch(
      createCompanyRepresentative({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchants_representatives_details: [
            {
              ...representatives[0],
              full_name: data.nameEnglish,
              full_name_native: data.nameKorean,
              designation: data.designation,
              nationality: data.nationality,
              address1: data.address,
              phone_code: data.phoneCode,
              phone_number: data.phone,
              dob: data.dob,
              documents: baseImage
                ? [
                    {
                      doc_type: 'PERSONAL_ID',
                      association_type: 'REPRESENTATIVE',
                      doc_name: baseImage.name,
                      file: baseImage.base64
                    }
                  ]
                : undefined
            }
          ]
        }
      })
    )
    // handleNext()
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
              Router.push('/onboarding/documents/representatives-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='CEO Info' />
          </Typography>
        </Box>
        <Box>
          <Fragment>
            <DatePickerWrapper>
              <form onSubmit={handleSubmit(onSubmit)}>
                {nationalitiesError && (
                  <Alert severity='error' sx={{ mb: 4 }}>
                    {nationalitiesError}
                  </Alert>
                )}
                <Grid container spacing={4}>
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
                          {...(errors.nameEnglish && { helperText: <Translations text='This field is mandatory' /> })}
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
                          {...(errors.nameKorean && { helperText: <Translations text='This field is mandatory' /> })}
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
                          {...(errors.address && { helperText: <Translations text='This field is mandatory' /> })}
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
                              fullWidth
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
                            required: { value: true, message: t('This field is mandatory') },
                            pattern: { value: /[0-9]+/i, message: t('Please enter numbers only') },
                            minLength: { value: 10, message: t('Minimum 10 Characters') }
                          }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              type='tel'
                              value={value}
                              onChange={onChange}
                              disabled={!checkPhoneCode}
                              error={Boolean(errors.phone)}
                              placeholder={t('Phone Number')}
                              aria-describedby='stepper-linear-phone-phone'
                              {...(errors.phone && { helperText: errors.phone.message })}
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

                  {getValues('idFile') !== '' && (
                    <CardCommonDocuments handleClick={resetFile} docName={getValues('idFile').name} />
                  )}
                  {documents?.length > 0 &&
                    documents.map(item => {
                      return (
                        <CardCommonDocuments
                          key={item.id}
                          handleClick={() => handleClick(item?.id)}
                          item={item}
                          docName={item?.doc_name}
                        />
                      )
                    })}
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
                  <Translations text='Update' />
                </Button>
              </form>
            </DatePickerWrapper>
          </Fragment>
        </Box>
      </Box>
    </Box>
  )
}

export default DetailsEditView
