import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D7377',
      light: '#14A098',
      dark: '#085E62',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F5A623',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1D23',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h4: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', backgroundColor: '#085E62' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': { color: '#0D7377' },
          '&.Mui-completed': { color: '#0D7377' },
        },
      },
    },
  },
});

export default theme;
