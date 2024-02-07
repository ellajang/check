// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/system/Unstable_Grid/Grid'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Chip from '@mui/material/Chip'

// ** MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'

function VirtualAccountTotalBalance({ handleNext, handlePrev }) {
  const theme = useTheme()

  return (
    <Card sx={{ border: 'none', maxWidth: 800 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List>
              <ListItem sx={{ pl: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    src={`https://img.icons8.com/color/48/usa-circular.png`}
                    alt='great-britain-circular'
                    sx={{ height: 36, width: 36 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary='USD Balance'
                  secondary='893832953278'
                  primaryTypographyProps={{ fontSize: '20px', fontWeight: 590 }}
                />

                <ListItemSecondaryAction>
                  <Chip sx={{ ml: 4 }} label='CLICK LINK -->' color='success' size='small' variant='outlined' />
                  <IconButton
                    onClick={handleNext}
                    edge='end'
                    color='black'
                    sx={{ '&:hover': { bgcolor: 'neutral.main', color: 'primary.main' } }}
                  >
                    <Icon icon='formkit:arrowright' />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                '& svg': { mr: 1, color: 'character' }
              }}
            >
              <Typography variant='h1' sx={{ mr: 2, color: 'common.black' }}>
                $ 12,300
              </Typography>
              <Button
                color='primary'
                variant='contained'
                size='small'
                startIcon={<Icon icon='mdi:arrow-down' />}
                sx={{ width: '130px' }}
              >
                Withdraw
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default VirtualAccountTotalBalance
