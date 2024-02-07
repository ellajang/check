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
import { getMerchants, createBusinessDetails, resetOnboardingStatus, getDocuments } from 'src/store/apps/onboarding'

import { Controller, useForm } from 'react-hook-form'

import { styled } from '@mui/material/styles'
import getBase64 from 'src/utils/getBase64'
import FallbackSpinner from 'src/layouts/components/spinner'

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

const IncorporationDocumentView = () => {
  const dispatch = useDispatch()
  const [businessRegImage, setBusinessRegImage] = useState('')
  const [regMatterImage, setRegMatterImage] = useState('')
  const [stampCertificationImage, setStampCertificationImage] = useState('')
  const [licenseImage, setLicenseImage] = useState('')
  const auth = useAuth()

  const { merchants, error, loading, documents, message, responseStatus, messageCode } = useSelector(
    state => state.onboarding
  )

  useEffect(() => {
    if (merchants && merchants.length === 0) {
      dispatch(
        getMerchants({
          function: 'SEARCH',
          scope: 'SINGLE',
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
    dispatch(
      getDocuments({
        function: 'SEARCH',
        scope: 'SINGLE',
        data: {
          documents: [
            {
              association_id: auth?.user?.source_id,
              association_type: 'MERCHANT'
            }
          ]
        }
      })
    )
  }, [dispatch, auth?.user?.source_id])

  useEffect(() => {
    if (messageCode === 'DELETED_SUCCESSFULLY') {
      dispatch(
        getDocuments({
          function: 'SEARCH',
          scope: 'SINGLE',
          data: {
            documents: [
              {
                association_id: auth?.user?.source_id,
                association_type: 'MERCHANT'
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
        Router.push('/onboarding/documents/business-info')
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
      idFileBizReg: '',
      idFileRegMatter: '',
      idFileStamp: '',
      idFileLicense: ''
    }
  })

  const getImage = async file => {
    // const file = e.target.files[0]
    const base64 = await getBase64(file)
    // setBaseImage(base64)

    return base64
  }

  const watchFileBizReg = watch('idFileBizReg', '')
  const watchFileRegMatter = watch('idFileRegMatter', '')
  const watchFileStamp = watch('idFileStamp', '')
  const watchFileLicense = watch('idFileLicense', '')

  const handleClick = data => {
    dispatch(
      getDocuments({
        function: 'DELETE',
        scope: 'SINGLE',
        data: {
          documents: [
            {
              id: data?.id,
              association_id: data?.association_id,
              association_type: data?.association_type,
              doc_type: data?.doc_type
            }
          ]
        }
      })
    )
  }

  const onSubmit = data => {
    const docs = []
    data.idFileBizReg &&
      docs.push({
        source_id: auth?.user?.source_id,
        doc_type: 'CERTIFICATE_OF_BUSINESS_REGISTRATION',
        association_type: 'MERCHANT',
        doc_name: data.idFileBizReg.name,
        file: businessRegImage.base64
      })
    data.idFileRegMatter &&
      docs.push({
        source_id: auth?.user?.source_id,
        doc_type: 'CERTIFICATE_OF_REGISTERED_MATTERS',
        association_type: 'MERCHANT',
        doc_name: data.idFileRegMatter.name,
        file: regMatterImage.base64
      })
    data.idFileStamp &&
      docs.push({
        source_id: auth?.user?.source_id,
        doc_type: 'CORPORATE_STAMP_CERTIFICATION',
        association_type: 'MERCHANT',
        doc_name: data.idFileStamp.name,
        file: stampCertificationImage.base64
      })
    data.idFileLicense &&
      docs.push({
        source_id: auth?.user?.source_id,
        doc_type: 'REGULATORY_LICENSES_AND_PERMITS',
        association_type: 'MERCHANT',
        doc_name: data.idFileLicense.name,
        file: licenseImage.base64
      })

    dispatch(
      createBusinessDetails({
        function: 'UPDATE_DATA',
        scope: 'SINGLE',
        data: {
          merchant: {
            ...merchants[0],
            documents: docs.length > 0 ? docs : undefined
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
              Router.push('/onboarding/documents/business-info')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='A certificate of Incorporation' />
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} sx={{ m: 0 }}>
            <Grid item xs={12}>
              <Grid container spacing={3} sx={{ m: 0 }}>
                <Grid item xs={12} sm={12}>
                  <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>
                    <Translations text='Certificate of Business Registration' />
                  </Typography>
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
                      name='idFileBizReg'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <VisuallyHiddenInput
                          id='idFileBizReg'
                          type='file'
                          value={value?.fileName}
                          onChange={async (event) => {
                            const file = event.target.files[0]
                            const base64 = await getBase64(file)
                            setBusinessRegImage(base64)
                            onChange(event.target.files[0])
                          }}
                          error={Boolean(errors.idFileBizReg)}
                          aria-describedby='stepper-linear-file-upload'
                          {...(errors.idFileBizReg && { helperText: <Translations text='This field is mandatory' /> })}
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
                {watchFileBizReg !== '' && (
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
                        padding: '9px 8px 9px 8px',
                        m: 0
                      }}
                    >
                      <Grid item xs={2}>
                        <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography color='#1890FF'>{getValues('idFileBizReg').name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          onClick={() => {
                            setValue('idFileBizReg', '')
                          }}
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
                ) }

                {documents &&
                  documents.filter(doc => doc.doc_type === 'CERTIFICATE_OF_BUSINESS_REGISTRATION').length > 0 ? (
                  documents.filter(doc => doc.doc_type === 'CERTIFICATE_OF_BUSINESS_REGISTRATION').map(item=>{
                    return (
                      <Grid key={item.id} item xs={12} sm={12}>
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
                            padding: '9px 8px 9px 8px',
                            m: 0
                          }}
                        >
                          <Grid item xs={2}>
                            <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography color='#1890FF'>
                              {item.doc_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              onClick={() =>
                                handleClick(
                                  item
                                )
                              }
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
                    );
                  })
                ) : (
                  ''
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={3} sx={{ m: 0 }}>
                <Grid item xs={12} sm={12}>
                  <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>
                    <Translations text='Certificate of Registered Matters' />
                  </Typography>
                  {/*<Typography color='common.black' sx={{ mb: 3, opacity: 0.85 }}>*/}
                  {/*  <Translations text='We may require a physical document to verify' />*/}
                  {/*</Typography>*/}
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
                      name='idFileRegMatter'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <VisuallyHiddenInput
                          id='idFileRegMatter'
                          type='file'
                          value={value?.fileName}
                          onChange={async (event) => {
                            const file = event.target.files[0]
                            const base64 = await getBase64(file)
                            setRegMatterImage(base64)
                            onChange(event.target.files[0])
                          }}
                          error={Boolean(errors.idFileRegMatter)}
                          aria-describedby='stepper-linear-file-upload'
                          {...(errors.idFileRegMatter && {
                            helperText: <Translations text='This field is mandatory' />
                          })}
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

                {watchFileRegMatter !== '' && (
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
                        padding: '9px 8px 9px 8px',
                        m: 0
                      }}
                    >
                      <Grid item xs={2}>
                        <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography color='#1890FF'>{getValues('idFileRegMatter').name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          onClick={() => {
                            setValue('idFileRegMatter', '')
                          }}
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
                { documents?.length > 0 &&
                  documents.filter(doc => doc.doc_type === 'CERTIFICATE_OF_REGISTERED_MATTERS').length > 0 ? (
                  documents.filter(doc => doc.doc_type === 'CERTIFICATE_OF_REGISTERED_MATTERS').map(item=>{
                    return (
                      <Grid key={item.id} item xs={12} sm={12}>
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
                            padding: '9px 8px 9px 8px',
                            m: 0
                          }}
                        >
                          <Grid item xs={2}>
                            <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography color='#1890FF'>
                              {item.doc_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              onClick={() =>
                                handleClick(
                                  item
                                )
                              }
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
                    );
                  })
                ) : (
                  ''
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={3} sx={{ m: 0 }}>
                <Grid item xs={12} sm={12}>
                  <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>
                    <Translations text='Corporate Stamp Certification' />
                  </Typography>
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
                      name='idFileStamp'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <VisuallyHiddenInput
                          id='idFileStamp'
                          type='file'
                          value={value?.fileName}
                          onChange={async (event) => {
                            const file = event.target.files[0]
                            const base64 = await getBase64(file)
                            setStampCertificationImage(base64)
                            onChange(event.target.files[0])
                          }}
                          error={Boolean(errors.idFileStamp)}
                          aria-describedby='stepper-linear-file-upload'
                          {...(errors.idFileStamp && { helperText: <Translations text='This field is mandatory' /> })}
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

                {watchFileStamp !== '' && (
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
                        padding: '9px 8px 9px 8px',
                        m: 0
                      }}
                    >
                      <Grid item xs={2}>
                        <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography color='#1890FF'>{getValues('idFileStamp').name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          onClick={() => {
                            setValue('idFileStamp', '')
                          }}
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
                {documents?.length > 0 &&
                  documents.filter(doc => doc.doc_type === 'CORPORATE_STAMP_CERTIFICATION').length > 0 ? (
                  documents.filter(doc => doc.doc_type === 'CORPORATE_STAMP_CERTIFICATION').map(item=>{
                    return (
                      <Grid key={item.id} item xs={12} sm={12}>
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
                            padding: '9px 8px 9px 8px',
                            m: 0
                          }}
                        >
                          <Grid item xs={2}>
                            <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography color='#1890FF'>
                              {item.doc_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              onClick={() =>
                                handleClick(item)
                              }
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
                    );
                  })
                ) : (
                  ''
                )}
              </Grid>

              <Grid item xs={12}>
              {/*  <Grid container spacing={3} sx={{ m: 0 }}>*/}
              {/*    <Grid item xs={12} sm={12}>*/}
              {/*      <Typography color='common.black' variant='h4' sx={{ mb: 3, opacity: 0.85 }}>*/}
              {/*        <Translations text='License' />*/}
              {/*      </Typography>*/}
              {/*    </Grid>*/}
              {/*    <Grid item xs={12} sm={12}>*/}
              {/*      <Button*/}
              {/*        component='label'*/}
              {/*        variant='contained'*/}
              {/*        sx={{ bgcolor: '#fff', color: 'text.primary' }}*/}
              {/*        startIcon={<Icon icon='material-symbols:upload' />}*/}
              {/*      >*/}
              {/*        <Translations text='Upload ID Copy' />*/}
              {/*        <Controller*/}
              {/*          name='idFileLicense'*/}
              {/*          control={control}*/}
              {/*          rules={{ required: false }}*/}
              {/*          render={({ field: { value, onChange } }) => (*/}
              {/*            <VisuallyHiddenInput*/}
              {/*              id='idFileLicense'*/}
              {/*              type='file'*/}
              {/*              value={value?.fileName}*/}
              {/*              onChange={async (event) => {*/}
              {/*                const file = event.target.files[0]*/}
              {/*                const base64 = await getBase64(file)*/}
              {/*                setLicenseImage(base64)*/}
              {/*                onChange(event.target.files[0])*/}
              {/*              }}*/}
              {/*              error={Boolean(errors.idFileLicense)}*/}
              {/*              aria-describedby='stepper-linear-file-upload'*/}
              {/*              {...(errors.idFileLicense && {*/}
              {/*                helperText: <Translations text='This field is mandatory' />*/}
              {/*              })}*/}
              {/*            />*/}
              {/*          )}*/}
              {/*        />*/}
              {/*      </Button>*/}
              {/*    </Grid>*/}

              {/*    <Grid item xs={12} sm={12}>*/}
              {/*      <Typography sx={{ color: 'text.disabled' }}>*/}
              {/*        <Translations text='Acceptable file size is less than 5MB, jpg, png or pdf' />*/}
              {/*      </Typography>*/}
              {/*    </Grid>*/}

              {/*    {watchFileLicense !== '' && (*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <Grid*/}
              {/*          container*/}
              {/*          spacing={2}*/}
              {/*          sx={{*/}
              {/*            display: 'flex',*/}
              {/*            flexWrap: 'wrap',*/}
              {/*            alignItems: 'center',*/}
              {/*            height: '66px',*/}
              {/*            border: `1px solid `,*/}
              {/*            borderColor: 'secondary.main',*/}
              {/*            padding: '9px 8px 9px 8px',*/}
              {/*            m: 0*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          <Grid item xs={2}>*/}
              {/*            <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={8}>*/}
              {/*            <Typography color='#1890FF'>{getValues('idFileLicense').name}</Typography>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={2}>*/}
              {/*            <Button*/}
              {/*              onClick={() => {*/}
              {/*                setValue('idFileLicense', '')*/}
              {/*              }}*/}
              {/*              sx={{*/}
              {/*                '&:hover': {*/}
              {/*                  background: '#fff'*/}
              {/*                }*/}
              {/*              }}*/}
              {/*            >*/}
              {/*              <Icon color='#1890FF' icon='ant-design:delete-outlined' width='14' height='14' />*/}
              {/*            </Button>*/}
              {/*          </Grid>*/}
              {/*        </Grid>*/}
              {/*      </Grid>*/}
              {/*    )}*/}
              {/*    {documents?.length > 0 &&*/}
              {/*      documents.filter(doc => doc.doc_type === 'REGULATORY_LICENSES_AND_PERMITS').length > 0 ? (*/}
              {/*      documents.filter(doc => doc.doc_type === 'REGULATORY_LICENSES_AND_PERMITS').map(item=>{*/}
              {/*        return (*/}
              {/*          <Grid key={item.id} item xs={12} sm={12}>*/}
              {/*            <Grid*/}
              {/*              container*/}
              {/*              spacing={2}*/}
              {/*              sx={{*/}
              {/*                display: 'flex',*/}
              {/*                flexWrap: 'wrap',*/}
              {/*                alignItems: 'center',*/}
              {/*                height: '66px',*/}
              {/*                border: `1px solid `,*/}
              {/*                borderColor: 'secondary.main',*/}
              {/*                padding: '9px 8px 9px 8px',*/}
              {/*                m: 0*/}
              {/*              }}*/}
              {/*            >*/}
              {/*              <Grid item xs={2}>*/}
              {/*                <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />*/}
              {/*              </Grid>*/}
              {/*              <Grid item xs={8}>*/}
              {/*                <Typography color='#1890FF'>*/}
              {/*                  {item.doc_name}*/}
              {/*                </Typography>*/}
              {/*              </Grid>*/}
              {/*              <Grid item xs={2}>*/}
              {/*                <Button*/}
              {/*                  onClick={() =>*/}
              {/*                    handleClick(*/}
              {/*                      item*/}
              {/*                    )*/}
              {/*                  }*/}
              {/*                  sx={{*/}
              {/*                    '&:hover': {*/}
              {/*                      background: '#fff'*/}
              {/*                    }*/}
              {/*                  }}*/}
              {/*                >*/}
              {/*                  <Icon color='#1890FF' icon='ant-design:delete-outlined' width='14' height='14' />*/}
              {/*                </Button>*/}
              {/*              </Grid>*/}
              {/*            </Grid>*/}
              {/*          </Grid>*/}
              {/*        );*/}
              {/*      })*/}
              {/*    ) : (*/}
              {/*      ''*/}
              {/*    )}*/}
              {/*  </Grid>*/}
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(10)} !important` }}>
                  <Button type='submit' variant='contained' sx={{ width: '100%' }}>
                    <Translations text='Update'/>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  )
}

export default IncorporationDocumentView
