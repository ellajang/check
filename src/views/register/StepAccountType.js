// ** React Imports
import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Fragment } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

import GoBackButton from './GoBackButton'
import GMETitle from './GMETitle'

// ** Demo Components Imports
import CustomRadioBasic from 'src/layouts/components/custom-radio/basic'

import { resetRegisterState, setBusinessForm, updateBusinessForm } from 'src/store/apps/register'
import { resetCategoryState } from 'src/store/apps/category'

// ** Custom Component Import
import Translations from 'src/layouts/components/Translations'

const data = [
  {
    title: 'Business',
    value: 'BUSINESS',
    isSelected: true,
    content: 'For users representing a business or company.'
  }
  // {
  //   title: 'Individual',
  //   value: 'INDIVIDUAL',
  //   content: 'For users representing engaging in freelancing activities.'
  // }
]

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const StepAccountDetails = ({ handlePrev, handleNext }) => {
  const dispatch = useDispatch()

  // accountType from store
  const businessType = useSelector(store => store.register.accountType)

  const defaultValues = {
    businessType: businessType,
    checkbox: false
  }

  const onSubmit = data => {
    dispatch(updateBusinessForm(data.businessType))
    handleNext()
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  useEffect(() => {
    dispatch(resetRegisterState())
    dispatch(resetCategoryState())
  }, [dispatch])

  return (
    <>
      <GoBackButton handlePrev={handlePrev} />
      <GMETitle title='Select your Account Type' />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction='column' spacing={4} sx={{ mb: 16 }}>
          <Controller
            name='businessType'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
              <Fragment>
                {data.map((singleOption, index) => (
                  <CustomRadioBasic
                    key={index}
                    // data={data[index]}
                    data={singleOption}
                    selected={value}
                    handleChange={onChange}
                    gridProps={{ sm: 6, xs: 12 }}
                  />
                ))}
              </Fragment>
            )}
          />
        </Grid>

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
          <FormControl>
            <Controller
              name='checkbox'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  label={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', pt: 4 }}>
                      <Typography sx={{ color: 'text.grey' }} variant='body2'>
                        <Translations text='I agree to the' />
                      </Typography>
                      <Typography
                        component={LinkStyled}
                        href='/'
                        onClick={e => e.preventDefault()}
                        sx={{ ml: 1, mr: 1 }}
                        variant='body2'
                      >
                        <Translations text='Terms and Conditions' />
                      </Typography>
                      <Typography sx={{ color: 'text.grey', mr: 1 }} variant='body2'>
                        <Translations text='of Usage of Service and' />
                      </Typography>

                      <Typography
                        component={LinkStyled}
                        href='/'
                        onClick={e => e.preventDefault()}
                        sx={{ ml: 1 }}
                        variant='body2'
                      >
                        <Translations text='Privacy Policy' />
                      </Typography>
                    </Box>
                  }
                  sx={errors.checkbox ? { color: 'error.main' } : null}
                  control={
                    <Checkbox
                      {...field}
                      name='validation-basic-checkbox'
                      color='secondary'
                      // sx={errors.checkbox ? { color: "error.main" } : null}
                    />
                  }
                />
              )}
            />
            {errors.checkbox && (
              <FormHelperText
                id='validation-basic-checkbox'
                sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
              >
                <Translations text='Please Agree to our Terms & Conditions before proceeding.' />
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <Controller
              name='checkboxMarketingConsent'
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <FormControlLabel
                  label={
                    <Typography sx={{ color: 'text.grey' }} variant='body2'>
                      <Translations text='I agree to receive marketing and promotional emails from GMEBiz.' />
                    </Typography>
                  }
                  sx={errors.checkboxMarketingConsent ? { color: 'error.main' } : null}
                  control={
                    <Checkbox
                      {...field}
                      name='validation-basic-checkboxMarketingConsent'
                      color='secondary'
                      // sx={errors.checkbox ? { color: "error.main" } : null}
                    />
                  }
                />
              )}
            />
            {errors.checkboxMarketingConsent && (
              <FormHelperText
                id='validation-basic-checkbox'
                sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
              ></FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Translations text='Continue' />
        </Button>
      </form>
    </>
  )
}

export default StepAccountDetails
