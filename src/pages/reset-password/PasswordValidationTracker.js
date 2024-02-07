import React from 'react'
import { Icon } from '@iconify/react'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

import Translations from 'src/layouts/components/Translations'

const PasswordValidationTrackerBox = ({ allMsg, message }) => {
  const errorMessages = message
  const allErrMsg = allMsg
  console.log(errorMessages)

  return (
    <main
      className='tracker-box'
      style={{
        color: errorMessages ? 'red' : 'inherit',
        boxShadow:
          '0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)',
        background: 'var(--neutral-2, #FAFAFA)',
        borderRadius: '12px'
      }}
    >
      <Typography variant={'h6'} sx={{ mb: 4 }}>
        <Translations text='Your Password Must Have' />
      </Typography>
      {allErrMsg.map((msg, index) => {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              color: errorMessages && errorMessages?.includes(msg) ? 'red' : 'green'
            }}
          >
            {!errorMessages?.includes(msg) ? <Icon icon={'tabler:check'} /> : '-'} <Translations text={msg} />
          </div>
        )
      })}
      {/* <div style={{ color: errorMessages && errorMessages.toLowerCase().includes('lowercase') ? 'red' : 'green' }}>
        {!errorMessages?.toLowerCase().includes('lowercase') ? <Icon icon={'tabler:check'} /> : '-'}
        <Translations text='At least one lowercase letter' />
      </div>
      <div style={{ color: errorMessages && errorMessages.toLowerCase().includes('uppercase') ? 'red' : 'green' }}>
        {!errorMessages?.toLowerCase().includes('uppercase') ? <Icon icon={'tabler:check'} /> : '-'}
        <Translations text='At least one uppercase letter' />
      </div>
      <div style={{ color: errorMessages && errorMessages.toLowerCase().includes('number') ? 'red' : 'green' }}>
        {!errorMessages?.toLowerCase().includes('number') ? <Icon icon={'tabler:check'} /> : '-'}
        <Translations text='At least one number' />
      </div>
      <div style={{ color: errorMessages && errorMessages.toLowerCase().includes('special') ? 'red' : 'green' }}>
        {!errorMessages?.toLowerCase().includes('special') ? <Icon icon={'tabler:check'} /> : '-'}
        <Translations text='At least one special character' />
      </div>
      <div style={{ color: errorMessages && errorMessages.toLowerCase().includes('8 characters') ? 'red' : 'green' }}>
        {!errorMessages?.toLowerCase().includes('8 characters') ? <Icon icon={'tabler:check'} /> : '-'}
        <Translations text='At least 8 characters' />
      </div> */}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ fontSize: '14px' }}>
          <Icon icon={'tabler:info-circle'} />
        </Box>
        <Typography fontSize={'12px'}>
          {' '}
          <Translations text='For better security, avoid recycling passwords.' />{' '}
          <Translations text='Keep them exclusive.' />
        </Typography>
      </Box>
    </main>
  )
}

export default PasswordValidationTrackerBox
