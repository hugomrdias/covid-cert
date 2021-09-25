/* eslint-disable @next/next/no-img-element */
import React from 'react'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Slide from '@material-ui/core/Slide'
import Save from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import AppBar from '@material-ui/core/AppBar'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

/**
 *
 * @param {Object} options
 * @param {string} options.image
 * @param {import('../src/types').Cert['data']} options.data
 * @param {any} options.onClose
 * @param {any} [options.onSave]
 * @param {boolean} options.open
 * @param {boolean} [options.shouldSave]
 * @returns
 */
export default function DataList({
  image,
  data,
  onClose,
  onSave,
  open,
  shouldSave,
}) {
  const classes = useStyles()

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      // @ts-ignore
      TransitionComponent={Transition}
    >
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            EU COVID Certificate
          </Typography>
          {shouldSave && (
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              startIcon={<Save />}
            >
              save
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <DialogTitle style={{ textAlign: 'center', marginTop: '100px' }}>
        <img src={image} alt="qr-code" style={{ backgroundColor: 'white' }} />
      </DialogTitle>
      <List>
        <ListSubheader disableSticky>Certificate Info</ListSubheader>
        <ListItemText2 primary="Name" secondary={data.name} />
        <ListItemText2 primary="Birth Date" secondary={data.dateOfBirth} />
        <ListItemText2 primary="Issuer" secondary={data.issuer} />
        <ListItemText2
          primary="Issued at"
          secondary={data.issuedAt.toLocaleString()}
        />
        <ListItemText2
          primary="Expiration Date"
          secondary={data.expirationDate.toLocaleString()}
        />
        <ListItemText2
          primary="Version"
          secondary={data.schemaVersion}
          divider
        />
        <ListSubheader disableSticky>Vaccination Info</ListSubheader>
        {data.vaccination && (
          <>
            <ListItemText2
              primary="Disease or agent targeted"
              secondary={data.vaccination.diseaseAgentTargeted}
            />
            <ListItemText2
              primary="Vaccine or prophylaxis"
              secondary={data.vaccination.vaccineProphylaxis}
            />
            <ListItemText2
              primary="Vaccine medicinal product"
              secondary={data.vaccination.vaccineMedicinalProduct}
            />
            <ListItemText2
              primary="Manufacturer"
              secondary={data.vaccination.manufacturer}
            />
            <ListItemText2
              primary="Doses"
              secondary={
                data.vaccination.doseNumber +
                ' / ' +
                data.vaccination.totalDoses
              }
            />
            <ListItemText2
              primary="Date of Vaccination"
              secondary={data.vaccination.date}
            />
            <ListItemText2
              primary="Country of Vaccination"
              secondary={data.vaccination.country}
            />
            <ListItemText2
              primary="Certificate Issuer"
              secondary={data.vaccination.issuer}
            />
            <ListItemText2
              primary="Unique Certificate Identifier: UVCI"
              secondary={data.vaccination.certId}
            />
          </>
        )}
      </List>
    </Dialog>
  )
}

/**
 * Custom ListItemText component
 * @param {Object} options
 * @param {string} options.primary
 * @param {string} options.secondary
 * @param {boolean} [options.divider]
 * @returns
 */
function ListItemText2({ primary, secondary, divider }) {
  return (
    <ListItem divider={divider} dense>
      <ListItemText
        primary={primary}
        secondary={secondary}
        style={{ overflow: 'auto' }}
      />
    </ListItem>
  )
}
