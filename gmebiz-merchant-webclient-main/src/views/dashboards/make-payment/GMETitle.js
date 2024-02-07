// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const GMETitle = ({ title, subTitle = '' }) => {
  return (
    <Grid item xs={12} sm={12}>
      <Box sx={{ mb: 6 }}>
        <Typography variant='titleGME' sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '18px', fontWeight: 400 }}>
          {subTitle}
        </Typography>
      </Box>
    </Grid>
  )
}

export default GMETitle
