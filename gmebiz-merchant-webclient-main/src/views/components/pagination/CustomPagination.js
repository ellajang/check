import Button from "@mui/material/Button";
import {Icon} from "@iconify/react";
import Box from "@mui/material/Box";
import * as React from "react";

const CustomPagination = ({handlePreviousPageClick, handleNextPageClick, page}) => {
  return (
    <Box sx={{
      display:'flex',
      justifyContent:'end',
      alignItems: 'center',
      gap: 2,
      mt: 4,
      mr: 4
    }}>
      <Button
        onClick={handlePreviousPageClick}
        variant={'contained'}
        startIcon={<Icon icon={'tabler:caret-left'}/>}
        disabled={Number(1) <= 1}
      >
        Previous
      </Button>
      <Box
        sx={{
          width: '50px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'secondary.main',
          color: 'white',
          border: 'none',
          borderRadius: '10px'
        }}>
        {page}
      </Box>
      <Button
        onClick={handleNextPageClick}
        variant={'contained'}
        startIcon={<Icon icon={'tabler:caret-right'}/>}>
        Next
      </Button>
    </Box>
  )
}

export default CustomPagination
