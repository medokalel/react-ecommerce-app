import { createContext, useState } from 'react'

export const userContext = createContext()

export default function UserContextProvider({ children }) {
  // Lazy initial value: no effect needed, and a missing token is null (it used to become undefined).
  const [isLogin, setLogin] = useState(() => localStorage.getItem('userToken'))

  return (
    <userContext.Provider value={{ isLogin, setLogin }}>
      {children}
    </userContext.Provider>
  )
}
