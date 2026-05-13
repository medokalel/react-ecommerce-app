import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import MainLayout from './components/MainLayout/MainLayout'
import Home from './components/Home/Home'
import Products from './components/Products/Products'
import Auth from './components/Auth/Auth'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import NotFound from './components/NotFound/NotFound'
import UserContextProvider from './Context/userContext'
import CartContextProvider from './Context/cartContext'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import ProductDetails from './components/ProductDetails/ProductDetails'
import Cart from './components/Cart/Cart'
import Toast,{Toaster} from 'react-hot-toast'
import Checkout from './components/Checkout/Checkout'
import Allorders from './components/Allorders/Allorders'
import Brands from './components/Brands/Brands'


// <ProtectedRoutes></ProtectedRoutes>

function App() {

  let pahts = createBrowserRouter([
    {path:'' ,element:<MainLayout/>,children:[
      {index: true,element:<Home/>},
      {path:'home',element: <ProtectedRoutes><Home/></ProtectedRoutes> },
      {path:'products',element: <ProtectedRoutes><Products/></ProtectedRoutes> },
      {path:'productdetails/:id',element: <ProtectedRoutes><ProductDetails/></ProtectedRoutes>},
      {path:'cart',element: <ProtectedRoutes><Cart/></ProtectedRoutes>},
      {path:'allorders',element: <ProtectedRoutes><Allorders/></ProtectedRoutes>},
      {path:'brands',element: <ProtectedRoutes><Brands/></ProtectedRoutes>},
      {path:'checkout/:cartId',element: <ProtectedRoutes><Checkout/></ProtectedRoutes>},
      {path:'*',element:<ProtectedRoutes><NotFound/></ProtectedRoutes>},
    ]},
    {path:'auth',element:<Auth/>,children:[
        {index: true,element:<Login/>},
        {path:'login',element:<Login/>},
        {path:'signup',element:<SignUp/>},
    ]},
  ])

  return (
    <CartContextProvider> 
      <UserContextProvider>
        <RouterProvider router={pahts}></RouterProvider>
        <Toaster/>
      </UserContextProvider>
    </CartContextProvider>
  )
}

export default App
