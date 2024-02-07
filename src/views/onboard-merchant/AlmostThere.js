import { useEffect, React, Fragment, useState } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

import GMETitle from './GMETitle'

import { updateAlmostThereSelection } from 'src/store/apps/onboarding'
import { getAllMakePaymentPaidType } from 'src/store/apps/category'
import { Alert, CircularProgress, List, ListItem, Typography } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    backgroundColor: '#FAFAFA',
    border: '1px solid #D9D9D9',
    gap: '8px',
    padding: '16px',
    flexWrap: 'nowrap',
    textTransform: 'none',

    '&.Mui-selected': {
      borderLeft: '1px solid #D9D9D9 !important',
      backgroundColor: '#1890ff',
      color: '#FAFAFA'
    },
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #D9D9D9'
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #D9D9D9'
    }
  }
}))

const AlmostThere = ({ handleNext }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()

  const { almostThereSelection } = useSelector(state => state.onboarding)
  const { makePaymentPaidType, makePaymentPaidTypeError, loading } = useSelector(state => state.category)

  const [makePaymentType, setMakePaymentType] = useState(almostThereSelection.makePayment)
  const [getPaidType, setGetPaidType] = useState(almostThereSelection.getPaid)
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** Hooks
  useEffect(() => {
    dispatch(
      getAllMakePaymentPaidType({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            for_one: 'MAKE_PAYMENT,GET_PAID'
          }
        }
      })
    )
  }, [dispatch])

  // const {
  //   control,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: {
  //     makePayment: almostThereSelection.makePayment,
  //     getPaid: almostThereSelection.getPaid
  //   }
  // })

  const handleMakePaymentValue = (event, value) => {
    setMakePaymentType(value)
  }

  const handleGetPaidValue = (event, value) => {
    setGetPaidType(value)
  }

  const onSubmit = () => {
    const data = {
      makePayment: makePaymentType,
      getPaid: getPaidType
    }
    console.log('type', data)

    dispatch(updateAlmostThereSelection(data))

    // Router.push('/onboarding/documents')

    handleNext()
  }

  return (
    <Fragment>
      <Grid container spacing={4}>
        {makePaymentPaidTypeError && (
          <Alert severity='error' sx={{ mb: 4 }}>
            {makePaymentPaidTypeError}
          </Alert>
        )}
        <GMETitle title="You're almost there!" subTitle='Tell us how you will use GMEBiz' />
        {makePaymentPaidType
                  .filter(category => category['category_type'] === 'MAKE_PAYMENT').length !== 0 && <Grid item xs={12} sm={12}>
          <Typography variant='h4'>
            <Translations text='Make Payments' />
          </Typography>
        </Grid>}
        <Grid item xs>
          <StyledToggleButtonGroup
            value={makePaymentType}
            onChange={handleMakePaymentValue}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {makePaymentPaidType?.length > 0
              ? makePaymentPaidType
                  .filter(category => category['category_type'] === 'MAKE_PAYMENT')
                  .map((types, index) => {
                    return (
                      <ToggleButton key={index} value={types.category_code} color='primary'>
                        <Translations text={types.description} />
                        {makePaymentType.find(category => category === types.category_code) ? (
                          <Icon icon='teenyicons:tick-circle-solid' />
                        ) : (
                          <Icon icon='ph:plus-circle-light' />
                        )}
                      </ToggleButton>
                    )
                  })
              : ''}
          </StyledToggleButtonGroup>
        </Grid>
       {
        makePaymentPaidType?.length >0 && makePaymentPaidType
        .filter(category => category['category_type'] === 'GET_PAID').length !==0 && ( <Grid item xs={12} sm={12}>
          <Typography variant='h4'>
            <Translations text='Get Paid' />
          </Typography>
        </Grid>)
       }
        <Grid item xs>
          <StyledToggleButtonGroup
            value={getPaidType}
            onChange={handleGetPaidValue}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
          >
            {makePaymentPaidType?.length > 0
              ? makePaymentPaidType
                  .filter(category => category['category_type'] === 'GET_PAID')
                  .map((types, index) => {
                    return (
                      <ToggleButton key={index} value={types.category_code} color='primary'>
                        <Translations text={types.description} />
                        {getPaidType.find(category => category === types.category_code) ? (
                          <Icon icon='teenyicons:tick-circle-solid' />
                        ) : (
                          <Icon icon='ph:plus-circle-light' />
                        )}
                      </ToggleButton>
                    )
                  })
              : ''}
          </StyledToggleButtonGroup>
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

      <Button disabled={loading} fullWidth onClick={onSubmit} variant='contained' sx={{ mb: 4, mt: 16 }}>
        <Translations text='Continue' />
      </Button>
    </Fragment>
  )
}

export default AlmostThere
