// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const ActivationCard = ({ title, subTitle, avatarIcon }) => {
  const { t } = useTranslation()

  return (
    <Grid
      container
      sx={{
        bgcolor: '#f5f5f5',
        boxShadow: 1,
        borderRadius: 0.5,
        pt: 4,
        pb: 0.5,
        pr: 4,
        m: 2,
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        minWidth: '20rem'
      }}
    >
      <Grid item xs={2} sx={{ mx: 3.5 }}>
        <Icon icon={avatarIcon} color='#ff6661' width='34' height='34' />
      </Grid>
      <Grid item xs={10}>
        <Box sx={{ color: 'text.secondary' }}>
          <Typography
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
      </Grid>
    </Grid>
  )
}

export default ActivationCard
