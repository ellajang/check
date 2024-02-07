// ** React Imports
import { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { styled, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemButton from '@mui/material/ListItemButton'
import Slide from '@mui/material/Slide'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'

import { useForm, Controller } from 'react-hook-form'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
//import CustomRadioAccountType from 'src/views/forms/form-elements/custom-inputs/CustomRadioAccountType'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import GMETitle from './GMETitle'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '40%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 180,
  bgcolor: 'background.paper',
  p: '24px',
  borderRadius: '10px'
}

const StepVirtualAccountList = ({ handleNext, handlePrev, formData, setFormData }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <GMETitle title='Open a Virtual Account' subTitle='Select an account type you would like to open' />
      <Grid container spacing={5} sx={{ mb: 16, minHeight: 250 }}>
        <Grid item xs={12}>
          <List>
            {formData.accountType.name.map((item, index) => {
              return (
                <ListItem key={index}>
                  <ListItemButton onClick={handleOpen}>
                    <ListItemAvatar>
                      <Avatar
                        src={`https://img.icons8.com/color/48/${formData.accountType.flag[index]}-circular.png`}
                        alt='great-britain-circular'
                        sx={{ height: 36, width: 36 }}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={formData.accountType.name[index]} secondary='************' />
                    <ListItemSecondaryAction>
                      <IconButton edge='end'>
                        <Icon icon='ic:round-greater-than' color='black' />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={handleClose}
            closeAfterTransition
            // slots={{ backdrop: Backdrop }}
            // slotProps={{
            //   backdrop: {
            //     timeout: 500
            //   }
            // }}
            sx={{
              '& > .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.45)'
              }
            }}
          >
            <Slide direction='up' in={open} mountOnEnter unmountOnExit>
              <Box sx={ModalStyle}>
                <Typography id='transition-modal-title' variant='h3' sx={{ mb: '10px' }}>
                  USD Account Request
                </Typography>
                <Typography id='transition-modal-description' sx={{ color: 'text.secondary', mt: 2 }}>
                  Are you sure you want to open a USD Virtual Account?
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mt: '15px' }}>
                  <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{ borderColor: 'text.secondary', color: 'text.primary' }}
                  >
                    Go Back
                  </Button>
                  <Button onClick={handleNext} variant='contained'>
                    Submit Request
                  </Button>
                </Box>
              </Box>
            </Slide>
          </Modal>
        </Grid>
      </Grid>
    </>
  )
}

export default StepVirtualAccountList
