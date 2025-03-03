import React from 'react'
import App from './App'
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Sidebar from '../Sidebar/Sidebar'
export default function Tickets() {
  return (
    <div style={{display:'flex',justifyContent:'space-between',  width:'100%'}}>
      <Sidebar/>
      <div className="card mx-auto" style={{width:'90%'}}>
    <PrimeReactProvider>
      <App/>
    </PrimeReactProvider>
    </div>
    </div>
  )
}
