import { useState } from "react"
import { getBookingByConfirmationCode, cancelBooking } from "../utils/ApiFunctions"
import Header from "../common/Header"
import { FaSearch } from "react-icons/fa"
import moment from "moment"

const FindBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState("")
    const [booking,          setBooking]          = useState(null)
    const [isLoading,        setIsLoading]        = useState(false)
    const [errorMessage,     setErrorMessage]     = useState("")
    const [successMessage,   setSuccessMessage]   = useState("")

    const handleSearch = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")
        setBooking(null)
        try {
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBooking(data)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = async () => {
        try {
            await cancelBooking(booking.bookingId)
            setSuccessMessage("Booking cancelled successfully.")
            setBooking(null)
            setConfirmationCode("")
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <section className="container mt-5 mb-5">
            <Header title="Find My Booking" />

            {/* ── Search Form ────────────────────────────────── */}
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-md-8 col-lg-6">
                    <form onSubmit={handleSearch}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your confirmation code..."
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                required
                            />
                            <button className="btn btn-hotel" type="submit">
                                <FaSearch className="me-1" />
                                {isLoading ? "Searching..." : "Find"}
                            </button>
                        </div>
                    </form>

                    {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}
                </div>
            </div>

            {/* ── Booking Result ─────────────────────────────── */}
            {booking && (
                <div className="row justify-content-center mt-3">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title hotel-color">Booking Details</h5>
                                <hr />
                                <ul className="summary-list">
                                    <li>
                                        <span className="summary-label">Confirmation Code :</span>
                                        <span>{booking.bookingConfirmationCode}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Guest Name :</span>
                                        <span>{booking.guestFullName}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Email :</span>
                                        <span>{booking.guestEmail}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Room Type :</span>
                                        <span>{booking.room?.roomType}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Check-In :</span>
                                        <span>{moment(booking.checkInDate, "YYYY-MM-DD", true).format("DD MMM YYYY")}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Check-Out :</span>
                                        <span>{moment(booking.checkOutDate, "YYYY-MM-DD", true).format("DD MMM YYYY")}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Adults :</span>
                                        <span>{booking.numOfAdults}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Children :</span>
                                        <span>{booking.numOfChildren}</span>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-danger w-100 mt-3"
                                    onClick={handleCancel}>
                                    Cancel This Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default FindBooking
