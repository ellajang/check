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

import IdentityCard from 'src/layouts/components/card/identity-card'
import AuthorityLetterCard from 'src/layouts/components/card/authority-letter-card'
import Link from 'next/link'
import { getMerchantBanks } from 'src/store/apps/onboarding'
import { getAllBanks } from 'src/store/apps/category'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'

const BankInfoView = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const auth = useAuth()
  const { merchantBanks, error, loading, message, responseStatus } = useSelector(state => state.onboarding)
  const { banks, banksError } = useSelector(state => state.category)

  const { t } = useTranslation()

  const merchantId = auth?.user?.source_id
  //** Hooks
  useEffect(() => {
    dispatch(
      getMerchantBanks({
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
    dispatch(
      getAllBanks({
        function: 'SEARCH',
        scope: 'BYKEYWORD',
        data: {
          query_params: {
            by: 'STATUS',
            value: 'ACTIVE'
          }
        }
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bankName =
    banks?.length > 0 &&
    merchantBanks?.length > 0 &&
    merchantBanks[0]?.bank_id &&
    banks.find(bank => bank.bank_code === merchantBanks[0]?.bic_code)
      ? banks.find(bank => bank.bank_code === merchantBanks[0]?.bic_code).bank_name
      : ''

  const bankInfoData = [
    {
      title: 'Bank Name',
      avatarIcon: 'ant-design:audit-outlined',
      subTitle: bankName
    },
    {
      title: 'Account Name',
      avatarIcon: 'uil:calender',
      subTitle: merchantBanks && merchantBanks[0]?.account_name ? merchantBanks[0]?.account_name : ''
    },
    {
      title: 'Account Number',
      avatarIcon: 'ant-design:global-outlined',
      subTitle: merchantBanks && merchantBanks[0]?.account_number ? merchantBanks[0]?.account_number : ''
    },
    {
      title: 'Swift BIC',
      avatarIcon: 'ant-design:insurance-outlined',
      subTitle: merchantBanks && merchantBanks[0]?.swift_code ? merchantBanks[0]?.swift_code : ''
    }
  ]

  const renderData = () => {
    return bankInfoData.map((item, index) => {
      return (
        <IdentityCard
          secLink={'/onboarding/documents/bank-info/edit/'}
          key={index}
          title={item.title}
          subTitle={item.subTitle}
          avatarIcon={item.avatarIcon}
        />
      )
    })
  }

  const renderBankPassbook = () => (
    <IdentityCard
      title='Bank Passbook'
      subTitle={t('Bank Passbook Document')}
      avatarIcon='material-symbols:domain-verification-outline'
      secLink={`/onboarding/documents/bank-info/upload`}
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
            <Translations text='Verify your bank details' />
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
                <Translations text='Proof' />
              </Typography>
            </Box>
            {/* <Box
              sx={{ display: 'flex', ml: 1, mt: 0.8 }}
              component={Link}
              href={`/onboard-documents/business-info/incorporation-document`}
            >
              <Icon color='#ff6661' icon='ri:edit-line' width='15' height='15' />
            </Box> */}
          </Box>
          {/* <Typography variant='h6' color='common.black' sx={{ mb: 3, ml: 2 }}>
            Proof
          </Typography> */}

          {renderBankPassbook()}
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
              href={`/onboarding/documents/bank-info/edit`}
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

export default BankInfoView
