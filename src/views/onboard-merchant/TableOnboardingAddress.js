import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {updateBusinessAddress} from "../../store/apps/onboarding";
import {Translation} from "react-i18next";


const rows = [
];

const TableOnboardingAddress = ({handleDialog}) => {
  const {businessAddressHtml: rows} = useSelector(state=>state.category);
  const dispatch = useDispatch();
  const {t} = useTranslations();

  const handleRowClick = ( row) => {
    handleDialog(false)
    dispatch(updateBusinessAddress({
      postalCode: row?.zipNo,
      addressLine1: row?.roadAddrPart1,
      addressLine2: row?.roadAddrPart2,
      city: row?.roadAddr
    }))
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{fontSize:'20px'}}>
              {t('Zip Code')}
            </TableCell>
            <TableCell align="left" sx={{fontSize:'20px'}}>
              {t('Street Address')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows?.map((row, index) => (
            <TableRow
              key={index}
              onClick={()=>handleRowClick(row)}
              sx={{
                '&:last-child td, &:last-child th': { border: 0, margin: 0 },
                cursor: 'pointer',
                '&:hover':{
                  backgroundColor: '#f5f5f5'
                }
            }
            }
            >
              <TableCell align="left">{row?.zipNo}</TableCell>
              <TableCell align="left">{row?.roadAddr}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableOnboardingAddress;
