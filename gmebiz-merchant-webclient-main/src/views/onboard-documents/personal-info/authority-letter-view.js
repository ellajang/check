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

import Translations from 'src/layouts/components/Translations'

import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  getMerchantPersonalDetails,
  resetOnboardingStatus,
  getDocuments,
  createPersonalDetails
} from 'src/store/apps/onboarding'

import { Controller, useForm } from 'react-hook-form'

import { styled } from '@mui/material/styles'
import getBase64 from 'src/utils/getBase64'
import FallbackSpinner from 'src/layouts/components/spinner'
import CardCommonDocuments from "../common/CardCommonDocuments";
import handleDocumentValidation from "../../../utils/documentValidation";

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

const AuthorityLetterView = () => {
  const dispatch = useDispatch()
  const [baseImage, setBaseImage] = useState('')
  const auth = useAuth()

  const { merchantPersonalDetails, documents, responseStatus, message, onboardLoading, messageCode } = useSelector(
    state => state.onboarding
  )

  useEffect(() => {
    dispatch(
      getMerchantPersonalDetails({
        function: 'SEARCH',
        scope: 'SINGLE'
      })
    )
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getDocuments({
        function: 'SEARCH',
        scope: 'SINGLE',
        data: {
          documents: [
            {
              association_id: merchantPersonalDetails?.id,
              association_type: 'MERCHANT_USER',
              doc_type: 'LETTER_OF_AUTHORITY'
            }
          ]
        }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, merchantPersonalDetails])

  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY') {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: merchantPersonalDetails?.id,
                association_type: 'MERCHANT_USER',
                doc_type: 'LETTER_OF_AUTHORITY'
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
        Router.push('/onboarding/documents/personal-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      idFile: ''
    }
  })

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

  const watchFile = watch('idFile', '')

  const handleResetDocument = ()=> {
    setValue('idFile', '')
  }

  const handleClick = (id) => {
      dispatch(
        getDocuments({
          function: 'DELETE',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                id,
                association_id: merchantPersonalDetails?.id,
                association_type: 'MERCHANT_USER',
                doc_type: 'LETTER_OF_AUTHORITY'
              }
            ]
          }
        })
      )
  }

  const onSubmit = data => {
    dispatch(
      createPersonalDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          user: {
            ...merchantPersonalDetails,
            documents: baseImage
              ? [
                  {
                    source_id: auth?.user?.source_id,
                    doc_type: 'LETTER_OF_AUTHORITY',
                    association_type: 'MERCHANT_USER',
                    doc_name: baseImage.name,
                    file: baseImage.base64
                  }
                ]
              : undefined
          }
        }
      })
    )
    // handleNext()
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
              Router.push('/onboarding/documents/personal-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Authorization letter from your company' />
          </Typography>
        </Box>

        <Box>
          <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>
            <Translations text='Letter of Authority' />
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
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
                <CardCommonDocuments
                  handleClick={handleResetDocument}
                  docName={getValues('idFile').name}
                />
              )}

              {documents?.length > 0 && (
               documents?.map((item)=> {
                 return (
                   <CardCommonDocuments
                     key={item.id}
                     handleClick={()=>handleClick(item.id)}
                     item={item}
                     docName={item?.doc_name}
                   />
                 );
               })
              )}
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthorityLetterView
