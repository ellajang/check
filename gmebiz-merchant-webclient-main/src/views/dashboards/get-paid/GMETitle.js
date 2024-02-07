import React from 'react'

// ** MUI Components
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { Title } from 'chart.js'

const GMETitle = ({ title, subTitle = '' }) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant='titleGME' sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400 }}>
        {subTitle}
      </Typography>
    </Box>
  )
}

export default GMETitle
