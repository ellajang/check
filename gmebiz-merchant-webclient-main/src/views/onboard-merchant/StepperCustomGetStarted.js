// ** MUI Imports
import { Portal, Typography } from '@mui/material'
import MuiBox from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Hooks Imports
import useBgColor from 'src/@core/hooks/useBgColor'

// Styled Box component
const Box = styled(MuiBox)(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StepperCustomGetStarted = props => {
  // ** Props
  const { active, completed, error, icon } = props

  // ** Hooks
  const theme = useTheme()

  if (error) {
    return <Icon icon='tabler:alert-triangle' fontSize={20} color={theme.palette.error.main} transform='scale(1.2)' />
  } else if (completed) {
    return <Icon icon='tabler:circle-check' fontSize={30} color={theme.palette.success.dark} transform='scale(1.2)' />
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3.2,

          // borderColor: bgColors.primaryLight.backgroundColor,
          borderColor: 'grey.300',
          ...(active && {
            borderWidth: 3,
            borderColor: 'secondary.light',
            backgroundColor: theme.palette.mode === 'light' ? 'secondary.light' : 'background.default'
          })
        }}
      >
        <Typography color={active ? '#ffffff' : 'grey.500'}>{icon}</Typography>
      </Box>
    )
  }
}

export default StepperCustomGetStarted
