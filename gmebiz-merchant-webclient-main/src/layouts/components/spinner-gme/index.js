// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LoaderSvg from './LoaderSvg'
import { Alert } from '@mui/material'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',

        // flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <LoaderSvg />
      <LoaderSvg />
      <LoaderSvg />
      <LoaderSvg />

      {/* <Alert severity='error' sx={{ mb: 4 }}>
        Oops! Please check your internet connection
      </Alert> */}

      {/* <img src='/images/loader-img.svg' alt='SVG Image' /> */}
    </Box>
  )
}

export default FallbackSpinner
