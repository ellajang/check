// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import {useRouter} from "next/router";

// ** Icon Imports

const PreviewActions = () => {
  const router = useRouter();
  const id = router?.query?.id

  return (
    <Card>
      <CardContent>
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal'>
          Download
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2 }}
          target='_blank'
          variant='tonal'
          component={Link}
          color='secondary'
          href={`/apps/invoice/print/${id}`}
        >
          Print
        </Button>
        {/*<Button*/}
        {/*  fullWidth*/}
        {/*  sx={{ mb: 2 }}*/}
        {/*  variant='tonal'*/}
        {/*  component={Link}*/}
        {/*  color='secondary'*/}
        {/*  href={`/apps/invoice/edit/${id}`}*/}
        {/*>*/}
        {/*  Edit Invoice*/}
        {/*</Button>*/}
      </CardContent>
    </Card>
  )
}

export default PreviewActions
