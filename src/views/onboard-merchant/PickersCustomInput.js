// ** React Imports
import { Icon } from '@iconify/react'
import { forwardRef } from 'react'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, icon } = props

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      label={label || ''}
      InputProps={{
        endAdornment: <Icon position='end' icon={icon} />,
        readOnly: true
      }}
    />
  )
})

export default PickersComponent
