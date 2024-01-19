import React from 'react'
import AppWorkspace from './components/AppWorkspace'
import { AppContextProvider } from './components/App.context';
import './App.css'

function App() {
  return (
    <AppContextProvider >
      <AppWorkspace />
    </AppContextProvider >
  );
}

export default App
