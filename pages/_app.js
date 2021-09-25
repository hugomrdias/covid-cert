import '../styles/globals.css'
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AccountCircle from '@material-ui/icons/AccountCircle'
import FavoriteIcon from '@material-ui/icons/Favorite'
import CropFree from '@material-ui/icons/CropFree'

const useStyles = makeStyles((theme) => ({
  root: {},
  main: {
    // minHeight: '100vh',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
}))

export default function MyApp(props) {
  const { Component, pageProps } = props
  const classes = useStyles()
  const router = useRouter()
  const [value, setValue] = React.useState(router.pathname)

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <>
          <Container component="main" className={classes.main} maxWidth="sm">
            <Component {...pageProps} />
          </Container>
          <BottomNavigation
            className={classes.footer}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue)
              router.push(newValue)
            }}
            showLabels
          >
            <BottomNavigationAction
              value="/"
              label="Wallet"
              icon={<AccountCircle />}
            />
            {/* <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} /> */}
            <BottomNavigationAction
              value="/scan"
              label="Scan"
              icon={<CropFree />}
            />
          </BottomNavigation>
        </>
      </ThemeProvider>
    </React.Fragment>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
