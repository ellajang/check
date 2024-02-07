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
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import { getMerchants, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { getAllCountries } from 'src/store/apps/category'
import Translations from 'src/layouts/components/Translations'

const BusinessAddressInfoView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { merchants, error, loading, message, responseStatus, messageCode } = useSelector(state => state.onboarding)
  const { countries, countryError } = useSelector(state => state.category)

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
      if (message === 'UPDATED_SUCCESSFULLY') {
        Router.push('/onboarding/documents/business-info')
      }
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const incorporationCountry =
    countries.length > 0 &&
    merchants.length > 0 &&
    merchants[0].incorporation_country &&
    countries.find(country => country.country_code === merchants[0]?.incorporation_country)
      ? countries.find(country => country.country_code === merchants[0]?.incorporation_country).country
      : ''

  const businessAddressInfoData = [
    {
      title: 'Country',
      avatarIcon: 'ant-design:global-outlined',
      subTitle: incorporationCountry
    },
    {
      title: 'Postal Code',
      avatarIcon: 'mdi:post-outline',
      subTitle: merchants.length > 0 && merchants[0].postal_code ? merchants[0].postal_code : ''
    },
    {
      title: 'Address',
      avatarIcon: 'fa6-regular:address-card',
      subTitle:
        (merchants.length > 0 && merchants[0].address1 ? merchants[0].address1 + ', ' : '') +
        (merchants.length > 0 && merchants[0].address2 ? merchants[0].address2 + ', ' : '')
    },
    // {
    //   title: 'City',
    //   avatarIcon: 'tdesign:city-2',
    //   subTitle: merchants.length > 0 && merchants[0].city ? merchants[0].city : ''
    // }
  ]

  const renderData = () => {
    return businessAddressInfoData.map((item, index) => {
      return (
        <IdentityCard
          key={index}
          title={item.title}
          subTitle={item.subTitle}
          avatarIcon={item.avatarIcon}
          secLink={`/onboarding/documents/business-address/edit`}
        />
      )
    })
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
              Router.push('/onboarding/documents')
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
            <Translations text='Back' />
          </Button>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Verify your business address' />
          </Typography>
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
              href={`/onboarding/documents/business-address/edit`}
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

export default BusinessAddressInfoView
