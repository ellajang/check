// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ActivationCard = ({ title, subTitle, avatarIcon, status, secLink }) => {
  const { t } = useTranslation()
  // ** State

  const statusText = sta => {
    const str = sta ? sta : ''
    const words = str.replace('_', ' ')
    const splitStr = words.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }

    return splitStr.join(' ')
  }

  return (
    <Card sx={{ bgcolor: '#fafafa', border: 0, borderRadius: 0.5, boxShadow: 0.5 }}>
      <CardContent sx={{ padding: '22px 15px !important' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2
          }}
        >
          <Box>
            <Icon icon={avatarIcon} color='#ff6661' width='34' height='34' />
          </Box>
          <Box>
            <Box sx={{ color: 'text.secondary' }}>
              <Typography
                component={Link}
                href={`/onboarding/documents/${secLink}`}
                variant='h6'
                color='common.black'
                sx={{ mb: 1.5, opacity: 0.85, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                <Translations text={title} />
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ mb: 3.5, color: 'text.secondary', opacity: 0.85 }}>
                <Translations text={subTitle} />
              </Typography>
            </Box>
            {status === 'APPROVED' ? (
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', mr: 1, mt: 0.8 }}>
                  <Icon icon='mdi:check-circle' width='15' height='15' color='#52C41A' />
                </Box>
                <Box>
                  <Typography sx={{ mb: 3.5, color: '#52C41A' }}>
                    <Translations text={statusText(status)} />
                  </Typography>
                </Box>
              </Box>
            ) : status === 'REJECTED' || status === 'EXPIRED' || status === 'SUSPENDED' ? (
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', mr: 1, mt: 0.8 }}>
                  <Icon color='#FF2018' icon='mdi:alert' width='15' height='15' />
                </Box>
                <Box>
                  <Typography sx={{ color: '#FF2018', opacity: 0.85 }}>
                    <Translations text={statusText(status)} />
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', mr: 1, mt: 0.8 }}>
                  <Icon color='#FF9F43' icon='mdi:alert' width='15' height='15' />
                </Box>
                <Box>
                  <Typography sx={{ color: '#FF9F43', opacity: 0.85 }}>
                    <Translations text={statusText(status)} />
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActivationCard
