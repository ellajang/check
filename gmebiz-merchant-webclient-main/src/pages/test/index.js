import { useState, useS } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import { CardContent } from '@mui/material'
// ** Demo Components Imports
import StepperCustomVertical from 'src/views/onboard-merchant/StepperCustomVertical'

import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'
import Translations from 'src/layouts/components/Translations'
import Spinner from 'src/layouts/components/spinner'

const SpinnerTest = () => {
  return <Spinner />
}

export default SpinnerTest
