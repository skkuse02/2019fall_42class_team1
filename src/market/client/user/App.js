import React from 'react'
import MainRouter from './MainRouter'
import {BrowserRouter} from 'react-router-dom'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import { blueGrey, lightGreen } from 'material-ui/colors'
import { hot } from 'react-hot-loader'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
    light: '#8eacbb',
    main: '#2775e3',
    dark: '#3707ba',
    contrastText: '#fff',
  },
  secondary: {
    light: '#e7ff8c',
    main: '#b6ff61',
    dark: '#7ecb20',
    contrastText: '#000',
  },
    openTitle: green['400'],
    protectedTitle: lightGreen['400'],
    type: 'light'
  }
})

const App = () => (
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <MainRouter/>
    </MuiThemeProvider>
  </BrowserRouter>
)

export default hot(module)(App)
