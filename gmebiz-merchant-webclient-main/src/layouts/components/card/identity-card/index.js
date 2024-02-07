// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// Styled Grid component

const ActivationCard = ({ title, subTitle, avatarIcon, verified, secLink }) => {
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
        <Box sx={{ color: 'text.secondary', width: '100%' }}>
          <Typography
            component={Link}
            href={`${secLink}`}
            variant='h6'
            color='common.black'
            sx={{ mb: 1.5, opacity: 0.85, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            <Translations text={title} />
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ mb: 3.5, color: 'text.secondary', opacity: 0.85 }}>{subTitle}</Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ActivationCard
