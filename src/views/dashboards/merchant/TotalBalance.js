// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CardActionArea } from '@mui/material'
import Chip from '@mui/material/Chip'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'

// ** MUI Imports
import Button from '@mui/material/Button'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { bgcolor, fontWeight, textAlign } from '@mui/system'

const data = [
  {
    amount: 98,
    subtitle: 'Refund',
    title: 'Total Sales',
    avatarColor: 'primary',
    avatarIcon: 'tabler:currency-dollar'
  },
  {
    amount: 126,
    title: 'Total Revenue',
    avatarColor: 'secondary',
    subtitle: 'Client Payment',
    avatarIcon: 'tabler:brand-paypal'
  }
]

function TotalBalance() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Card sx={{ border: 'none', maxWidth: 800 }}>
      <CardHeader
        title={t('Total Balance')}
        titleTypographyProps={{
          variant: 'h4'
        }}
        subheader={
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
              '& svg': { mr: 1, color: 'character' }
            }}
          >
            <Typography variant='h1' sx={{ mr: 2, color: 'common.black' }}>
              ₩ 0.00
            </Typography>

            <Button
              sx={{
                color: 'character.main',
                borderColor: 'neutral.dark5',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'neutral.main'
                }
              }}
              variant='outlined'
              size='small'
              startIcon={<Icon icon='uil:money-withdraw' />}
            >
              <Translations text='Withdraw' />
            </Button>
            <Button
              sx={{
                color: 'character.main',
                borderColor: 'neutral.dark5',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'neutral.main'
                }
              }}
              variant='outlined'
              size='small'
              startIcon={<Icon icon='ph:plus-circle-duotone' />}
            >
              <Translations text='Add Money' />
            </Button>
            {/* <Icon fontSize='1.25rem' icon='tabler:chevron-up' />
            <Typography variant='h6' sx={{ color: 'success.main' }}>
              25.8%
            </Typography> */}
          </Box>
        }
      />

      <CardContent>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* <CardActionArea href='/dashboard/balance' sx={{ width: 235, height: 154 }}>
            <Box
              sx={{
                width: 235,
                height: 154,
                borderWidth: 1,
                display: 'flex',

                alignItems: 'flex-start',
                borderRadius: '10px',
                flexDirection: 'column',

                justifyContent: 'center',
                borderStyle: 'solid',
                borderColor: theme.palette.divider,
                pl: 4
              }}
            >
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Box sx={{ display: 'flex', mr: 2 }}>
                  <img src='/images/logo/eng-circle.png' alt='GBP'></img>
                </Box>

                <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                  GBP
                </Typography>
              </Box>

              <Box>
                <Typography variant='h1' sx={{ mt: '8px', mb: '8px', color: 'common.black' }}>
                  $ 00,000
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    //styleName: Footnote/description;

                    fontSize: '12px',
                    fontWeight: '400',
                    lineHeight: '20px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    color: 'text.secondary',
                    textTransform: 'capitalize'
                  }}
                >
                  <Translations text='Virtual Account' />
                </Typography>
              </Box>
            </Box>
          </CardActionArea> */}
          <Box
            sx={{
              width: 235,
              height: 154,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderStyle: 'dashed',
              borderColor: theme.palette.divider,
              bgcolor: 'neutral.dark1',
              '&:hover': {
                color: 'primary.main',
                borderColor: 'primary.main'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Box sx={{ display: 'flex', mr: 2 }}>
                <Icon fontSize='1.25rem' icon='tabler:file-plus' />
              </Box>

              <Typography
                sx={{
                  //styleName: Body/bold;
                  fontSize: '14px',
                  fontWeight: '700',
                  lineHeight: '22px',
                  textAlign: 'center',
                  color: 'text.primary',
                  textTransform: 'capitalize'
                }}
              >
                <Translations text='Create a New Account' />
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* {data.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index === 0 && { mt: 7 }),
                mb: index !== data.length - 1 ? 4 : undefined
              }}
            >
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.avatarIcon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, color: item.amountDiff === 'negative' ? 'error.main' : 'success.main' }}
                >
                  {`${item.amountDiff === 'negative' ? '-' : '+'}$${item.amount}`}
                </Typography>
              </Box>
            </Box>
          )
        })} */}
      </CardContent>
    </Card>
  )
}

export default TotalBalance
