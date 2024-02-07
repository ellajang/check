// ** MUI Imports
import { Portal, Typography } from '@mui/material'
import MuiBox from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Hooks Imports
import useBgColor from 'src/@core/hooks/useBgColor'
import CircularProgress from '@mui/material/CircularProgress'

import LinearProgress from '@mui/material/LinearProgress'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

// Styled Box component
const Box = styled(MuiBox)(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StepperCustomDot = props => {
  // console.log('propppps', props)

  // ** Props
  const { active, completed, error, icon, mainSteps, activeStep, activeSubStep } = props

  // ** Hooks
  const theme = useTheme()
  const bgColors = useBgColor()
  const progressValue = mainSteps[activeStep].subSteps[activeSubStep].progress

  if (error) {
    return <Icon icon='tabler:alert-triangle' fontSize={20} color={theme.palette.error.main} transform='scale(1.2)' />
  } else if (completed) {
    return <Icon icon='tabler:circle-check' fontSize={30} color={theme.palette.success.dark} transform='scale(1.2)' />
  } else if (active && !completed) {
    return (
      <>
        <div style={{ width: '30px' }}>
          <CircularProgressbar
            value={progressValue}
            text={icon}
            strokeWidth='10'
            styles={buildStyles({
              textSize: '46px',
              pathColor: '#51B4FF',
              trailColor: '#d6d6d6'
            })}
          />
        </div>
      </>
    )
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

export default StepperCustomDot
