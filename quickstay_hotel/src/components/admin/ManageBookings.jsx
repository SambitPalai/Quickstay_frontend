import { useEffect, useState } from "react"
import { getAllBookings, cancelBooking } from "../utils/ApiFunctions"
import { FaTrashAlt } from "react-icons/fa"
import Header from "../common/Header"

const ManageBookings = () => {
    const [bookings,       setBookings]       = useState([])
    const [filteredBookings, setFilteredBookings] = useState([])
    const [isLoading,      setIsLoading]      = useState(false)
    const [errorMessage,   setErrorMessage]   = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery,    setSearchQuery]    = useState("")

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        setIsLoading(true)
        try {
            const data = await getAllBookings()
            setBookings(data)
            setFilteredBookings(data)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)
        const filtered = bookings.filter((booking) =>
            booking.bookingConfirmationCode.toLowerCase().includes(query) ||
            booking.guestEmail.toLowerCase().includes(query) ||
            booking.guestFullName.toLowerCase().includes(query)
        )
        setFilteredBookings(filtered)
    }

    const handleCancel = async (bookingId) => {
        try {
            await cancelBooking(bookingId)
            setSuccessMessage(`Booking #${bookingId} cancelled successfully.`)
            fetchBookings()
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
            <Header title="Manage Bookings" />

            {successMessage && (
                <div className="alert alert-success mt-3">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}

            {/* Search bar */}
            <div className="my-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by confirmation code, guest name or email..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {isLoading ? (
                <p>Loading bookings...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Confirmation Code</th>
                                <th>Guest Name</th>
                                <th>Guest Email</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Adults</th>
                                <th>Children</th>
                                <th>Room No.</th>
                                <th>Room Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {
                                    const status = (booking.bookingStatus || "CONFIRMED")
                                        .toString()
                                        .trim()
                                        .toUpperCase()
                                    const badgeClass =
                                        status === "CONFIRMED" ? "bg-success"  :
                                        status === "CANCELLED" ? "bg-success"  :
                                        status === "PENDING"   ? "bg-warning"  :
                                        "bg-secondary"

                                    return (
                                        <tr key={booking.bookingId}>
                                            <td>{booking.bookingId}</td>
                                            <td>{booking.bookingConfirmationCode}</td>
                                            <td>{booking.guestFullName}</td>
                                            <td>{booking.guestEmail}</td>
                                            <td>{booking.checkInDate}</td>
                                            <td>{booking.checkOutDate}</td>
                                            <td>{booking.numOfAdults}</td>
                                            <td>{booking.numOfChildren}</td>
                                            <td>{booking.room?.roomNo}</td>
                                            <td>{booking.room?.roomType}</td>
                                            <td>
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default ManageBookings
