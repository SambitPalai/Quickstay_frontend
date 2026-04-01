import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { FaMoon, FaSun } from "react-icons/fa"

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false)
    const THEME_STORAGE_KEY = "quickstay-theme"
    const getInitialTheme = () => {
        if (typeof window === "undefined") {
            return "light"
        }
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === "dark" || stored === "light") {
            return stored
        }
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    }
    const [theme, setTheme] = useState(getInitialTheme)
    const { isLoggedIn,isOwner , isAdmin, logout, user } = useAuth()
    const navigate = useNavigate()

    const openAccountMenu = () => setShowAccount(true)
    const closeAccountMenu = () => setShowAccount(false)
    const handleAccountBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setShowAccount(false)
        }
    }
    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    const handleLogout = () => {
        logout()
        setShowAccount(false)
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <span className="hotel-color">Quickstay</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll gap-lg-3">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/browse-all-rooms">
                                Browse all rooms
                            </NavLink>
                        </li>

                        {(isAdmin() || isOwner()) && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to={isOwner() ? "/owner" : "/admin"}>
                                    {isOwner() ? "Owner Panel" : "Admin Panel"}
                            </NavLink>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-lg-3">
                        <li className="nav-item no-underline">
                            <button
                                className="theme-toggle"
                                type="button"
                                onClick={toggleTheme}
                                aria-label="Toggle dark mode"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <FaSun className="me-1" />
                                        Light
                                    </>
                                ) : (
                                    <>
                                        <FaMoon className="me-1" />
                                        Dark
                                    </>
                                )}
                            </button>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/find-booking">
                                Find my booking
                            </NavLink>
                        </li>
                        {isLoggedIn() && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to={isAdmin() || isOwner() ? "/admin/complaints" : "/complaints"}>
                                    Complaints
                                </NavLink>
                            </li>
                        )}

                        <li
                            className="nav-item dropdown"
                            onMouseEnter={openAccountMenu}
                            onMouseLeave={closeAccountMenu}
                            onFocus={openAccountMenu}
                            onBlur={handleAccountBlur}
                        >
                            <button
                                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={showAccount}
                            >
                                {/* Show name when logged in */}
                                {isLoggedIn() ? `Hi, ${user.name}` : "Account"}
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end ${showAccount ? "show" : ""}`}>
                                {isLoggedIn() ? (
                                    <>
                                        <li>
                                            <Link to="/profile" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                My Profile
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger"
                                                onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/login" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/signup" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                Sign Up
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
