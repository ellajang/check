// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Lottie from 'react-lottie'
// import animationLogo from 'src/configs/Loading.json'
// import animationLoader from 'src/configs/Loading-2.json'
import animationLogo from '../animations/loading.json'
import animationLoader from '../animations/loading-2.json'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  const logoLoader = {
    loop: true,
    autoplay: true,
    animationData: animationLogo,
    renderer: 'svg',
    name: 'logo-loader'
  }

  const Loader = {
    loop: true,
    autoplay: true,
    animationData: animationLoader,
    renderer: 'svg'
  }

  return (
    <Box
      sx={{
        width: '400px',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      {/* <CircularProgress disableShrink sx={{ mt: 6 }} /> */}
      <Box sx={{ width: 200 }}>
        <Lottie options={logoLoader} speed={0.75} />
      </Box>
      <Box sx={{ width: 150 }}>
        <Lottie options={Loader} speed={0.75} />
      </Box>
    </Box>
  )
}

export default FallbackSpinner
