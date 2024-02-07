// ** React Imports
import { useEffect, forwardRef, Fragment } from 'react'
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
import toast from 'react-hot-toast'
import subYears from 'date-fns/subYears'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { createListOfDirectors, createListOfStockholders } from 'src/store/apps/onboarding'

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

const FormModal = ({ show, handleShow }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { stockholders, error, loading, message, responseStatus } = useSelector(state => state.onboarding)
  const { nationalities, nationalitiesError } = useSelector(state => state.category)
  const auth = useAuth()

  const merchantId = auth?.user?.source_id

  // ** States

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      nationality: '',
      dob: ''
    }
  })

  const onSubmit = data => {
    dispatch(
      createListOfDirectors({
        function: 'ADD_DATA',
        scope: 'SINGLE',
        data: {
          merchants_directors_details: [
            {
              merchant_id: merchantId,
              full_name: data.name,
              nationality: data.nationality,
              dob: data.dob
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
            Directors Info
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
                        placeholder='Name'
                        error={Boolean(errors.name)}
                        aria-describedby='validation-name'
                        {...(errors.name && { helperText: 'This field is required' })}
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
                        {...(errors.nationality && { helperText: 'This field is required' })}
                        sx={{
                          '& .MuiSelect-select .notranslate::after': 'Nationality'
                            ? {
                                content: `"Nationality"`,
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
                        placeholderText='Date of Birth'
                        popperPlacement={popperPlacement}
                        onChange={onChange}
                        customInput={
                          <CustomInput
                            fullWidth
                            icon='uil:calender'
                            error={Boolean(errors.dob)}
                            aria-describedby='validation-date-of-birth'
                            {...(errors.dob && { helperText: 'This field is required' })}
                          />
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button disabled={loading} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 16 }}>
                Add Director
              </Button>
            </form>
          </DatePickerWrapper>
        </Fragment>
      </DialogContent>
    </Dialog>
  )
}

export default FormModal
