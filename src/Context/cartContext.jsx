import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { userContext } from './userContext'
import { API_BASE, authHeaders } from '../utils/auth'

export const cartContext = createContext()

// Every request rejects on failure so each screen can show its own error.
// The token is read when the request is sent (authHeaders), not when this file loads.
export default function CartContextProvider({ children }) {
  const { isLogin } = useContext(userContext)
  const [cartNumber, setCartNumber] = useState(0)

  const addProductToCart = useCallback(async (id) => {
    const response = await axios.post(`${API_BASE}/cart`, { productId: id }, { headers: authHeaders() })
    setCartNumber(response.data.numOfCartItems)
    return response
  }, [])

  const getProductToCart = useCallback(async () => {
    const response = await axios.get(`${API_BASE}/cart`, { headers: authHeaders() })
    setCartNumber(response.data.numOfCartItems)
    return response
  }, [])

  const deleteProductFromCart = useCallback(async (productId) => {
    const response = await axios.delete(`${API_BASE}/cart/${productId}`, { headers: authHeaders() })
    setCartNumber(response.data.numOfCartItems)
    return response
  }, [])

  const updateProductInCart = useCallback(async (productId, count) => {
    const response = await axios.put(`${API_BASE}/cart/${productId}`, { count }, { headers: authHeaders() })
    setCartNumber(response.data.numOfCartItems)
    return response
  }, [])

  // Load the badge count after login (and on first load when already logged in); reset it on logout.
  useEffect(() => {
    if (!isLogin) return
    let cancelled = false
    axios
      .get(`${API_BASE}/cart`, { headers: authHeaders() })
      .then((response) => { if (!cancelled) setCartNumber(response.data.numOfCartItems) })
      .catch(() => { /* the badge simply stays at its last value */ })
    return () => { cancelled = true }
  }, [isLogin])

  const value = useMemo(
    () => ({
      addProductToCart,
      getProductToCart,
      deleteProductFromCart,
      updateProductInCart,
      cartNumber: isLogin ? cartNumber : 0,
    }),
    [addProductToCart, getProductToCart, deleteProductFromCart, updateProductInCart, cartNumber, isLogin],
  )

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>
}
