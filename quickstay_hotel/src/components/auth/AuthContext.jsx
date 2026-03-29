import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Restore user from localStorage on page refresh
        const token = localStorage.getItem("token")
        const email = localStorage.getItem("email")
        const role  = localStorage.getItem("role")
        const name  = localStorage.getItem("name")
        return token ? { token, email, role, name } : null
    })

    const login = (userData) => {
        // userData = { token, email, role, name } from backend
        localStorage.setItem("token", userData.token)
        localStorage.setItem("email", userData.email)
        localStorage.setItem("role",  userData.role)
        localStorage.setItem("name",  userData.name)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        localStorage.removeItem("role")
        localStorage.removeItem("name")
        setUser(null)
    }

    const isOwner    = () => user?.role === "OWNER"
    const isAdmin = () => user?.role === "ADMIN"
    const isUser  = () => user?.role === "USER"
    const isLoggedIn = () => !!user

    return (
        <AuthContext.Provider value={{ user, login, logout, isOwner, isAdmin, isUser, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for easy access anywhere
export const useAuth = () => useContext(AuthContext)