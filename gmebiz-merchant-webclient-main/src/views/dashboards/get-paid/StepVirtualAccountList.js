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
import Chip from '@mui/material/Chip'

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

const StepVirtualAccountList = ({ handleNext, handlePrev, formData, setFormData }) => {
  const dispatch = useDispatch()

  // const { countries } = useSelector(state => state.country)

  const defaultValues = {
    virtualAccountSelect: formData.accountType
  }

  const onSubmit = data => {
    //console.log(data)

    setFormData({ ...formData, virtualAccount: data.virtualAccountSelect })
    handleNext()
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  //console.log("coutnire", countries)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GMETitle
          title='Available Virtual Accounts'
          subTitle='Choose an account in which you would prefer to receive your funds'
        />
        <Grid container spacing={5} sx={{ mb: 16, minHeight: 250 }}>
          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={`https://img.icons8.com/color/48/${formData.accountType.flag[1]}-circular.png`}
                    alt='great-britain-circular'
                    sx={{ height: 36, width: 36 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={formData.accountType.name[1]} secondary='893832953278' />
                <ListItemSecondaryAction>
                  <IconButton edge='end'>
                    <Icon icon='ic:round-greater-than' color='black' />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Button onClick={handleSubmit} fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 4 }}>
          <Icon icon='ic:sharp-plus' />
          <Typography sx={{ ml: '8px', color: 'white' }} display='inline'>
            Open New Virtual Account
          </Typography>
        </Button>
        <Chip sx={{ mr: 4 }} label='CLICK BUTTON ABOVE' color='success' size='small' variant='outlined' />
      </form>
    </>
  )
}

export default StepVirtualAccountList
