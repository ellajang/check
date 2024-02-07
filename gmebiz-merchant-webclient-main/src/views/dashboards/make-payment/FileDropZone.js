// ** React Imports
import {Fragment, React, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import Translations from 'src/layouts/components/Translations'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { useTheme } from '@mui/material/styles'

import getBase64 from 'src/utils/getBase64'

const FileDropZone = ({ files, setFiles }) => {
  // ** State
  //const [files, setFiles] = useState([])
  const theme = useTheme()

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      // setFiles(acceptedFiles.map(file => Object.assign(file)))

      getBase64(acceptedFiles, true).then(pictureFile => {
        setFiles(pictureFile)
      })
    },
    multiple: false
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000}? {Math.round(file.size / 100) / 10000}.toFixed(1) mb :{' '}
            {Math.round(file.size / 100) / 10}.toFixed(1) kb
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '16px 0 16px 0',
            border: '1px ',
            borderColor: 'neutral.dark5',
            borderStyle: 'solid',
            borderRadius: '2px',
            bgcolor: 'neutral.dark1'
          }}
        >
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon icon='uiw:inbox' fontSize='1.75rem' color='#1890FF' />
          </Box>
          <Typography variant='h5' sx={{ mb: 2.5 }}>
            <Translations text='Click or drag file to this area to upload' />
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 2.5 }}>
            <Translations text={`Acceptable file size is less than ${process.env.NEXT_PUBLIC_DOCUMENT_LIMIT}MB, jpg, png or pdf`} />
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            (
            <Translations text='Supports single upload. Strictly prohibits the upload of company data or other banned files' />
            )
          </Typography>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileDropZone
