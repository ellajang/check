import Box from "@mui/material/Box";
import {Dialog, DialogContent, TablePagination} from "@mui/material";
import {Icon} from "@iconify/react";
import Typography from "@mui/material/Typography";
import {forwardRef, useState,} from "react";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CustomTextField from "../../../@core/components/mui/text-field";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {useDispatch, useSelector} from "react-redux";
import {Controller, useForm} from "react-hook-form";
import {getAllAddress, updateNextPage} from "../../../store/apps/category";
import {CustomCloseButton} from "../buttons/CustomCloseButton";
import TableOnboardingAddress from "../../onboard-merchant/TableOnboardingAddress";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {useTranslation} from "react-i18next";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})


const DialogAddressHtml = ({ handleDialog, show, scope}) =>{
  const dispatch = useDispatch();
  const {businessAddressHtml, businessAddressLoading: loading} = useSelector(state=>state.category);
  const [language, setLanguage] = useState('kr')
  const {t} = useTranslation();
  const {searchPage: page} = useSelector(state=>state.category)

  const schema = yup.object().shape({
    searchValues: yup.string().min(2, t('Keyword must be at least 2 characters')),
  });


  const {control, handleSubmit, reset, getValues, formState:{errors}, watch} = useForm({
    defaultValues: {
      searchValues: ''
    },
    resolver: yupResolver(schema),
  });


  const handleSearch = (data) => {
    if(data.searchValues !== undefined || data.searchValues !== null || data.searchValues !== "") {
      dispatch(getAllAddress({
        value: data.searchValues,
        count: 100,
        page_number: page,
        language
      }))
    }
  }

  return (
    <Box>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => handleDialog(true)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleDialog(false)}
        sx={{ '& .MuiDialog-paper': {
          overflow: 'visible',
        }}}
      >
        <DialogTitle>
          <Typography
            variant={'h4'}
            sx={{
              fontWeight: 700,
              fontSize: '20px'
            }}
          >
            {t('Search Address')}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(2)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(2)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(5)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => handleDialog(false)}>
           <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 2, textAlign: 'start' }}>
            <Card>
              <Box sx={{
                p: 3,
              }}>
                <Box sx={{
                  p: 2,
                  pb: 0
                }}>
                  <form onSubmit={handleSubmit(handleSearch)}>
                    <Controller
                      name={'searchValues'}
                      control={control}
                      render={({field})=>(
                        <CustomTextField
                          {...field}
                          fullWidth={true}
                          maxWidth='md'
                          sx={{
                            backgroundColor:'white',
                            outlineColor: 'white',
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  type={'submit'}
                                  onClick={handleSearch}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon fontSize='1.25rem' icon={'tabler:search'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />)}
                    >
                    </Controller>
                    <Typography variant="caption" color="error">
                      {errors.searchValues?.message}
                    </Typography>
                    <RadioGroup
                      row
                      name='simple-radio'
                      aria-label='simple-radio'
                      value={language}
                      onChange={(e)=>setLanguage(e.target.value)}
                    >
                      <FormControlLabel value='kr' control={<Radio />} label='한국어 (Korean)' />
                      <FormControlLabel value='en' control={<Radio />} label={t('English')} />
                    </RadioGroup>

                  </form>
                </Box>
              </Box>
                {!loading && businessAddressHtml?.length !== 0 &&
                  <TableOnboardingAddress
                    searchValues={getValues("searchValues")}
                    handleDialog={handleDialog}
                    language={language}
                    scope={scope}
                  />
                }
              <Box
                  sx={{
                    p: 6,
                    mt:10,
                    display:'flex',
                    justifyContent:'center'
                }}
                >
                  {loading && <span class="loader"></span>}
                </Box>

            </Card>
          </Box>
        </DialogContent>
        <Box
          onClick={()=>handleDialog(false)}
          sx={{
            display:'flex',
            justifyContent:'center',
            alignItems: 'center',
            mb: 2,
        }}>
          <Button
            variant= 'outlined'
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>

  );
}

export default DialogAddressHtml;
