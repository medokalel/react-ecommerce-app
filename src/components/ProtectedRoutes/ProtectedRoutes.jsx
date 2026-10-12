import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { userContext } from '../../Context/userContext'

// Reads the login state from context, so logging out sends the user to /auth immediately.
export default function ProtectedRoutes({ children }) {
  const { isLogin } = useContext(userContext)
  return isLogin ? children : <Navigate to="/auth" replace />
}
