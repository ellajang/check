import Grid from "@mui/material/Grid";
import Icon from "../../../@core/components/icon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {useEffect, useState} from "react";
import DialogDocumentViewer from "../../components/dialog/DialogDocumentViewer";
import {useDispatch, useSelector} from "react-redux";
import {resetViewFile} from "../../../store/apps/document";
import DialogDocumentDeleteConfirmation from "../../components/dialog/DialogDocumentDeleteConfirmation";

const CardCommonDocuments = ({handleClick, item={}, docName, doc=''}) => {
  // states
  const [showDocumentDialog, setShowDocumentDialog] = useState(null);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  const dispatch = useDispatch();

  const handleShowDeleteConfirmation = (show) => {
    setShowDeleteConfirmationDialog(show)
  }

  const handleShowDocumentDialog = (doc) => {
    setShowDocumentDialog(doc)
  }
  const docNameLength = 40;
  const shortDocName= docName?.slice(0, docNameLength);

  return (
    <Grid item xs={12} sm={12}>
      <Grid
        container
        spacing={2}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          height: '66px',
          border: `1px solid `,
          borderColor: 'secondary.main',
          padding: '9px 8px 9px 8px',
          m: 0
        }}
      >
        <Grid item xs={2}>
          <Icon color='#1890FF' icon='icomoon-free:file-pdf' width='26' height='26' />
        </Grid>
        <Grid item xs={6}>
          <Typography color='#1890FF'>
            {shortDocName}{shortDocName?.length === docNameLength ? '...' : ''}
          </Typography>
        </Grid>
        <Grid item xs={4}>
            <Box
              sx={{
                '&:hover': {
                  background: '#fff',
                },
                display: 'flex',
                alignItems: 'end',
                ml: 10,
                gap: 2
              }}
            >
              {item && Object.keys(item).length > 0 && <IconButton onClick={() => setShowDocumentDialog(true)}>
                <Icon color='#1890FF' icon='lets-icons:view-alt' width='14' height='14'/>
              </IconButton>}
              <IconButton onClick={()=>setShowDeleteConfirmationDialog(true)}>
                <Icon color='#1890FF' icon='ant-design:delete-outlined' width='14' height='14' />
              </IconButton>
            </Box>
        </Grid>
      </Grid>

      {showDocumentDialog && <DialogDocumentViewer
        show={showDocumentDialog}
        handleDialog={handleShowDocumentDialog}
        item={item}
        doc={doc}/>}

      {showDeleteConfirmationDialog && <DialogDocumentDeleteConfirmation
        handleDialog={handleShowDeleteConfirmation}
        show={handleShowDeleteConfirmation}
        handleConfirmation={handleClick}
      />}

    </Grid>
  );
}

export default CardCommonDocuments;
