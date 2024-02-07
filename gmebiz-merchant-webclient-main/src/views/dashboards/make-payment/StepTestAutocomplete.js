// ** React Imports
import { Fragment, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { Autocomplete, Stack, TextField } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Icon Imports

// ** Custom Components Imports

import CustomTextField from 'src/@core/components/mui/text-field'
import { getAllCountries, getAllBanks } from 'src/store/apps/category'

// ** Redux Toolkit
import { updateRecipientDetails } from 'src/store/apps/payment'

import GMETitle from './GMETitle'

import { top100Films } from 'src/configs/testFilms'

const schema = yup.object().shape({
  fruit: yup.string().required('Fruit is required')
})

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' }
]

export const StepRecipientDetails = ({ handleBack, handleNext }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // ** Hooks
  const {
    control: control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    // console.log('errors', errors)
    console.log('recipeint details log', data)
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <GMETitle
            title='Recipient Details'
            subTitle='Enter the details of your recipient’s business and bank account'
          />

          <Grid item xs={12} sm={12}>
            <Controller
              name='fruit'
              control={control}
              defaultValue='apple'
              render={({ field, fieldState }) => (
                <CustomAutocomplete
                  {...field}
                  name='fruit'
                  // onChange={(event, value) => console.log(value)}
                  options={fruits}
                  id='autocomplete-custom'
                  getOptionLabel={option => option.label || ''}
                  renderInput={params => <CustomTextField {...params} label='Movie Names' />}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
      </form>
    </Fragment>
  )
}
