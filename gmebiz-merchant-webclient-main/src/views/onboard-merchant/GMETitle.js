// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Translations from 'src/layouts/components/Translations'

const GMETitle = ({ title, subTitle = '' }) => {
  return (
    <Grid item xs={12} sm={12}>
      <Box sx={{ mb: 6 }}>
        <Typography variant='titleGME' sx={{ mb: 2 }}>
          <Translations text={title} />
        </Typography>
        <Typography color='text.grey' sx={{ mb: 1.5, fontSize: '18px', fontWeight: 400 }}>
          <Translations text={subTitle} />
        </Typography>
      </Box>
    </Grid>
  )
}

export default GMETitle
