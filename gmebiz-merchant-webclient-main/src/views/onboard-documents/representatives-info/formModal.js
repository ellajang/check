import { React, Fragment, forwardRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Alert from '@mui/material/Alert'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast, {Toaster} from 'react-hot-toast'
import getBase64 from 'src/utils/getBase64'

// ** Custom Component Imports

import { useAuth } from 'src/hooks/useAuth'
import GMETitle from 'src/views/onboard-merchant/GMETitle'

import { createCompanyRepresentative } from 'src/store/apps/onboarding'
import { getAllCountries, getAllNationalities, getAllDesignations } from 'src/store/apps/category'
import CardCommonDocuments from "../common/CardCommonDocuments";
import handleDocumentValidation from "../../../utils/documentValidation";
import subYears from "date-fns/subYears";
import CustomInput from "../../onboard-merchant/PickersCustomInput";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

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

const FormModal = ({ show, handleShow }) => {
  const [baseImage, setBaseImage] = useState('')
  const dispatch = useDispatch()
  const auth = useAuth()
  const { t } = useTranslation()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const {  nationalities, countries, designationsError, nationalitiesError, loading } = useSelector(
    state => state.category
  )

  const merchantId = auth?.user?.source_id

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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nameEnglish: '',
      nameKorean: '',
      designation: '',
      nationality: 'KR',
      address: '',
      phone: '',
      phoneCode: '+82',
      idFile: '',
      dob: '',

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
    dispatch(
      createCompanyRepresentative({
        function: 'ADD_DATA',
        scope: 'SINGLE',
        data: {
          merchants_representatives_details: [
            {
              merchant_id: merchantId,
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
    handleShow()
  }

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='sm'
      scroll='body'
      onClose={() => handleShow()}
      TransitionComponent={Transition}
      onBackdropClick={() => handleShow()}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={() => handleShow()}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            {designationsError && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {designationsError}
              </Alert>
            )}
            {nationalitiesError && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {nationalitiesError}
              </Alert>
            )}
            <Grid container spacing={4}>
              <GMETitle
                title={t('CEO Information')}
                subTitle='Please add the information of the CEO'
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
                        minLength: { value: 10, message: t('Please enter a minimum of 10 characters') }
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
                  <Translations text={`Acceptable file size is less than ${Number(process.env.NEXT_PUBLIC_DOCUMENT_LIMIT) ?? 5}MB, jpg, png or pdf`} />
                </Typography>
              </Grid>

              {getValues('idFile') && (
                <CardCommonDocuments
                  handleClick={handleClick}
                  docName={getValues('idFile').name}
                />
              )}
            </Grid>

            <Button disabled={loading} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
              <Translations text='Continue' />
            </Button>
          </form>
        </DatePickerWrapper>
      </DialogContent>
    </Dialog>
  )
}

export default FormModal
