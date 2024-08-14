import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import Dashboard from './components/Dashboard';
import store from './store';
import theme from './theme/theme.js';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
}

export default App;