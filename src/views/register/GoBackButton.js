import React from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import Translations from 'src/layouts/components/Translations'

function GoBackButton({ handlePrev, skip, handleSkip }) {
  return (
    <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important`, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          sx={{
            '& svg': { mr: 2 },
            ':hover': {
              bgcolor: 'secondary.luma',
              color: 'primary'
            },
            p: 0
          }}
          onClick={handlePrev}
        >
          <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
          <Translations text='Back' />
        </Button>
        {skip && (
          <Button
            onClick={handleSkip}
            sx={{
              '& svg': { ml: 2 },
              color: 'text.grey',
              fontWeight: '600',
              ':hover': {
                bgcolor: 'secondary.luma',
                color: 'primary'
              }
            }}
          >
            <>
              <Translations text='Skip' />
              <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
            </>
          </Button>
        )}

        {/* <Button variant='contained' onClick={handleNext} sx={{ '& svg': { ml: 2 } }}>
        Next
        <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
      </Button> */}
      </Box>
    </Grid>
  )
}

export default GoBackButton
