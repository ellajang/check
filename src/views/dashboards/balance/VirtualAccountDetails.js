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
import Image from 'next/image'

// ** MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'

function VirtualAccountDetails({ handleNext, handlePrev }) {
  const theme = useTheme()

  const data = {
    title: ['Account Holder', 'Account Name', 'Account Number', 'Routing Number', 'Account type'],
    sub: ['Abc Company Pvt. Ltd.', 'Project USD', '165816516186518534534', '5664698498', 'Checking']
  }

  return (
    <>
      <Card>
        {/* <CardHeader
        title='Total Balance'
        subheader={
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
              "& svg": { mr: 1, color: "character" }
            }}
          >
            <Typography variant='h1' sx={{ mr: 2, color: "common.black" }}>
              $ 12,300
            </Typography>
            <Button color='character' variant='outlined' size='small' startIcon={<Icon icon='uil:money-withdraw' />}>
              Withdraw
            </Button>
            <Button color='character' variant='outlined' size='small' startIcon={<Icon icon='tabler:circle-plus' />}>
              Add Money
            </Button>
          </Box>
        }
      /> */}

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
                  <ListItemText primary='USD Balance' primaryTypographyProps={{ fontSize: '20px', fontWeight: 590 }} />
                  <ListItemSecondaryAction>
                    <Button variant='contained'>Copy</Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <List>
                {data.title.map((item, index) => {
                  return (
                    <ListItem key={index}>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Typography sx={{ fontWeight: 'bold', color: 'character.light' }}>
                            {data.title[index]}
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <Typography variant='h5' sx={{ color: 'common.black' }}>
                            {data.sub[index]}
                          </Typography>
                        </ListItem>
                      </List>

                      <ListItemSecondaryAction>
                        <IconButton color='primary' size='small'>
                          <Icon icon='ant-design:copy-twotone' />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            </Grid>

            {/* <Grid item xs={12}>
            <Typography sx={{ color: "character.light" }}>Account Holder</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",

                justifyContent: "space-between",

                "& svg": { color: "character" }
              }}
            >
              <Typography variant='h5' sx={{ color: "common.black" }}>
                ABC Company Pvt. Ltd.
              </Typography>
              <IconButton color='primary' size='small'>
                <Icon icon='ant-design:copy-outlined' />
              </IconButton>
            </Box>
          </Grid> */}
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ my: 5 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',

                  justifyContent: 'flex-start',
                  gap: 2,
                  '& svg': { color: 'character' }
                }}
              >
                <Icon icon='ant-design:field-time-outlined' />
                <Typography variant='h5' sx={{ color: 'character.dark' }}>
                  Incoming payments take 2-3 working days to be added to your account
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                '& svg': { color: 'primary' },
                mt: '20px',
                mb: '20px'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',

                  justifyContent: 'flex-start',
                  gap: 2,
                  '& svg': { color: 'character' }
                }}
              >
                <Icon icon='ant-design:file-done-outlined' />
                <Typography variant='h5' sx={{ color: 'character.dark' }}>
                  There’s a **** USD fee to receive GME Payments transfers
                </Typography>
              </Box>
              <Box>
                <Icon color='red' icon='bi:question-circle' />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                '& svg': { color: 'primary' }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  gap: 2,
                  '& svg': { color: 'character' }
                }}
              >
                <Icon icon='solar:info-circle-linear' />
                <Typography variant='h5' sx={{ color: 'character.dark' }}>
                  Learn how GME Payments keeps your money safe
                </Typography>
              </Box>
              <Box>
                <Icon color='red' icon='bi:question-circle' />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ my: 5 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',

                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 2,
                  '& svg': { color: 'character' }
                }}
              >
                <Image src='/images/pages/bitcoin.png' width={97} height={97} alt='bitcoin' />
                <Box>
                  <Typography variant='h5' sx={{ color: 'character.dark', pl: 4 }}>
                    How to use your USD account details?
                  </Typography>
                  <Button variant='text'>See How They Work </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default VirtualAccountDetails
