import React from 'react'

import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Demo Components Imports
import StepperCustomVertical from 'src/views/onboard-merchant/StepperCustomVertical'

import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

const Notice = () => {
  const FlagImage = styled('img')(({ theme }) => ({
    zIndex: 2,
    maxHeight: 320,
    paddingLeft: 10,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }))

  return (
    <Box className='content-center'>
      <Box
        sx={{
          width: 432,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        <Box sx={{ width: '100%', padding: '1.5rem' }}>
          <Box sx={{ my: 6 }}>
            <Typography variant='titleGME' color='common.black' sx={{ mb: 2, opacity: 0.85 }}>
              Documents Submitted !
            </Typography>
            <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
              Your documents will be reviewed by our Compliance Team within 72 hours.​ GME has the right to
              approve/reject your application for its service Usage.
            </Typography>
          </Box>
          <Box sx={{ width: '100%', position: 'relative', py: 20 }}>
            <FlagImage alt='GME Flag' src={'/images/pages/notice.png'} />
            {/* <LogoWhite alt='GME logo White' src={'/images/pages/logo-white.png'} /> */}
          </Box>
          <Button fullWidth variant='contained' sx={{ mb: 4 }}>
            View Application Status
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Notice
