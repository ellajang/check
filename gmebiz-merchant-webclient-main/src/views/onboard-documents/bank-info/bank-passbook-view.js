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
import { getMerchantBanks, createBankDetails, resetOnboardingStatus, getDocuments } from 'src/store/apps/onboarding'

import { Controller, useForm } from 'react-hook-form'

import { styled } from '@mui/material/styles'
import getBase64 from 'src/utils/getBase64'
import FallbackSpinner from 'src/layouts/components/spinner'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CardCommonDocuments from "../common/CardCommonDocuments";
import handleDocumentValidation from "../../../utils/documentValidation";

const validationSchema = yup.object().shape({
  idFile: yup
    .mixed()
    .required('This field is mandatory')
    .test('fileType', 'Unsupported File Format', value =>
      ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(value.type)
    )
})

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

  const { merchantBanks, documents, responseStatus, message, onboardLoading, messageCode } = useSelector(
    state => state.onboarding
  )

  useEffect(() => {
    if (merchantBanks && merchantBanks.length === 0) {
      dispatch(
        getMerchantBanks({
          function: 'SEARCH',
          scope: 'ALL',
          data: {
            query_params: {
              by: 'MERCHANT_ID',
              value: auth?.user?.source_id
            }
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (merchantBanks && merchantBanks.length > 0) {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: merchantBanks[0]?.id,
                association_type: 'BANKDETAILS',
                doc_type: 'BANK_PASSBOOK'
              }
            ]
          }
        })
      )
    }
  }, [dispatch, merchantBanks])

  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY') {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: merchantBanks[0]?.id,
                association_type: 'BANKDETAILS',
                doc_type: 'BANK_PASSBOOK'
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
        Router.push('/onboarding/documents/bank-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      console.log('msg', message)
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
    },
    resolver: yupResolver(validationSchema)
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

  const handleResetDocument = () => {
    setValue('idFile', '')
  }

  const handleClick = id => {
    dispatch(
      getDocuments({
        function: 'DELETE',
        scope: 'SINGLE',
        data: {
          documents: [
            {
              id,
              association_id: merchantBanks[0]?.id,
              association_type: 'BANKDETAILS',
              doc_type: 'BANK_PASSBOOK'
            }
          ]
        }
      })
    )
  }

  const onSubmit = data => {
    merchantBanks?.length > 0 ?
    dispatch(
      createBankDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchants_bank_detail: {
            ...merchantBanks[0],
            documents: baseImage
              ? [
                  {
                    source_id: auth?.user?.source_id,
                    doc_type: 'BANK_PASSBOOK',
                    association_type: 'BANKDETAILS',
                    doc_name: baseImage.name,
                    file: baseImage.base64
                  }
                ]
              : undefined
          }
        }
      })
    ) : toast.error('Bank is not assigned yet')
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
              Router.push('/onboarding/documents/bank-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Bank Passbook Details' />
          </Typography>
        </Box>

        <Box>
          <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>
            <Translations text='Bank Passbook' />
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
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <VisuallyHiddenInput
                        id='idFile'
                        type='file'
                        accept='image/*, application/pdf'
                        value={value?.fileName}
                        onChange={event => {
                          setImage(event, onChange)
                        }}
                        error={Boolean(errors.idFile)}
                        aria-describedby='stepper-linear-file-upload'
                      />
                    )}
                  />
                </Button>
                {errors.idFile && (
                  <Typography color='primary'>
                    <Translations text={errors.idFile.message} />
                  </Typography>
                )}
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
              ) }
              {documents?.length > 0 ? (
               documents.map((item)=>{
                 return (
                   <CardCommonDocuments
                     key={item.id}
                     item={item}
                     handleClick={()=>handleClick(item.id)}
                     docName={item.doc_name}
                   />
                 );
               })
              ) : (
                ''
              )}
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                  <Translations text='Update' />
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
