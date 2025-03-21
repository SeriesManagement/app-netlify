import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a dark theme with black and #ff0062 (vibrant pink) as main colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0062',
    },
    secondary: {
      main: '#fe0062',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#ff5252',
    },
    info: {
      main: '#ff0062',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
      <ToastContainer 
        position="bottom-right"
        theme="dark"
        toastStyle={{ backgroundColor: '#121212', color: '#ffffff' }}
      />
    </ThemeProvider>
  );
}

export default MyApp;
