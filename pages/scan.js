import { useRef, useState } from 'react'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import CropFree from '@material-ui/icons/CropFree'
import DataList from '../src/data-list'
import { parseQr } from '../src/parse-qr'
import { makeStyles } from '@material-ui/core/styles'
import * as idb from 'idb-keyval'
import { BrowserQRCodeReader } from '@zxing/browser'
import { createSVG } from '../src/utils'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  card: {
    width: '100%',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(9),
    left: '50%',
    transform: 'translateX(-50%)',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default function Home() {
  const classes = useStyles()
  const videoInput = useRef(null)
  const [open, setOpen] = React.useState(false)
  const [QRData, setQRData] = useState()
  const [QRHash, setQRHash] = useState()
  const [QRSVG, setQRSVG] = useState()

  const handleClose = () => {
    setOpen(false)
  }

  async function onScan() {
    // setQRData()
    const codeReader = new BrowserQRCodeReader()
    const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices()

    const raw = await codeReader.decodeFromVideoDevice(
      videoInputDevices[2].deviceId,
      videoInput.current,
      async (result, error, controls) => {
        console.error(error)
        if (result) {
          controls.stop()
          setOpen(true)
          setQRSVG(await createSVG(result.text))
          setQRHash(result.text)
          setQRData(parseQr(result.text))
        }
      }
    )
  }

  async function handleSave() {
    setOpen(false)
    await idb.set(QRHash, {
      image: QRSVG,
      data: QRData,
    })
  }
  return (
    <Box my={2} pb={12}>
      <Typography variant="h5" gutterBottom>
        Scan
      </Typography>
      <video ref={videoInput} width="100%" height="400px"></video>
      {QRData && (
        <DataList
          open={open}
          onClose={handleClose}
          onSave={handleSave}
          shouldSave
          data={QRData}
          image={QRSVG}
        />
      )}
      <Fab
        variant="extended"
        color="primary"
        aria-label="Start"
        className={classes.fab}
        onClick={onScan}
      >
        <CropFree className={classes.extendedIcon} />
        Start
      </Fab>
    </Box>
  )
}
