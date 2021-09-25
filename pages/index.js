import { useEffect, useState } from 'react'
import React from 'react'
import Add from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import DataList from '../src/data-list'
import { parseQr } from '../src/parse-qr'
import * as idb from 'idb-keyval'
import { readFileAsDataURL, createSVG, readFileAsBuffer } from '../src/utils'

/**
 * @typedef {import('../src/types').Cert} Cert
 */

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
  const [certs, setCerts] = useState(
    /**@type{[[string, Cert]]|undefined} */ (undefined)
  )
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(
    /**@type{Cert|undefined} */ (undefined)
  )

  /**
   *
   * @param {number} i
   */
  const handleClickOpen = (i) => {
    if (certs) {
      setSelected(certs[i][1])
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const updateCerts = async () => {
    setCerts(/** @type {[[String, Cert]]}*/ (await idb.entries()))
  }
  /**
   *
   * @param {string} key
   */
  const handleDelete = async (key) => {
    await idb.del(key)
    updateCerts()
  }

  useEffect(() => {
    async function run() {
      await updateCerts()
    }
    run()
  }, [])

  /**
   * @param {import('react').ChangeEvent<HTMLInputElement>} e
   */
  async function onFile(e) {
    const el = e.target

    if (el.files === null) {
      return
    }
    const file = el.files[0]

    try {
      let result
      if (file.type.startsWith('image/')) {
        result = await readFileAsDataURL(file)
      }

      if (file.type.startsWith('application/pdf')) {
        result = await readFileAsBuffer(file)
      }

      // TODO if no result throw

      const value = {
        image: await createSVG(result.text),
        data: parseQr(result.text),
      }
      await idb.set(result.text, value)
      updateCerts()
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <Box my={2}>
      <Typography variant="h5" gutterBottom>
        Wallet
      </Typography>

      {certs ? (
        <>
          <List>
            {certs.map(([key, cert], i) => (
              <ListItem
                button
                onClick={() => handleClickOpen(i)}
                key={`cert-${i}`}
              >
                <ListItemAvatar>
                  <Avatar>V</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={cert.data.name}
                  secondary={cert.data.issuedAt.toLocaleString()}
                />
                <ListItemSecondaryAction onClick={() => handleDelete(key)}>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {selected && (
            <DataList
              open={open}
              onClose={handleClose}
              data={selected.data}
              image={selected.image}
            />
          )}
        </>
      ) : (
        ''
      )}
      <input
        id="qr-file"
        type="file"
        onChange={onFile}
        hidden
        accept="image/*,application/pdf"
      />
      <Fab
        variant="extended"
        color="primary"
        aria-label="upload"
        className={classes.fab}
      >
        <label htmlFor="qr-file" style={{ display: 'inline-flex' }}>
          <Add className={classes.extendedIcon} />
          Certificate
        </label>
      </Fab>
    </Box>
  )
}
