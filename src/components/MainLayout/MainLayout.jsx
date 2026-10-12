import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import MyNavbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
      <MyNavbar />
      <main id="main">
        <Suspense fallback={<div className="text-center py-5" role="status">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
