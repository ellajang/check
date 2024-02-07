// ** React Imports
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'

import { useForm, Controller } from 'react-hook-form'

// ** Custom Component Import

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import GMETitle from './GMETitle'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const StepRequestPlaced = ({ handleNext, handlePrev, formData, setFormData }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleBackHome = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <Grid container spacing={5} sx={{ mb: 16, minHeight: 250 }}>
        <Grid item xs={12}>
          {/* <Grid item xs={12} sm={12}> */}
          <Box sx={{ mb: 6 }}>
            <Typography variant='titleGME' sx={{ mb: 2 }}>
              Request Placed
            </Typography>
            <Box sx={{ mb: 1.5, fontSize: '16px', fontWeight: 400, display: 'flex', alignItems: 'center' }}>
              <Icon display='inline' icon='mdi:clock-outline' />
              <Typography sx={{ ml: '8px' }} display='inline'>
                Time Placed: 2023-03-29 14:15 PM
              </Typography>
            </Box>
          </Box>
          {/* </Grid> */}
          <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: 80, height: 'auto', pt: '16px', pb: '16px' }}>
              <Image width={80} height={80} src='/images/pages/tick.png' alt='ok' />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography>
              Your Virtual Account Request is under review. It will take 2-3 business days to verify. You will be
              notified you for any action taken on your request via email or SMS.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} sx={{ display: 'flex', columnGap: 6, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onClick={handleBackHome}
          type='submit'
          variant='outlined'
          sx={{ color: 'text.primary', borderColor: 'text.secondary', mb: 4, mt: 4 }}
        >
          Check Email
        </Button>

        <Button onClick={handleBackHome} type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          Back Home
        </Button>
      </Grid>
    </>
  )
}

export default StepRequestPlaced
