// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { Paper, InputBase, IconButton, Divider } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

import Translations from 'src/layouts/components/Translations'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports

import formatDateUTC from 'src/utils/formatDateUTC'
import formatMoney from 'src/utils/formatMoney'
import Link from "next/link";
import {useS, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateTransaction} from "../../../store/apps/transaction";

const CrmLastTransaction = ({ list }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const [filteredList, setFilteredList] = useState([])

  const handleFilter = () => {
      if(search !== ''){
        const filteredReceiverName = list?.filter(txn => txn.receiver_name.toLowerCase().includes(search.toLowerCase()))
        setFilteredList(filteredReceiverName)
      }
      else{
        setFilteredList(list)
      }
  }

  const finalList = filteredList?.length !== 0 ? filteredList : list


  return (
    <Card sx={{ border: 'none', maxWidth: '100%' }}>
      <CardHeader
        title={t('Recent Transactions')}
        titleTypographyProps={{
          variant: 'h4'
        }}
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
            <Paper
              variant='outlined'
              component='form'
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t('Search Transaction')}
                inputProps={{ 'aria-label': 'Search Transaction' }}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />
              <Divider sx={{ height: 41 }} orientation='vertical' />
              <IconButton type='button' sx={{ p: '10px' }} aria-label='search' onClick={handleFilter}>
                <Icon icon='ic:outline-search' />
              </IconButton>
            </Paper>
            <Button
              color='character'
              variant='outlined'
              size='small'
              sx={{
                mr: 10,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'neutral.main',
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => router.push('/dashboard/view-all')}
            >
              {' '}
              <Translations text='View All' />{' '}
            </Button>
          </Box>
        }
      />
      <CardContent>
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            height: 350
          }}
        >
          <Box>
            <Typography variant='h3'>No Transaction To Show</Typography>
          </Box>
          <Box>
            <Button variant='contained'>Get Paid Now</Button>
          </Box>
        </Box> */}

        {finalList.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== list.length - 1 ? [6.25, 6.25, 5.5, 6.25] : undefined
              }}
            >
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 2,
                  width: '95%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                  <Typography variant='h6'>{item?.receiver_name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {formatDateUTC(item?.created_date)}
                    </Typography>
                    <CustomChip
                      size='small'
                      sx={{ lineHeight: 1, ml: '5px' }}
                      color={
                        item?.txn_status === 'DEPOSITED' || item?.txn_status === 'APPROVED'
                          ? 'success'
                          : item?.txn_status === 'REQUESTED'
                          ? 'warning'
                          : 'error'
                      }
                      label={item?.txn_status}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h5' sx={{ mr: 2, color: 'text.primary' }}>
                    {item?.collection_currency} {formatMoney(item?.collection_amount)}
                  </Typography>
                  <Link href={`/dashboard/receipt/${item?.id}`}>
                    <Icon color='#00000073' fontSize='1.25rem' icon='ic:sharp-receipt-long' />
                  </Link>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default CrmLastTransaction
