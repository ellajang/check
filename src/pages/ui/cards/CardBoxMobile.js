// ** React Imports
import { useState } from 'react'

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

const CardBoxMobile = () => {
  // ** State

  return (
    <Box
      sx={{
        bgcolor: '#00ff00',
        boxShadow: 1,
        borderRadius: 2,
        p: 4,
        m: 1,
        maxWidth: 432,
        display: 'flex'
      }}
    >
      <Box sx={{ mx: 3.5 }}>
        <Icon icon='mdi:user' color='#ff2018' width='34' height='34' />
      </Box>
      <Box>
        <Box sx={{ color: 'text.secondary' }}>
          <Typography variant='h5' sx={{ mb: 1.5 }}>
            Personal Info
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>
            This data helps us to confirm your individual legal details Involvement in the business
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default CardBoxMobile
