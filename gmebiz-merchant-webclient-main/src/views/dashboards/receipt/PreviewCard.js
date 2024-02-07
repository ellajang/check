// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import Image from "next/image";
import {useSelector} from "react-redux";
import dayjs from "dayjs";
import getStatusColor from "../../../utils/getStatusColor";
import {useTranslation} from "react-i18next";
import handleUnderscoreTextRemove from "../../../utils/underScoreTextRemove";
import formatMoney from "../../../utils/formatMoney";

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = () => {
  const { singleTx: data } = useSelector(state=>state.transaction);
  const {t} = useTranslation();
  // ** Hook
  const theme = useTheme()
  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <Image height={40} width={222} src={'/images/logo/logo.png'}/>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '310px' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h4'>{t('Transaction ID')}</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h4'>{data?.id}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{t('Transaction Date')}:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{dayjs(data?.created_date).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Transaction Status:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: getStatusColor(data?.txn_status).color }}>{data?.txn_status}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'start' }}>
              <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  {t('Sender Information')}:
                </Typography>
                <TableContainer>
                  <Table >
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {t('Name')}:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {data?.sender_name}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {t('Nationality')}:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {data?.sender_nationality}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {t('Address')}:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {data?.sender_address}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {t('Account Name')}:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {data?.sender_account_name}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {t('Phone Number')}:
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {data?.sender_phone_number}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>


            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  {t('Receiver Information')}:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Name')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {data?.receiver_name}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Email')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_email}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Phone Number')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_phone_code} {data?.receiver_phone_no}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Business Registration Number')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_business_reg_number}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Account Name')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_account_name}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Account Number')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_account_number}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Bank Code')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data?.receiver_bank_code}</Typography>
                        </MUITableCell>
                      </TableRow>

                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Payment Method')}:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{handleUnderscoreTextRemove(data?.receiver_payment_method) }</Typography>
                        </MUITableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              <TableRow>
                <TableCell>{t('Collection Amount')}</TableCell>
                <TableCell>{data?.collection_currency} {formatMoney(data?.collection_amount) ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('Service Charge')}</TableCell>
                <TableCell> {formatMoney(data?.service_charge) ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('Rate')}</TableCell>
                <TableCell> {formatMoney(data?.offer_rate) ?? 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Applicant Name')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.applicant_name}</Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Transaction Reason')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.txn_reason}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
