import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'

import subWeeks from 'date-fns/subWeeks'
import DatePicker from 'react-datepicker'
import { useTheme } from '@mui/material/styles'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

import { getTransactionList } from 'src/store/apps/transaction'
import formatDateUTC from 'src/utils/formatDateUTC'
import formatMoney from 'src/utils/formatMoney'

import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
// ** Custom Component Imports
import CustomInput from './PickersCustomInput'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { MenuItem } from '@mui/material'

// const statusObj = {
//   REQUESTED: { text: 'Requested', color: 'secondary' }
// }

export default function ShowAllTransactionView() {
  const [minDate, setMinDate] = useState(subWeeks(new Date(), 5))
  const [maxDate, setMaxDate] = useState(new Date())
  const [txnStatus, setTxnStatus] = useState('ALL')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const auth = useAuth()
  const theme = useTheme()
  const { direction } = theme

  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { txList } = useSelector(state => state.transaction)

  useEffect(() => {
    dispatch(
      getTransactionList({
        function: 'LIST',
        scope: 'MULTIPLE',
        data: {
          list_params: {
            from_date: formatDateUTC(minDate),
            to_date: formatDateUTC(maxDate),
            source_id: auth?.user?.source_id ?? '',
            source_type: 'MERCHANT',
            txn_status: txnStatus
          }
        }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, maxDate, txnStatus])

  return (
    <DatePickerWrapper>
      <Card sx={{ mb: 10 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }} className='demo-space-x'>
          <CardHeader title='Latest Transaction' />
          <div>
            <DatePicker
              id='min-date'
              selected={minDate}
              maxDate={new Date()}
              popperPlacement={popperPlacement}
              onChange={date => setMinDate(date)}
              customInput={<CustomInput label='From' />}
            />
          </div>
          <div>
            <DatePicker
              id='max-date'
              selected={maxDate}
              minDate={minDate}
              maxDate={new Date()}
              popperPlacement={popperPlacement}
              onChange={date => setMaxDate(date)}
              customInput={<CustomInput label='To' />}
            />
          </div>

          <div>
            <CustomTextField
              name='status'
              select
              fullWidth
              label='Status'
              SelectProps={{
                value: txnStatus,
                onChange: e => setTxnStatus(e.target.value)
              }}
              id='validation-status'
              // error={Boolean(errors.select)}
              aria-describedby='validation-type-of-product'
              // {...(errors.select && { helperText: <Translations text='This field is mandatory' /> })}
              sx={{
                '& .MuiSelect-select .notranslate::after': 'Status'
                  ? {
                      content: `"${t('Status')}"`,
                      opacity: 0.42
                    }
                  : {}
              }}
            >
              {['ALL', 'DEPOSITED', 'REQUESTED', 'APPROVED'].map((txn, index) => {
                return (
                  <MenuItem key={index} value={txn}>
                    <Translations text={txn} />
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </div>
        </Box>

        {txList?.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
                >
                  <TableCell>Recipient</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Transaction Status</TableCell>
                  <TableCell>Transaction Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txList.map(row => {
                  return (
                    <TableRow
                      key={row?.id}
                      sx={{
                        '&:last-child .MuiTableCell-root': { pb: theme => `${theme.spacing(6)} !important` },
                        '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                        '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 4 } }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                              {row?.receiver_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          {/* <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Sent
                          </Typography> */}
                          <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                            {formatDateUTC(row?.created_date)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <CustomChip
                          rounded
                          size='small'
                          skin='light'
                          label={row?.txn_status}
                          color={
                            row?.txn_status === 'DEPOSITED' || row?.txn_status === 'APPROVED'
                              ? 'success'
                              : row?.txn_status === 'REQUESTED'
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {row?.collection_currency} {formatMoney(row?.collection_amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </DatePickerWrapper>
  )
}
