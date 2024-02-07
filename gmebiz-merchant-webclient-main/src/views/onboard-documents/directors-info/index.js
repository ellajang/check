import { useEffect, React, useState } from 'react'
import { Fragment } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import FormModal from './formModal'
import toast from 'react-hot-toast'
import {
  getDirectors,
  deleteDirectors,
  resetOnboarding,
  resetStatus,
  resetOnboardingStatus
} from 'src/store/apps/onboarding'
import { getAllNationalities } from 'src/store/apps/category'
import Translations from 'src/layouts/components/Translations'

const DirectorsInfoView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()

  const { directors, error, loading, message, responseStatus, messageCode } = useSelector(state => state.onboarding)
  const { nationalities, nationalitiesError } = useSelector(state => state.category)
  const [show, setShow] = useState(false)

  const merchantId = auth?.user?.source_id

  //** Hooks

  useEffect(() => {
    dispatch(
      getDirectors({
        function: 'SEARCH',
        scope: 'ALL',
        data: {
          query_params: {
            by: 'MERCHANT_ID',
            value: merchantId
          }
        }
      })
    )
  }, [dispatch, merchantId])

  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY' || messageCode === 'CREATED_SUCCESSFULLY') {
      dispatch(
        getDirectors({
          function: 'SEARCH',
          scope: 'ALL',
          data: {
            query_params: {
              by: 'MERCHANT_ID',
              value: merchantId
            }
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, responseStatus, merchantId])

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

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      console.log('msg sucess', message)
      toast.success(message)
      dispatch(resetOnboardingStatus())
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      console.log('msg success', message)
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const handleShow = () => {
    setShow(prev => !prev)
  }

  const handleEdit = id => {
    dispatch(resetOnboardingStatus())
    Router.push(`/onboarding/documents/directors-info/edit/${id}`)
  }

  const handleDelete = id => {
    dispatch(
      deleteDirectors({
        function: 'DELETE',
        scope: 'SINGLE',
        data: {
          query_params: {
            by: 'MERCHANTS_DIRECTORS_DETAIL_ID',
            value: id
          }
        }
      })
    )
  }

  return (
    <Box className='content-center'>
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
              dispatch(resetOnboarding())
              Router.push('/onboarding/documents')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            Back
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            Update Your Directors Info
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
                Details
              </Typography>
            </Box>
          </Box>

          <Grid item xs={12} sm={12}>
            {directors?.length > 0 &&
              directors.map((director, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    spacing={2}
                    sx={{
                      padding: '16px',
                      minWidth: '20rem',
                      marginBottom: '15px',
                      border: '2px solid #F0F0F0',
                      borderRadius: '8px'
                    }}
                  >
                    <Grid item xs={9} sm={9}>
                      <Typography variant={'h5'}>{director.full_name}</Typography>
                      <Typography color='text.secondary'>
                        {nationalities.length > 0 &&
                        nationalities.find(type => type.category_code === director.nationality)
                          ? nationalities.find(type => type.category_code === director.nationality).description
                          : ''}{' '}
                        {director?.dob ? ', ' + director.dob : ''}
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
                        onClick={() => handleEdit(director.id)}
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
                          handleDelete(director.id)
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
            {show && <FormModal show={show} handleShow={handleShow} />}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default DirectorsInfoView
