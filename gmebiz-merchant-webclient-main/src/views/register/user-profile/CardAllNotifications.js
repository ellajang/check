import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import {DataGrid} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";
import {useState} from "react";
import dayjs from "dayjs";


const CardAllNotifications = () => {
  const {notifications} = useSelector(state=>state.notification);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const columns = [
    {
      flex: 0.125,
      minWidth: 120,
      field: 'TITLE',
      headerName: 'TITLE',
      renderCell: params => {
        const {  row } = params;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600, fontSize:16 }}>
                {row?.title}
              </Typography>
              <Typography noWrap variant='caption' fontSize={12}>
                {}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.4,
      type: 'text',
      flexWrap: true,
      minWidth: 120,
      headerName: 'SUBTITLE',
      field: 'sub_title',
      valueGetter: params => new Date(params.value),
      renderCell: ({row}) => (
        <Typography variant='body2' fontSize={16} sx={{ color: 'text.primary', width: 50 }}>
          {row.subtitle}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'createdBy',
      minWidth: 120,
      headerName: 'CREATED DATE',
      renderCell: ({ row}) => (
        <Stack>
          <Typography variant='body2' fontSize={14} sx={{ color: 'text.primary' }}>
            {row.created_by }
          </Typography>
          <Typography variant='body2' fontSize={12} sx={{ color: 'text.primary' }}>
            { dayjs(row.createdDate).format('YYYY-MM-DD HH:MM:ss')}
          </Typography>
        </Stack>

      )
    }
  ]

  return (
    <Card sx={{mx:'12%'}}>
      <CardHeader
        title='Notifications'
        titleTypographyProps={{ sx: { mb: 1 } }}
        subheader={
          <Typography sx={{ color: 'text.secondary', display: 'flex' }}>
            You will be able to see entire notifications from here.{' '}
          </Typography>
        }
      />
      <CardContent>
        <DataGrid
          autoHeight
          columns={columns}
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={notifications ?? []}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.125rem'
            }
          }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            },
          }}
          getRowId={(row)=> row.id}
        />
      </CardContent>
    </Card>
  )
}

export default CardAllNotifications
