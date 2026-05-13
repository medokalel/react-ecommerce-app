import React from 'react'
import { Outlet } from 'react-router-dom'
import MyNavbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
      <MyNavbar></MyNavbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  )
}
