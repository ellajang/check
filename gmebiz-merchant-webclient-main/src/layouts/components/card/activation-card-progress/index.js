// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

import ProgressLinearCustomization from 'src/views/components/progress/ProgressLinearCustomization'

const ActivationCardProgress = ({ progress }) => {
  const { t } = useTranslation()
  // ** State

  return (
    <Card sx={{ bgcolor: '#fafafa', border: 0, borderRadius: 0.5, boxShadow: 0.5 }}>
      <CardContent sx={{ padding: '22px 15px !important' }}>
        <Box sx={{ color: 'text.secondary' }}>
          <Typography variant='h5' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
            <Translations text='Account Activation Progress' />
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ mb: 3.5, color: 'text.secondary', opacity: 0.85 }}>
            <Translations text='Submit all required information so we can verify your business' />
          </Typography>
        </Box>
        <Box>
          <ProgressLinearCustomization progress={progress} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActivationCardProgress
