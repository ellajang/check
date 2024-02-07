// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports

import CardBoxMobile from './CardBoxMobile'

const CardBasic = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardBoxMobile />
        <CardBoxMobile />
        <CardBoxMobile />
        <CardBoxMobile />
      </Box>
    </>
  )
}

export default CardBasic
