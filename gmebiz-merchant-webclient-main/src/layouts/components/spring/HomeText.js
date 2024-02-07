import { useSpring, animated } from '@react-spring/web'

import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations'

export default function HomeText(props) {
  const springs = useSpring({
    from: { x: 80 },
    to: { x: 0 }
    //reset: true
    //delay: 2000
  })

  return (
    <animated.div
      style={{
        width: '100%',
        height: 80,
        //background: props.color,
        borderRadius: 8,
        ...springs
      }}
    >
      <Typography variant='h2' align='center' gutterBottom>
        <Translations text={props.text} />
      </Typography>
    </animated.div>
  )
}
