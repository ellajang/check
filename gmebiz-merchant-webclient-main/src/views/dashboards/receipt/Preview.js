// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components

// ** Demo Components Imports
import PreviewCard from "./PreviewCard";
import PreviewActions from "./PreviewActions";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import {Icon} from "@iconify/react";
import { usePDF } from 'react-to-pdf';

const InvoicePreview = () => {
  // ** State
  const [error, setError] = useState(false)
  const data = [1,2,3]
  const router= useRouter();
  const id = router?.query?.id
  const {t} =  useTranslation()
  const { toPDF, targetRef } = usePDF({filename: t(`transaction-receipt-id-${id}.pdf`)});

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            {t(`Receipt with the id: ${id} does not exist. Please check the transaction history`)}:{' '}
            <Link href='/dashboard/view-all'>{t('Transaction History')}</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return  (
      <Grid container spacing={6} sx={{px: 60}}>
        <Grid item xl={12} md={12} xs={12}>
          <Box sx={{
            display:'flex',
            gap: 4,
            p: 4,
            justifyContent: 'end'
          }}>
            <Button
              color={'secondary'}
              variant={'contained'}
              endIcon={<Icon icon={'tabler:download'} /> }
              onClick={() => toPDF()}
            >
              {t('Download')}
            </Button>
          </Box>
          <div ref={targetRef}>
            <PreviewCard data={data} />
          </div>
        </Grid>
      {/*<Grid item xl={3} md={4} xs={12}>*/}
      {/*  <PreviewActions />*/}
      {/*</Grid>*/}
      </Grid>
    )
  }
}

export default InvoicePreview
