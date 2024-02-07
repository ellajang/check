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

const CardMobile = () => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card sx={{ bgcolor: '#f5f5f5' }}>
      <Grid container spacing={2}>
        <Box sx={{ pl: '28px', pr: '20px', pt: '20px' }}>
          <Icon icon='mdi:user' color='#ff2018' width='34' height='34' />
        </Box>

        {/* <StyledGrid item md={3} xs={12}>
          <CardContent sx={{ pt: '16px', pr: '5px', pl: 0 }}>
            <Icon icon='mdi:user' color='#ff2018' width='34' height='34' />
          </CardContent>
        </StyledGrid> */}
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            pt: ['0 !important', '0 !important', '0 !important'],
            pl: ['1.5rem !important', '1.5rem !important', '0 !important']
          }}
        >
          <CardContent sx={{ pt: '22px', pb: '18px !important', pl: '5px' }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Personal Info
            </Typography>
            <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>
              This data helps us to confirm your individual legal details Involvement in the business
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Price:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                $899
              </Box>
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CardMobile
