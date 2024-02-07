// ** Next Import
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** AppBar Imports
import AppBar from 'src/layouts/components/blank-layout-with-appBar'

import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
// ** MUI Imports
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
const ListItemStyled = styled(ListItem)(({ theme }) => ({
  // borderLeftWidth: '3px',
  // borderLeftStyle: 'solid',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  marginBottom: theme.spacing(1)
}))

// Styled component for Blank Layout with AppBar component
const BlankLayoutWithAppBarWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`
  }
}))

const BlankLayoutWithAppBar = props => {
  const { t } = useTranslation()
  // ** Props
  const { children } = props

  return (
    <BlankLayoutWithAppBarWrapper>
      <AppBar />
      <Box sx={{ display: 'flex', backgroundColor: '#fafafa', overflowX: 'hidden', position: 'relative' }}>
        <Box
          boxShadow={3}
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'flex-start',
            // borderRadius: '20px',
            justifyContent: 'flex-start',
            backgroundColor: 'background.paper', // use background.paper which is white

            // margin: theme => theme.spacing(8, 0, 8, 8),
            maxWidth: 208,
            paddingTop: 3,
            zIndex: 1
          }}
        >
          {/* <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} /> */}
          {/* <FooterIllustrationsV2 /> */}
          <Box>
            <List component='div' sx={{ '& .MuiListItemIcon-root': { mr: 2 } }}>
              <ListItemStyled
                component={Link}
                href='/dashboard'
                sx={{ py: 1.5, borderLeftColor: true ? 'primary.main' : 'transparent' }}
              >
                <ListItemIcon sx={{ color: false ? 'primary.main' : 'text.primary' }}>
                  <Icon icon='ic:twotone-home' />
                </ListItemIcon>
                <ListItemText
                  primary={t('Home')}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 500, fontSize: '1.1rem', ...(false && { color: 'primary.main' }) }
                  }}
                />
              </ListItemStyled>
              <ListItemStyled
                component={Link}
                href='/onboarding/documents'
                sx={{
                  py: 1.5,
                  borderLeftColor: true ? 'primary.main' : 'transparent'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: false ? 'primary.main' : 'text.primary'
                  }}
                >
                  <Icon icon='ic:twotone-storefront' />
                </ListItemIcon>
                <ListItemText
                  primary={t('Merchants')}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 500, fontSize: '1.1rem' }
                  }}
                />
              </ListItemStyled>
              <ListItemStyled
                component={Link}
                href='/dashboard/make-payment'
                sx={{
                  py: 1.5,
                  borderLeftColor: true ? 'primary.main' : 'transparent'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: false ? 'primary.main' : 'text.primary'
                  }}
                >
                  <Icon icon='ic:twotone-payments' />
                </ListItemIcon>
                <ListItemText
                  primary={t('Make Payments')}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 500, fontSize: '1.1rem' }
                  }}
                />
              </ListItemStyled>
              {/* <ListItemStyled
                component={Link}
                href='/dashboard/get-paid'
                sx={{
                  py: 1.5,
                  borderLeftColor: true ? 'primary.main' : 'transparent'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: false ? 'primary.main' : 'text.primary'
                  }}
                >
                  <Icon icon='ic:twotone-account-balance' />
                </ListItemIcon>
                <ListItemText
                  primary={t('Get Paid')}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 500 }
                  }}
                />
              </ListItemStyled> */}
              <ListItemStyled
                component={Link}
                href='/dashboard'
                sx={{
                  py: 1.5,
                  borderLeftColor: true ? 'primary.main' : 'transparent'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: false ? 'primary.main' : 'text.primary'
                  }}
                >
                  <Icon icon='ic:twotone-settings' />
                </ListItemIcon>
                <ListItemText
                  primary={t('Config')}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 500, fontSize: '1.1rem' }
                  }}
                />
              </ListItemStyled>
            </List>
          </Box>
        </Box>

        <Box
          className='app-content'
          sx={{
            // overflowX: "hidden",
            position: 'relative',
            minHeight: theme => `calc(100vh - ${theme.spacing(theme.mixins.toolbar.minHeight / 4)})`,
            bgcolor: '#fafafa',
            margin: '0 auto',
            pt: 10,
            width:  '100%',
            px: 60
          }}
        >
          {children}
        </Box>
      </Box>
    </BlankLayoutWithAppBarWrapper>
  )
}

export default BlankLayoutWithAppBar
