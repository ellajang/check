import { useEffect, React } from 'react'
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
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import { getMerchants, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { getAllCountries, getAllBusinessTypes } from 'src/store/apps/category'

const BusinessInfoView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const { t } = useTranslation()
  const auth = useAuth()
  const { merchants, error, loading, message, responseStatus, messageCode } = useSelector(state => state.onboarding)
  const { countries, countryError, businessTypes, businessTypeError } = useSelector(state => state.category)

  const merchantId = auth?.user?.source_id
  //** Hooks
  useEffect(() => {
    dispatch(
      getMerchants({
        function: 'SEARCH',
        scope: 'SINGLE',
        data: {
          query_params: {
            by: 'MERCHANT_ID',
            value: merchantId
          }
        }
      })
    ).then(() => {
      dispatch(
        getAllBusinessTypes({
          function: 'SEARCH',
          scope: 'BYKEYWORD',
          data: {
            query_params: {
              for_one: 'BUSINESS_TYPE'
            }
          }
        })
      )
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const businessType =
    businessTypes?.length > 0 &&
    merchants?.length > 0 &&
    merchants[0]?.business_type &&
    businessTypes.find(type => type.category_code === merchants[0]?.business_type)
      ? businessTypes.find(type => type.category_code === merchants[0]?.business_type).description
      : ''

  const businessInfoData = [
    {
      title: 'Business Name',
      avatarIcon: 'ant-design:audit-outlined',
      subTitle:
        (merchants.length > 0 && merchants[0].business_name ? merchants[0].business_name : '') +
        (merchants.length > 0 && merchants[0].business_name_native ? '(' + merchants[0].business_name_native + ')' : '')
    },
    {
      title: 'Date of Incorporation',
      avatarIcon: 'uil:calender',
      subTitle: merchants.length > 0 && merchants[0].incorporation_date ? merchants[0].incorporation_date : ''
    },
    {
      title: 'Phone Number',
      avatarIcon: 'mdi:phone-outline',
      subTitle:
        (merchants.length > 0 && merchants[0].phone_code ? merchants[0].phone_code + '-' : '') +
        (merchants.length > 0 && merchants[0].phone_number ? merchants[0].phone_number : '')
    },
    {
      title: 'Business Registration Number',
      avatarIcon: 'ant-design:insurance-outlined',
      subTitle: merchants.length > 0 && merchants[0].bizz_reg_no ? merchants[0].bizz_reg_no : ''
    },
    {
      title: 'Business Nature',
      avatarIcon: 'ant-design:laptop-outlined',
      subTitle: businessType
    },
    {
      title: 'Website',
      avatarIcon: 'fluent-mdl2:website',
      subTitle: merchants.length > 0 && merchants[0].website ? merchants[0].website + ', ' : ''
    }
  ]

  const renderData = () => {
    return businessInfoData.map((item, index) => {
      return (
        <IdentityCard
          key={index}
          title={t(item.title)}
          subTitle={t(item.subTitle)}
          avatarIcon={item.avatarIcon}
          secLink={`/onboarding/documents/business-info/edit`}
        />
      )
    })
  }

  const renderIncorporationDocument = () => (
    <IdentityCard
      title={t('A certificate of incorporation')}
      subTitle={t('The latest certificate of incorporation')}
      avatarIcon='material-symbols:domain-verification-outline'
      secLink={`/onboarding/documents/business-info/upload`}
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
            <Translations text='Verify your business info' />
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
              href={`/onboarding/documents/business-info/upload`}
            >
              <Icon color='#ff6661' icon='ri:edit-line' width='15' height='15' />
            </Box>
          </Box>
          {/* <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
            Proof
          </Typography> */}

          {renderIncorporationDocument()}
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
              href={`/onboarding/documents/business-info/edit`}
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

export default BusinessInfoView
