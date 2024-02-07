import { useEffect, React } from 'react'
import { Fragment } from 'react'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import { getMerchantPersonalDetails, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { getAllCountries } from 'src/store/apps/category'

const PersonalInfoView = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()

  const { merchantPersonalDetails, error, loading, message, responseStatus, messageCode } = useSelector(
    state => state.onboarding
  )
  const { countries, countryError, businessTypes, businessTypeError } = useSelector(state => state.category)

  const merchantId = auth?.user?.id

  useEffect(() => {
    dispatch(
      getMerchantPersonalDetails({
        function: 'SEARCH',
        scope: 'SINGLE'
      })
    ).then(() =>
      dispatch(
        getAllCountries({
          function: 'SEARCH',
          scope: 'BYKEYWORD',
          data: {
            query_params: {
              for_one: 'COUNTRY'
            }
          }
        })
      )
    )
  }, [dispatch])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      console.log('msgcode', messageCode)
      toast.success(message)
      dispatch(resetOnboardingStatus())
    } else if (messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && message) {
      console.log('msg', message)
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const country =
    countries?.length > 0 &&
    merchantPersonalDetails &&
    merchantPersonalDetails?.country &&
    countries.find(country => country.country_code === merchantPersonalDetails?.country)
      ? countries.find(country => country.country_code === merchantPersonalDetails?.country).country
      : ''

  const personalInfoData = [
    {
      title: 'Full Name',
      avatarIcon: 'ph:user',
      subTitle:
        (merchantPersonalDetails?.full_name ? merchantPersonalDetails.full_name : '') +
        (merchantPersonalDetails?.full_name_native ? '(' + merchantPersonalDetails.full_name_native + ')' : '')
    },
    {
      title: 'Date of Birth',
      avatarIcon: 'ant-design:idcard-outlined',
      subTitle: merchantPersonalDetails?.dob ? merchantPersonalDetails.dob : ''
    },
    {
      title: 'Country',
      avatarIcon: 'ant-design:global-outlined',
      subTitle: country
    }
  ]

  const renderData = () => {
    return personalInfoData.map((item, index) => {
      return (
        <IdentityCard
          key={index}
          title={item.title}
          subTitle={item.subTitle}
          avatarIcon={item.avatarIcon}
          secLink={`/onboarding/documents/personal-info/edit`}
        />
      )
    })
  }

  const renderAuthorityLetter = () => (
    <AuthorityLetterCard
      title='Letter of Authority'
      subTitle='Authorization letter from your company'
      avatarIcon='ic:twotone-text-snippet'
      secLink={`/onboarding/documents/personal-info/upload`}
    />
  )

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
              Router.push('/onboarding/documents')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Confirm your identity' />
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
                <Translations text='Proof' />
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', ml: 1, mt: 0.8 }}
              component={Link}
              href={`/onboarding/documents/personal-info/upload`}
            >
              <Icon color='#ff6661' icon='ri:edit-line' width='15' height='15' />
            </Box>
          </Box>
          {/* <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
            Proof
          </Typography> */}

          {renderAuthorityLetter()}
        </Box>
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
                <Translations text='Details' />
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', ml: 1, mt: 0.8 }}
              component={Link}
              href={`/onboarding/documents/personal-info/edit`}
            >
              <Icon color='#ff6661' icon='ri:edit-line' width='15' height='15' />
            </Box>
          </Box>

          {renderData()}
        </Box>
      </Box>
    </Box>
  )
}

export default PersonalInfoView
