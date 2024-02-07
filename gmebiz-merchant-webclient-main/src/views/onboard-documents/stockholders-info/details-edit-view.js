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
  getStockholders,
  createListOfStockholders,
  resetOnboardingStatus,
  getDocuments
} from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Alert, CircularProgress, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/onboard-merchant/PickersCustomInput'
import Translations from 'src/layouts/components/Translations'
import { styled } from '@mui/material/styles'
import getBase64 from 'src/utils/getBase64'
import subYears from 'date-fns/subYears'
import FallbackSpinner from 'src/layouts/components/spinner'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CardCommonDocuments from '../common/CardCommonDocuments'
import handleDocumentValidation from '../../../utils/documentValidation'
import { t } from 'i18next'

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

const DetailsEditView = id => {
  const [baseImage, setBaseImage] = useState('')
  const theme = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const auth = useAuth()

  const { stockholders, error, documents, onboardLoading, message, responseStatus, messageCode } = useSelector(
    state => state.onboarding
  )
  const { nationalities, nationalitiesError, loading } = useSelector(state => state.category)

  const merchantId = auth?.user?.source_id

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
    if (router?.query?.id) {
      dispatch(
        getStockholders({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            query_params: {
              by: 'MERCHANTS_STOCKHOLDERS_DETAILS_ID',
              value: router.query.id
            }
          }
        })
      )
    }
  }, [dispatch, router.query.id])

  useEffect(() => {
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
    if (stockholders && stockholders.length === 1) {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: stockholders[0]?.id,
                association_type: 'STOCKHOLDER',
                doc_type: 'PERSONAL_ID'
              }
            ]
          }
        })
      )
    }
  }, [dispatch, stockholders])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(stockSchema),
    defaultValues: {
      name: '',
      nationality: '',
      dob: '',
      pos: '',
      idFile: ''
    }
  })

  useEffect(() => {
    if (stockholders) {
      reset({
        name: stockholders[0]?.full_name ? stockholders[0]?.full_name : '',
        nationality: stockholders[0]?.nationality ? stockholders[0]?.nationality : '',
        dob: stockholders[0]?.dob ? new Date(stockholders[0].dob) : '',
        pos: stockholders[0]?.percentage_of_share ? stockholders[0]?.percentage_of_share : '',
        idFile: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockholders, reset])

  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY') {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: stockholders[0]?.id,
                association_type: 'STOCKHOLDER',
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
        Router.push('/onboarding/documents/stockholders-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      console.log('msg', message)
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, responseStatus])

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

  const handleResetDocument = () => {
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
              id,
              association_id: stockholders[0]?.id,
              association_type: 'STOCKHOLDER',
              doc_type: 'PERSONAL_ID'
            }
          ]
        }
      })
    )
  }

  const onSubmit = data => {
    dispatch(
      createListOfStockholders({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchants_stockholders_details: [
            {
              ...stockholders[0],
              full_name: data.name,
              nationality: data.nationality,
              dob: data.dob,
              percentage_of_share: data.pos,
              documents: baseImage
                ? [
                    {
                      doc_type: 'PERSONAL_ID',
                      association_type: 'STOCKHOLDER',
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
              Router.push('/onboarding/documents/stockholders-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Stockholders Info' />
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
                                  {t(nationality.description)}
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
                    <CardCommonDocuments handleClick={handleResetDocument} docName={getValues('idFile')?.name} />
                  )}

                  {documents?.length > 0
                    ? documents.map(item => {
                        return (
                          <CardCommonDocuments
                            key={item.id}
                            handleClick={() => handleClick(item?.id)}
                            item={item}
                            docName={item?.doc_name}
                          />
                        )
                      })
                    : ''}
                </Grid>

                {loading ||
                  (onboardLoading && (
                    <Grid
                      item
                      xs
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignContent: 'center',
                        mt: 10
                      }}
                    >
                      <FallbackSpinner />
                    </Grid>
                  ))}

                <Button
                  disabled={loading || onboardLoading}
                  fullWidth
                  type='submit'
                  variant='contained'
                  sx={{ mb: 4, mt: 16 }}
                >
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
