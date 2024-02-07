import { React, Fragment, useState, useEffect } from 'react'

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

import { resetListOfStockholders, updateListOfDirectors } from 'src/store/apps/onboarding'
import FormModalDirector from './FormModalDirector'

const StepDirectorsList = ({ handleNext, handleBack }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()

  const [show, setShow] = useState(false)
  const [editData, setEditData] = useState({})
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const onboarding = useSelector(state => state.onboarding)
  const { listOfDirectors } = onboarding

  const { nationalities, error, loading } = useSelector(state => state.category)

  const handleDelete = id => {
    console.log('id', id)
    const updateData = listOfDirectors.filter(data => data.id !== id)
    console.log('dat', updateData)
    dispatch(updateListOfDirectors(updateData))
  }

  const handleEdit = rep => {
    console.log('rep', rep)
    setEditData(rep)
    setShow(prev => !prev)
  }

  const handleClick = () => handleNext()

  const handleShow = () => {
    setShow(prev => !prev)
  }

  return (
    <Fragment>
      <Grid container spacing={4}>
        <GMETitle
          title='List of Directors'
          subTitle='Please list the name (s) of Director (s) or Authorative Signatory (ies)'
        />
        <Grid item xs={12} sm={12}>
          {listOfDirectors?.length > 0 &&
            listOfDirectors.map((rep, index) => {
              return (
                <Grid
                  container
                  key={index}
                  spacing={2}
                  sx={{ padding: '16px', border: '2px solid #F0F0F0', borderRadius: '8px' }}
                >
                  <Grid item xs={9} sm={9}>
                    <Typography variant={'h5'}> {rep.name} </Typography>
                    <Typography color='text.secondary'>
                      {' '}
                      {nationalities.length > 0 && nationalities.find(type => type.category_code === rep.nationality)
                        ? nationalities.find(type => type.category_code === rep.nationality).description
                        : ''}{' '}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Button
                      onClick={() => handleEdit(rep)}
                      sx={{
                        padding: 0,
                        minWidth: '30px',
                        '&:hover': {
                          background: '#fff'
                        }
                      }}
                    >
                      <Icon color='#1890FF' icon='ant-design:edit-twotone' />
                    </Button>
                    <Button
                      onClick={() => {
                        handleDelete(rep.id)
                      }}
                      sx={{
                        padding: 0,
                        minWidth: '30px',
                        '&:hover': {
                          background: '#fff'
                        }
                      }}
                    >
                      <Icon color='#1890FF' icon='ant-design:delete-outlined' />
                    </Button>
                  </Grid>
                </Grid>
              )
            })}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}
        >
          <Icon color='red' icon='ant-design:plus-circle-twotone' />
          <Button
            onClick={handleShow}
            sx={{
              '&:hover': {
                background: '#fff'
              }
            }}
          >
            <Typography color='primary' sx={{ fontWeight: '700' }}>
              <Translations text='Add Directors' />
            </Typography>
          </Button>
          {show && <FormModalDirector editData={editData} show={show} handleShow={handleShow} />}
        </Grid>
      </Grid>

      <Button fullWidth onClick={handleClick} variant='contained' sx={{ mb: 4, mt: 16 }}>
        <Translations text='Continue' />
      </Button>
    </Fragment>
  )
}

export default StepDirectorsList
