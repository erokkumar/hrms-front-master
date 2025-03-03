import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

export default function Sidebar() {
  return (
    <div style={{width:'6%',borderTopRightRadius:'40px',borderBottomRightRadius:'40px', position:'sticky', top:'0', height:'100vh'}}>
           
           <Link to='/' className='mt-5 sidelink' style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50px', width:'90%',borderBottomRightRadius:'15px',borderTopRightRadius:'15px'}}>

            <i class="fa-brands fa-microsoft fa-2x" ></i>
           </Link>
           <Link to='/leaves' className='mt-3 sidelink' style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50px',  width:'90%',borderBottomRightRadius:'15px',borderTopRightRadius:'15px'}}>

           <i class="fa-solid fa-calendar-days fa-2x"></i>
           </Link>
           <Link to='/tickets' className='mt-3 sidelink' style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50px',  width:'90%',borderBottomRightRadius:'15px',borderTopRightRadius:'15px'}}>

           <i class="fa-solid fa-ticket fa-2x"></i>
           </Link>
           <Link to='/tasks' className='mt-3 sidelink' style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50px',  width:'90%',borderBottomRightRadius:'15px',borderTopRightRadius:'15px'}}>

           <i class="fa-solid fa-clipboard fa-2x"></i>
           </Link>
        </div>
  )
}
