import { useState, useEffect } from "react"
import { api } from "../utils/ApiFunctions"
import Header from "../common/Header"
import { FaTrashAlt, FaUserShield, FaUserMinus, FaPlus } from "react-icons/fa"

const ManageAdmins = () => {
    const [admins,         setAdmins]         = useState([])
    const [isLoading,      setIsLoading]      = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage,   setErrorMessage]   = useState("")
    const [showForm,       setShowForm]       = useState(false)
    const [newAdmin, setNewAdmin] = useState({
        name: "", email: "", password: ""
    })

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        setIsLoading(true)
        try {
            const response = await api.get("/auth/admins")
            setAdmins(response.data)
        } catch (error) {
            setErrorMessage("Could not load admins.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateAdmin = async (e) => {
        e.preventDefault()
        try {
            await api.post("/auth/create-admin", newAdmin)
            setSuccessMessage(`Admin account created for ${newAdmin.email}`)
            setNewAdmin({ name: "", email: "", password: "" })
            setShowForm(false)
            fetchAdmins()
        } catch (error) {
            setErrorMessage(error.response?.data || "Failed to create admin.")
        }
        clearMessages()
    }

    const handleDelete = async (userId, email) => {
        if (!window.confirm(`Delete admin account for ${email}?`)) return
        try {
            await api.delete(`/auth/delete-admin/${userId}`)
            setSuccessMessage(`${email} has been removed.`)
            fetchAdmins()
        } catch (error) {
            setErrorMessage(error.response?.data || "Failed to delete admin.")
        }
        clearMessages()
    }

    const handleDemote = async (userId, email) => {
        if (!window.confirm(`Demote ${email} to regular user?`)) return
        try {
            await api.put(`/auth/demote/${userId}`)
            setSuccessMessage(`${email} is now a regular user.`)
            fetchAdmins()
        } catch (error) {
            setErrorMessage(error.response?.data || "Failed to demote.")
        }
        clearMessages()
    }

    const clearMessages = () => {
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

    return (
        <section className="container mt-5 mb-5">
            <Header title="Manage Admins" />

            {successMessage && (
                <div className="alert alert-success mt-3">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}

            {/* ── Create Admin Button ────────────────────────── */}
            <div className="d-flex justify-content-between align-items-center my-4">
                <h5 className="mb-0">Current Admins</h5>
                <button
                    className="btn btn-hotel"
                    onClick={() => setShowForm(!showForm)}>
                    <FaPlus className="me-2" />
                    {showForm ? "Cancel" : "Add New Admin"}
                </button>
            </div>

            {/* ── Create Admin Form ──────────────────────────── */}
            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h6 className="card-title hotel-color mb-3">New Admin Details</h6>
                        <form onSubmit={handleCreateAdmin}>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Full Name"
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({
                                            ...newAdmin, name: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <input
                                        required
                                        type="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({
                                            ...newAdmin, email: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <input
                                        required
                                        type="password"
                                        className="form-control"
                                        placeholder="Temporary Password"
                                        value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({
                                            ...newAdmin, password: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-hotel mt-3">
                                <FaUserShield className="me-2" />
                                Create Admin Account
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Admins Table ───────────────────────────────── */}
            {isLoading ? (
                <p>Loading admins...</p>
            ) : admins.length === 0 ? (
                <div className="alert alert-info">
                    No admin accounts yet. Create one above.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.userId}>
                                    <td>{admin.userId}</td>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>
                                        <span className="badge bg-warning text-dark">
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => handleDemote(
                                                admin.userId, admin.email
                                            )}>
                                            <FaUserMinus className="me-1" />
                                            Demote to User
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(
                                                admin.userId, admin.email
                                            )}>
                                            <FaTrashAlt className="me-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default ManageAdmins