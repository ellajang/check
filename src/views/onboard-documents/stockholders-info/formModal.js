// ** React Imports
import { useEffect, forwardRef, Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/onboard-merchant/PickersCustomInput'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import subYears from 'date-fns/subYears'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { createListOfStockholders } from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import Translations from 'src/layouts/components/Translations'
import getBase64 from 'src/utils/getBase64'
import { useTranslation } from 'react-i18next'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

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
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { nationalities, nationalitiesError, loading } = useSelector(state => state.category)
  const auth = useAuth()

  const merchantId = auth?.user?.source_id

  // ** States
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
  }, [])

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
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

  const setImage = async e => {
    const file = e.target.files[0]
    const base64 = await getBase64(file)
    setBaseImage(base64)
  }

  const handleClick = () => {
    setValue('idFile', '')
  }

  const onSubmit = data => {
    dispatch(
      createListOfStockholders({
        function: 'ADD_DATA',
        scope: 'SINGLE',
        data: {
          merchants_stockholders_details: [
            {
              merchant_id: merchantId,
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
    handleShow()
  }

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='xs'
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
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Stockholders Info'/>
          </Typography>
        </Box>

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
                                {nationality.description}
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
                            setImage(event)
                            onChange(event.target.files[0])
                          }}
                          error={Boolean(errors.idFile)}
                          aria-describedby='stepper-linear-file-upload'
                          {...(errors.id && { helperText: <Translations text='This field is mandatory' /> })}
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
              <Button disabled={loading} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
                <Translations text='Save' />
              </Button>
            </form>
          </DatePickerWrapper>
        </Fragment>
      </DialogContent>
    </Dialog>
  )
}

export default FormModal
