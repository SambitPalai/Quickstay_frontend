import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Form, FormControl, Button, Modal, InputGroup } from "react-bootstrap"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { loginUser, forgotPassword, verifyOtp, resetPassword } from "../utils/ApiFunctions"
import { useAuth } from "./AuthContext"
import Header from "../common/Header"

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [errorMessage, setErrorMessage]   = useState("")
    const [isLoading, setIsLoading]         = useState(false)
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [forgotStep, setForgotStep]           = useState(1)
    const [forgotForm, setForgotForm]           = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [forgotError, setForgotError]     = useState("")
    const [forgotInfo, setForgotInfo]       = useState("")
    const [forgotLoading, setForgotLoading] = useState(false)
    const [showForgotNewPassword, setShowForgotNewPassword] = useState(false)
    const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false)

    const { login } = useAuth()
    const navigate  = useNavigate()
    const location  = useLocation()

    // Redirect back to where they came from, or home
    const from = location.state?.from?.pathname || "/"

    const handleChange = (e) => {
        const { name, value } = e.target
        const nextValue = name === "email" ? value.toLowerCase() : value
        setCredentials((prev) => ({ ...prev, [name]: nextValue }))
        setErrorMessage("")
    }

    const openForgotModal = () => {
        setForgotStep(1)
        setForgotForm({
            email: credentials.email || "",
            otp: "",
            newPassword: "",
            confirmPassword: ""
        })
        setForgotError("")
        setForgotInfo("")
        setForgotLoading(false)
        setShowForgotModal(true)
    }

    const closeForgotModal = () => {
        setShowForgotModal(false)
    }

    const handleForgotChange = (e) => {
        const { name, value } = e.target
        const nextValue = name === "email" ? value.toLowerCase() : value
        setForgotForm((prev) => ({ ...prev, [name]: nextValue }))
        setForgotError("")
    }

    const handleSendOtp = async (e) => {
        e.preventDefault()
        const normalizedEmail = forgotForm.email.trim().toLowerCase()
        if (!normalizedEmail) {
            setForgotError("Please enter your email.")
            return
        }
        setForgotLoading(true)
        setForgotError("")
        setForgotInfo("")
        try {
            const message = await forgotPassword(normalizedEmail)
            setForgotInfo(message || "If an account exists, OTP has been sent.")
            setForgotStep(2)
        } catch (error) {
            setForgotError(error.message)
        } finally {
            setForgotLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        if (!forgotForm.otp.trim()) {
            setForgotError("Please enter the OTP.")
            return
        }
        setForgotLoading(true)
        setForgotError("")
        setForgotInfo("")
        try {
            const normalizedEmail = forgotForm.email.trim().toLowerCase()
            const message = await verifyOtp(normalizedEmail, forgotForm.otp.trim())
            setForgotInfo(message || "OTP verified.")
            setForgotStep(3)
        } catch (error) {
            setForgotError(error.message)
        } finally {
            setForgotLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (forgotForm.newPassword.length < 6) {
            setForgotError("Password must be at least 6 characters.")
            return
        }
        if (forgotForm.newPassword !== forgotForm.confirmPassword) {
            setForgotError("Passwords do not match.")
            return
        }
        setForgotLoading(true)
        setForgotError("")
        setForgotInfo("")
        try {
            const normalizedEmail = forgotForm.email.trim().toLowerCase()
            const message = await resetPassword(
                normalizedEmail,
                forgotForm.newPassword,
                forgotForm.confirmPassword
            )
            setForgotInfo(message || "Password reset successful.")
            setCredentials((prev) => ({ ...prev, email: normalizedEmail || prev.email }))
            setForgotStep(4)
        } catch (error) {
            setForgotError(error.message)
        } finally {
            setForgotLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")
        try {
            const normalizedEmail = credentials.email.trim().toLowerCase()
            const userData = await loginUser({ ...credentials, email: normalizedEmail })
            login(userData)                          // save to context + localStorage
            navigate(from, { replace: true })        // redirect
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <Header title="Login" />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    {errorMessage && (
                        <div className="alert alert-danger fade show" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <FormControl
                                required
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                placeholder="Enter your email"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <InputGroup>
                                <FormControl
                                    required
                                    type={showLoginPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowLoginPassword((prev) => !prev)}
                                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                >
                                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <div className="d-flex justify-content-end mb-3">
                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={openForgotModal}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <Button type="submit" className="btn btn-hotel" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                            <Link to="/signup" className="text-decoration-none">
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
            <Modal show={showForgotModal} onHide={closeForgotModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {forgotError && (
                        <div className="alert alert-danger fade show" role="alert">
                            {forgotError}
                        </div>
                    )}
                    {forgotInfo && (
                        <div className="alert alert-success fade show" role="alert">
                            {forgotInfo}
                        </div>
                    )}

                    {forgotStep === 1 && (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="forgotEmail">Email</Form.Label>
                                <FormControl
                                    required
                                    type="email"
                                    id="forgotEmail"
                                    name="email"
                                    value={forgotForm.email}
                                    placeholder="Enter your account email"
                                    onChange={handleForgotChange}
                                />
                            </Form.Group>
                            <Button type="submit" className="btn btn-hotel w-100" disabled={forgotLoading}>
                                {forgotLoading ? "Sending..." : "Send OTP"}
                            </Button>
                        </Form>
                    )}

                    {forgotStep === 2 && (
                        <Form onSubmit={handleVerifyOtp}>
                            <p className="text-muted small mb-2">
                                Enter the OTP sent to {forgotForm.email || "your email"}.
                            </p>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="forgotOtp">OTP</Form.Label>
                                <FormControl
                                    required
                                    type="text"
                                    id="forgotOtp"
                                    name="otp"
                                    value={forgotForm.otp}
                                    placeholder="Enter OTP"
                                    onChange={handleForgotChange}
                                />
                            </Form.Group>
                            <div className="d-flex align-items-center justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={() => {
                                        setForgotStep(1)
                                        setForgotError("")
                                        setForgotInfo("")
                                    }}
                                >
                                    Change email
                                </button>
                                <Button type="submit" className="btn btn-hotel" disabled={forgotLoading}>
                                    {forgotLoading ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </div>
                            <div className="text-end mt-3">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={handleSendOtp}
                                    disabled={forgotLoading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </Form>
                    )}

                    {forgotStep === 3 && (
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="newPassword">New Password</Form.Label>
                                <InputGroup>
                                    <FormControl
                                        required
                                        type={showForgotNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={forgotForm.newPassword}
                                        placeholder="Create a new password"
                                        onChange={handleForgotChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={() => setShowForgotNewPassword((prev) => !prev)}
                                        aria-label={showForgotNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showForgotNewPassword ? <FiEyeOff /> : <FiEye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                                <InputGroup>
                                    <FormControl
                                        required
                                        type={showForgotConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={forgotForm.confirmPassword}
                                        placeholder="Re-enter new password"
                                        onChange={handleForgotChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={() => setShowForgotConfirmPassword((prev) => !prev)}
                                        aria-label={showForgotConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showForgotConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <div className="d-flex align-items-center justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={() => {
                                        setForgotStep(2)
                                        setForgotError("")
                                        setForgotInfo("")
                                    }}
                                >
                                    Back
                                </button>
                                <Button type="submit" className="btn btn-hotel" disabled={forgotLoading}>
                                    {forgotLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>
                        </Form>
                    )}

                    {forgotStep === 4 && (
                        <div className="text-center">
                            <h5 className="mb-2">Password Updated</h5>
                            <p className="text-muted mb-4">
                                You can now log in with your new password.
                            </p>
                            <Button type="button" className="btn btn-hotel" onClick={closeForgotModal}>
                                Back to Login
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Login
