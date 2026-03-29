import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

// Usage:
// <ProtectedRoute>                        → any logged-in user
// <ProtectedRoute adminOnly>              → ADMIN or OWNER
// <ProtectedRoute ownerOnly>             → OWNER only

const ProtectedRoute = ({ children, adminOnly = false, ownerOnly = false }) => {
    const { isLoggedIn, isAdmin, isOwner } = useAuth()

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />
    }

    if (ownerOnly && !isOwner()) {
        return <Navigate to="/unauthorized" replace />
    }

    if (adminOnly && !isAdmin() && !isOwner()) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute