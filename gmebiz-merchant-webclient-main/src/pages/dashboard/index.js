import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import TotalBalance from 'src/views/dashboards/merchant/TotalBalance'
import CrmLastTransaction from 'src/views/dashboards/merchant/CrmLastTransaction'

// ** Layout Import
import LayoutWithSideBar from 'src/layouts/LayoutWithSideBar'

import { getTransactionList } from 'src/store/apps/transaction'
import { useAuth } from 'src/hooks/useAuth'
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Translations from "../../layouts/components/Translations";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import {Icon} from "@iconify/react";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

//merchant overview

const MerchantDashboard = () => {
  const dispatch = useDispatch()
  const auth = useAuth();
  const router = useRouter();

  const source_id = auth?.user?.source_id || ''

  const { txList } = useSelector(state => state.transaction)
  const {t} = useTranslation();

  const dashboardBox= [
    {
    path: '/onboarding/documents',
    icon: 'ic:twotone-storefront',
    title: t('Merchants')
    },
    {
      path: '/dashboard/make-payment/',
      icon: 'ic:twotone-payments',
      title: t('Make Payments')
    },
    {
      path: '',
      icon: 'ic:twotone-settings',
      title: t('Config')
}
]

  useEffect(() => {
    dispatch(
      getTransactionList({
        function: 'LIST',
        scope: 'MULTIPLE',
        data: {
          list_params: {
            from_date: '',
            to_date: '',
            source_id,
            source_type: 'MERCHANT',
            txn_status: 'ALL'
          }
        }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  {/*<Grid item xs={12} md={12}>*/}
  {/*  <TotalBalance />*/}
  {/*</Grid>*/}

  return (
      <Grid container spacing={6} >
        {
          dashboardBox.map((item, index)=>{
            return (
              <Grid
                item
                key={index}
                xs={4}
                md={4}
                onClick={()=>router.push(item.path)}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Card sx={{
                  border:0,
                }}>
                  <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
                    <Icon icon={item?.icon} fontSize='2rem' />
                    <Typography variant='h6' sx={{ mb: 4, fontSize: '1.1rem' }}>
                      {item?.title}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
        {txList?.length > 0 && <Grid
          item
          xs={12}
          md={12}
          sx={{
            // backgroundColor:'black'
          }}
        >
          {txList?.length > 0 && <CrmLastTransaction list={txList}/>}
        </Grid>}
      </Grid>
  )
}

MerchantDashboard.getLayout = page => <LayoutWithSideBar>{page}</LayoutWithSideBar>
//MerchantDashboard.guestGuard = true

export default MerchantDashboard
