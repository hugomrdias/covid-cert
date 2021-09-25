import { createTheme } from '@material-ui/core/styles'
import { deepOrange, blue } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: deepOrange,
  },
  overrides: {
    MuiFab: {
      label: {
        textTransform: 'initial',
      },
    },
  },
})

export default theme
