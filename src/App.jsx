import './App.css'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './components/MainLayout/MainLayout'
import Home from './components/Home/Home'
import NotFound from './components/NotFound/NotFound'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import UserContextProvider from './Context/userContext'
import CartContextProvider from './Context/cartContext'

// Heavier pages load on demand, so the first visit downloads less JavaScript.
const Auth = lazy(() => import('./components/Auth/Auth'))
const Login = lazy(() => import('./components/Login/Login'))
const SignUp = lazy(() => import('./components/SignUp/SignUp'))
const Products = lazy(() => import('./components/Products/Products'))
const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails'))
const Cart = lazy(() => import('./components/Cart/Cart'))
const Checkout = lazy(() => import('./components/Checkout/Checkout'))
const Allorders = lazy(() => import('./components/Allorders/Allorders'))
const Brands = lazy(() => import('./components/Brands/Brands'))

const router = createBrowserRouter([
  {
    path: '',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: 'products', element: <ProtectedRoutes><Products /></ProtectedRoutes> },
      { path: 'productdetails/:id', element: <ProtectedRoutes><ProductDetails /></ProtectedRoutes> },
      { path: 'cart', element: <ProtectedRoutes><Cart /></ProtectedRoutes> },
      { path: 'allorders', element: <ProtectedRoutes><Allorders /></ProtectedRoutes> },
      { path: 'brands', element: <ProtectedRoutes><Brands /></ProtectedRoutes> },
      { path: 'checkout/:cartId', element: <ProtectedRoutes><Checkout /></ProtectedRoutes> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: 'auth',
    element: <Auth />,
    children: [
      { index: true, element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
])

export default function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <Suspense fallback={<div className="text-center py-5" role="status">Loading…</div>}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </CartContextProvider>
    </UserContextProvider>
  )
}
