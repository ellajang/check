import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useDispatch, useSelector } from 'react-redux'
import {useEffect, useState} from 'react'
import {updateBusinessAddress, updateMerchantAddress} from '../../store/apps/onboarding'
import { useTranslation } from 'react-i18next'
import {TablePagination} from "@mui/material";
import {getAllAddress, updateNextPage, updatePreviousPage} from "../../store/apps/category";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Icon} from "@iconify/react";
import CustomPagination from "../components/pagination/CustomPagination";

const rows = []


const TableOnboardingAddress = ({ searchValues, handleDialog, language, scope }) => {
  const { businessAddressHtml: rows } = useSelector(state => state.category)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const {searchPage: page} = useSelector(state=>state.category)

  const handlePreviousPageClick = async () => {
    await dispatch(updatePreviousPage())
    dispatch(getAllAddress({
      value: searchValues ?? "",
      count: 100,
      page_number: page,
      language
    }))
  }

  const handleNextPageClick = async () => {
    await dispatch(updateNextPage())
      dispatch(getAllAddress({
        value: searchValues ?? "",
        count: 100,
        page_number: page,
        language
      }))
  }

  const handleRowClick = (row) => {
    handleDialog(false)
    if(scope === "businessAddress"){
      if(language === 'en'){
        dispatch(
          updateBusinessAddress({
            postalCode: row?.zipNo,
            addressLine1: `${row?.emdNm} ${row?.bdNm && ','} ${row?.bdNm}`,
            addressLine2: row?.roadAddr ?? "",
          })
        )
      } else if (langauge === 'kr'){
        dispatch(
          updateBusinessAddress({
            postalCode: row?.zipNo,
            addressLine1: `${row?.emdNm} ${row?.jibunAddr && ','} ${row?.jibunAddr}`,
            addressLine2: `${row?.roadAddrPart1} ${row?.roadAddrPart2 && ','} ${row?.roadAddrPart2}`,
          })
        )
      }
    } else if (scope === "businessAddressEdit") {
      if(language === 'en'){
        dispatch(
          updateMerchantAddress({
            postalCode: row?.zipNo,
            addressLine1: `${row?.emdNm} ${row?.bdNm && ','} ${row?.bdNm}`,
            addressLine2: row?.roadAddr ?? "",
          })
        )
      }else if (language === 'kr'){
        dispatch(
          updateMerchantAddress({
            postalCode: row?.zipNo,
            addressLine1: `${row?.emdNm} ${row?.jibunAddr && ','} ${row?.jibunAddr}`,
            addressLine2: `${row?.roadAddrPart1} ${row?.roadAddrPart2 && ','} ${row?.roadAddrPart2}`,
          })
        )
      }
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='left' sx={{ fontSize: '20px' }}>
              {t('Postal Code')}
            </TableCell>
            <TableCell align='left' sx={{ fontSize: '20px' }}>
              {t('Street Address')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(row)}
              sx={{
                '&:last-child td, &:last-child th': { border: 0, margin: 0 },
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <TableCell align='left'>{row?.zipNo}</TableCell>
              <TableCell align='left'>{row?.roadAddr}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/*custom pagination compopnent*/}
      <CustomPagination
        handlePreviousPageClick={handlePreviousPageClick}
        handleNextPageClick={handleNextPageClick}
        page={page}
      />

    </TableContainer>
  )
}

export default TableOnboardingAddress
