import { useState } from "react"
import { Form, FormControl, Button, InputGroup } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../utils/ApiFunctions"
import { useAuth } from "./AuthContext"
import Header from "../common/Header"
import { FiEye, FiEyeOff } from "react-icons/fi"

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errorMessage,   setErrorMessage]   = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading,      setIsLoading]      = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { login } = useAuth()
    const navigate  = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        const nextValue = name === "email" ? value.toLowerCase() : value
        setForm((prev) => ({ ...prev, [name]: nextValue }))
        setErrorMessage("")
        setSuccessMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            const normalizedEmail = form.email.trim().toLowerCase()
            const userData = await registerUser({
                name:     form.name,
                email:    normalizedEmail,
                password: form.password
            })
            login(userData)             // auto-login after registration
            setSuccessMessage("Registration successful! Redirecting...")
            setTimeout(() => navigate("/"), 1500)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <Header title="Sign Up" />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    {errorMessage && (
                        <div className="alert alert-danger fade show" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success fade show" role="alert">
                            {successMessage}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Full Name</Form.Label>
                            <FormControl
                                required
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                placeholder="Enter your full name"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <FormControl
                                required
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                placeholder="Enter your email"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <InputGroup>
                                <FormControl
                                    required
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    placeholder="Create a password"
                                    onChange={handleChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                            <InputGroup>
                                <FormControl
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    placeholder="Re-enter your password"
                                    onChange={handleChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <div className="d-flex align-items-center justify-content-between">
                            <Button type="submit" className="btn btn-hotel" disabled={isLoading}>
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </Button>
                            <Link to="/login" className="text-decoration-none">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Signup
