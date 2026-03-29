import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { getMyBookings, cancelBooking } from "../utils/ApiFunctions"
import Header from "../common/Header"
import { FaTrashAlt, FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa"
import moment from "moment"

const UserProfile = () => {
    const { user }                              = useAuth()
    const [bookings,        setBookings]        = useState([])
    const [isLoading,       setIsLoading]       = useState(false)
    const [errorMessage,    setErrorMessage]    = useState("")
    const [successMessage,  setSuccessMessage]  = useState("")

    useEffect(() => {
        if (user?.email) fetchUserBookings()
    }, [user])

    const fetchUserBookings = async () => {
        setIsLoading(true)
        try {
            // ---- Now calls dedicated backend endpoint ---------------
            const data = await getMyBookings()
            setBookings(data)
        } catch (error) {
            setErrorMessage("Could not load your bookings.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = async (bookingId) => {
        try {
            await cancelBooking(bookingId)
            setSuccessMessage(`Booking #${bookingId} cancelled successfully.`)
            fetchUserBookings()
        } catch (error) {
            setErrorMessage(error.message)
        }
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

    return (
        <section className="container mt-5 mb-5">
            <Header title="My Profile" />

            {/* ---  Account Info Card ------------------------- */}
            <div className="card shadow-sm mt-4 mb-4">
                <div className="card-body">
                    <h5 className="card-title hotel-color mb-3">Account Details</h5>
                    <p>
                        <FaUser className="me-2 hotel-color" />
                        <strong>Name : </strong>{user?.name}
                    </p>
                    <p>
                        <FaEnvelope className="me-2 hotel-color" />
                        <strong>Email : </strong>{user?.email}
                    </p>
                    <p>
                        <FaShieldAlt className="me-2 hotel-color" />
                        <strong>Role : </strong>
                        <span className={`badge ${user?.role === "ADMIN"
                            ? "bg-danger" : "bg-success"}`}>
                            {user?.role}
                        </span>
                    </p>
                </div>
            </div>

            {/* ---- Booking History ----------------------  */}
            <h5 className="mb-3">My Booking History</h5>

            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}

            {isLoading ? (
                <p>Loading your bookings...</p>
            ) : bookings.length === 0 ? (
                <div className="alert alert-info">
                    You have no bookings yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Confirmation Code</th>
                                <th>Room Type</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Adults</th>
                                <th>Children</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const status = (booking.bookingStatus || "CONFIRMED")
                                    .toString()
                                    .trim()
                                    .toUpperCase()
                                const badgeClass =
                                    status === "CONFIRMED" ? "bg-success" :
                                    status === "CANCELLED" ? "bg-success" :
                                    status === "PENDING" ? "bg-warning" :
                                    "bg-secondary"

                                return (
                                    <tr key={booking.bookingId}>
                                        <td>{booking.bookingConfirmationCode}</td>
                                        <td>{booking.room?.roomType}</td>
                                        <td>{moment(booking.checkInDate, "YYYY-MM-DD", true).format("DD MMM YYYY")}</td>
                                        <td>{moment(booking.checkOutDate, "YYYY-MM-DD", true).format("DD MMM YYYY")}</td>
                                        <td>{booking.numOfAdults}</td>
                                        <td>{booking.numOfChildren}</td>
                                        <td>
                                            {/* ── Booking status badge ── */}
                                            <span className={`badge ${badgeClass}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancel(booking.bookingId)}>
                                                <FaTrashAlt /> Cancel
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default UserProfile
