// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CustomRadioBasic = props => {
  // ** Props
  const { name, data, icon, iconProps, selected, gridProps, handleChange, color = 'secondary' } = props
  const { meta, title, value, content } = data

  const renderImage = () => {}

  const renderData = () => {
    if (meta && title && content) {
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 2,
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            {typeof title === 'string' ? (
              <Typography sx={{ mr: 2 }} variant='h6'>
                {title}
              </Typography>
            ) : (
              title
            )}
            {typeof meta === 'string' ? <Typography sx={{ color: 'text.disabled' }}>{meta}</Typography> : meta}
          </Box>
          {typeof content === 'string' ? <Typography variant='body2'>{content}</Typography> : content}
        </Box>
      )
    } else if (meta && title && !content) {
      return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {typeof title === 'string' ? (
            <Typography sx={{ mr: 2 }} variant='h6'>
              {title}
            </Typography>
          ) : (
            title
          )}
          {typeof meta === 'string' ? <Typography sx={{ color: 'text.disabled' }}>{meta}</Typography> : meta}
        </Box>
      )
    } else if (!meta && title && content) {
      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {typeof title === 'string' ? (
            <Typography sx={{ mb: 1, fontWeight: 700 }}>
              <Translations text={title} />
            </Typography>
          ) : (
            <Translations text={title} />
          )}
          {typeof content === 'string' ? (
            <Typography color='text.secondary' sx={{ fontSize: '15px', fontWeight: 450, lineHeight: '22px' }}>
              <Translations text={content} />
            </Typography>
          ) : (
            <Translations text={content} />
          )}
        </Box>
      )
    } else if (!meta && !title && content) {
      return typeof content === 'string' ? <Typography variant='body2'>{content}</Typography> : content
    } else if (!meta && title && !content) {
      return typeof title === 'string' ? <Typography sx={{ fontWeight: 500 }}>{title}</Typography> : title
    } else {
      return null
    }
  }

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          // onClick={() => {
          //   if (!data.disabled) {
          //     handleChange()
          //   }
          // }}
          sx={{
            p: 4,
            height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'center',
            border: theme => `1px solid ${theme.palette.divider}`,
            ...(selected === value && !data.disabled
              ? { borderColor: `${color}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          <Radio
            name={name}
            size='small'
            color={color}
            disabled={data.disabled}
            value={value}
            onClick={event => handleChange(event.target.value)}
            checked={selected === value && !data.disabled}
            sx={{ ml: -2.75 }}
          />
          {icon ? <Icon icon={icon} {...iconProps} /> : null}

          {renderData()}
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default CustomRadioBasic
