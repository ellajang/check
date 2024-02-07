import { useEffect, React } from 'react'
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
import subYears from 'date-fns/subYears'

import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import { getDirectors, createListOfDirectors, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Alert, CircularProgress, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/onboard-merchant/PickersCustomInput'
import FallbackSpinner from 'src/layouts/components/spinner'

function DetailsEditView() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const auth = useAuth()

  const { directors, error, message, responseStatus, messageCode } = useSelector(state => state.onboarding)
  const { nationalities, nationalitiesError, loading } = useSelector(state => state.category)

  const merchantId = auth?.user?.source_id

  //** Hooks
  useEffect(() => {
    if (router.query.id) {
      dispatch(
        getDirectors({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            query_params: {
              by: 'MERCHANTS_DIRECTORS_DETAILS_ID',
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
  }, [dispatch])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      nationality: '',
      pos: ''
    }
  })

  useEffect(() => {
    if (nationalities && directors) {
      reset({
        name: directors[0]?.full_name ? directors[0]?.full_name : '',
        nationality: directors[0]?.nationality ? directors[0]?.nationality : '',
        dob: directors[0]?.dob ? new Date(directors[0].dob) : ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directors, reset])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      if (messageCode === 'UPDATED_SUCCESSFULLY') {
        Router.push('/onboarding/documents/directors-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      console.log('msg', message)
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, responseStatus])

  const onSubmit = data => {
    dispatch(
      createListOfDirectors({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchants_directors_details: [
            {
              ...directors[0],
              full_name: data.name,
              nationality: data.nationality,
              dob: data.dob
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
              router.push('/onboarding/documents/directors-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            Back
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            Directors Info
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
                  Update
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
