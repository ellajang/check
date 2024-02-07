// ** React Imports
import React from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.customColors.trackBg
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#52C41A' : '#308fe8'
  }
}))

const ProcessLinearCustomization = ({ progress }) => {
  const value = progress && progress > 0 ? progress : 0

  return <BorderLinearProgress variant='determinate' value={value} />
}

export default ProcessLinearCustomization
