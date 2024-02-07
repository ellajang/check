// ** React Imports
import { useEffect, useState } from 'react'
// ** Next Import
import { useRouter } from 'next/router'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import { Direction } from '@mui/material'
import Image from 'next/image'
import useMediaQuery from '@mui/material/useMediaQuery'

import Link from 'next/link'

// ** Layout Import
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import HomeText from 'src/layouts/components/spring/HomeText'

import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

import { updateBusinessForm } from 'src/store/apps/register'
import { Translation } from 'react-i18next'
import DeleteConfirm from 'src/layouts/components/custom-dialog/confirm-delete'
import {getLandingPage} from "../store/apps/category";

//const images = ['/images/pages/globe.png', '/images/pages/money.png', '/images/pages/chain.png']

const images = [
  { src: '/images/pages/globe.png', text: 'Unlock Global Payment Opportunities' },
  { src: '/images/pages/money.png', text: 'Effortless FX & Transfers' },
  { src: '/images/pages/chain.png', text: 'Online Payment and Payment Links' }
]

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: `${theme.palette.neutral.main} !important`,
    color: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.main} !important`
  }
}))

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const FooterWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.grey[100],
  padding: 20
}))

const FooterColumnWrapper = styled(Box)(({ theme }) => ({
  flex: 1,

  //margin: '10px',
  padding: '10px',

  //border: '1px solid #ccc',
  textAlign: 'center'
}))

const FlagImage = styled('img')(({ theme }) => ({
  //zIndex: 2,
  maxHeight: 320,
  marginTop: theme.spacing(4),

  marginBottom: theme.spacing(4)
}))

const GMELanding = ({ direction }) => {
  const [opacities, setOpacities] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const theme = useTheme()
  const dispatch = useDispatch()
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  const {redirectionPage} = useSelector(state=>state.category)

  useEffect(() => {
    //console.log('localstore', localStorage ? localStorage.getItem('accessToken') : 'nothing here')
    if (localStorage && localStorage.getItem('userData')) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    setIsMounted(true)
  }, [])

  // ** Hook
  const [ref] = useKeenSlider(
    {
      loop: true,
      slides: images.length,
      rtl: direction === 'rtl',
      detailsChanged(s) {
        const new_opacities = s.track.details.slides.map(slide => slide.portion)
        setOpacities(new_opacities)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const handleBusinessTypeClick = (url, type) => {
    dispatch(updateBusinessForm(type))
    router.push(url)
  }

  useEffect(()=>{
    if (redirectionPage === 'ONBOARDING') {
      router.push('/onboarding')
    } else if (redirectionPage === "DASHBOARD") {
      router.push('/dashboard')
    } else if (redirectionPage === 'ACTIVATION') {
      router.push('/onboarding/documents')
    } else{
      router.push('/')
    }
  },[redirectionPage])

  // logout the user if user closes their browser
  useEffect(() => {
    window.addEventListener("beforeunload", (ev) =>
    {
      ev.preventDefault();

      return ev.returnValue = 'Are you sure you want to close?';
    });

    return () => {
      window.removeEventListener('beforeunload', auth.logout());
    };
  }, []);


  useEffect(()=>{
    dispatch(getLandingPage({
      function: 'GET_LANDING_PAGE'
    }))
  },[dispatch])

  return (
    <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container className='content-center'>
        <Grid
          container
          sx={{
            p: 5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            height: '80vh'
          }}
        >
          {/* <BoxWrapper> */}

          <Grid
            item
            xs={12}
            ref={ref}
            className='fader'
            sx={{ display: 'flex', minHeight: 220, justifyContent: 'center', pt: 4 }}
          >
            {isMounted &&
              images.map((item, index) => (
                <Box key={index} className='fader__slide' sx={{ position: 'absolute', opacity: opacities[index] }}>
                  <Image priority={true} src={item.src} width={164} height={164} alt='1' />
                  {index === 0 && <HomeText color={item.color} text={item.text} />}
                  {index === 1 && (
                    <Typography
                      className='animate__animated animate__fadeInLeft  animate__delay-2s'
                      variant='h2'
                      align='center'
                      gutterBottom
                    >
                      <Translations text={item.text} />
                    </Typography>
                  )}
                  {index === 2 && (
                    <Typography
                      className='animate__animated animate__fadeInRight animate__slow animate__delay-4s'
                      variant='h2'
                      align='center'
                      gutterBottom
                    >
                      <Translations text={item.text} />
                    </Typography>
                  )}
                </Box>
                //  <Box className='keen-slider__slide'>
                //   <Image src={images[1]} width={164} height={164} alt='2' />
                // </Box>
              ))}
          </Grid>

          {/* <Typography className='animate__animated animate__backInLeft' variant='h2' align='center' gutterBottom>
            Global Payment Accounts
          </Typography> */}
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <Typography variant='h5' align='center' color='text.secondary' paragraph>
              <Translations text='Create an account with us to Make Payments and Get Paid in different currencies.' />
            </Typography>
          </Grid>

          {!isLoggedIn && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 4 }}>
              <Button
                sx={{ px: 8 }}
                variant='contained'
                onClick={() => handleBusinessTypeClick('/register', 'BUSINESS')}
              >
                <Translations text='Sign Up' />
              </Button>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 8 }}
          >
            {!isLoggedIn && (
              <>
                <Typography variant='button' sx={{ color: 'text.secondary', mr: 2 }}>
                  <Translations text='Already have an account?' />
                </Typography>

                <Typography variant='button' href='/login' component={LinkStyled}>
                  <Translations text='Log In' />
                </Typography>
              </>
            )}
          </Grid>

          {/* </BoxWrapper> */}
        </Grid>
      </Grid>
      <FooterWrapper>
        {!hidden && <FooterColumnWrapper></FooterColumnWrapper>}

        <FooterColumnWrapper>
          <Typography variant='body1' sx={{ color: 'text.secondary', pt: 4 }}>
            &copy; <Translations text='GMEBiz. All rights reserved.' />
          </Typography>
        </FooterColumnWrapper>
        <FooterColumnWrapper>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            <Translations text='Get in touch' />
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Icon icon='tabler:mail' />
            <Typography variant='body1' color='primary'>
              service@gmeremit.com
            </Typography>
          </Box>
        </FooterColumnWrapper>
      </FooterWrapper>
    </Grid>
  )
}

GMELanding.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>
GMELanding.authGuard = false

export default GMELanding
