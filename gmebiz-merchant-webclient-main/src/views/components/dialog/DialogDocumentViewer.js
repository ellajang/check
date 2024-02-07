import Dialog from "@mui/material/Dialog";
import Fade from "@mui/material/Fade";
import {useTranslation} from "react-i18next";
import {forwardRef, useEffect, useState} from "react";
import {CustomCloseButton} from "../buttons/CustomCloseButton";
import {Icon} from "@iconify/react";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {resetViewFile, viewDocuments} from "../../../store/apps/document";
import {useAuth} from "../../../hooks/useAuth";
import { base64toFileUrl} from "../../../utils/base64toViewFile";
import {Viewer} from "@react-pdf-viewer/core";
import { Worker } from '@react-pdf-viewer/core';

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogDocumentViewer = ({show, handleDialog, item}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const fileType = item?.doc_name?.split('.').at(-1);

  const {viewFile} = useSelector(state=>state.documents);


  useEffect(() => {
    dispatch(resetViewFile())

    dispatch(viewDocuments(
      {
        "function":"VIEW",
        "scope":"SINGLE",
        "data": {
          "documents":[
            {
              "id": item?.id,
              "source_id": auth?.user?.source_id ,
              "source_type": "MERCHANT"
            }
          ]
        }
      }
    ))


  },[dispatch, item])


  return (
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
      <DialogContent
        sx={{
          px: theme => [`${theme.spacing(0)} !important`, `${theme.spacing(0)} !important`],
          py: theme => [`${theme.spacing(0)} !important`, `${theme.spacing(0)} !important`],
        }}>
        <CustomCloseButton onClick={() => handleDialog(false)}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        {
          fileType !== "" && fileType?.toLowerCase() === 'pdf' ?
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
              <Viewer fileUrl={ base64toFileUrl(viewFile) ?? "" }></Viewer>
            </Worker> :
            <Image
              width={0}
              height={0}
              src={base64toFileUrl(viewFile)}
              alt={item?.doc_name ?? 'Merchant Document'}
              style={{ width: '100%', height: 'auto' }}
              placeholder={'empty'}
             />
        }

      </DialogContent>
    </Dialog>
  );
}

export default DialogDocumentViewer;
