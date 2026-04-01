import { useEffect, useMemo, useState } from "react"
import moment from "moment"
import Header from "../common/Header"
import { createComplaint, getMyBookings, getMyComplaints } from "../utils/ApiFunctions"
import { FaRegCommentDots } from "react-icons/fa"

const normalizeStatus = (status) => {
    const value = (status || "OPEN").toString().trim().toUpperCase()
    if (value === "IN PROGRESS" || value === "INPROGRESS") {
        return "IN_PROGRESS"
    }
    return value
}

const statusBadgeClass = (status) => {
    switch (normalizeStatus(status)) {
        case "OPEN":
            return "bg-warning text-dark"
        case "IN_PROGRESS":
            return "bg-info text-dark"
        case "RESOLVED":
            return "bg-success"
        default:
            return "bg-secondary"
    }
}

const getRoomNo = (complaint) =>
    complaint?.roomNo ||
    complaint?.roomNumber ||
    complaint?.room?.roomNo ||
    complaint?.bookedRoom?.roomNo ||
    "-"

const getBookingId = (complaint) =>
    complaint?.bookingId ||
    complaint?.booking?.bookingId ||
    complaint?.bookingRef ||
    "-"

const getTimestamp = (complaint) =>
    complaint?.createdAt ||
    complaint?.timestamp ||
    complaint?.createdOn ||
    complaint?.date ||
    null

const UserComplaints = () => {
    const [formData, setFormData] = useState({
        roomNo: "",
        bookingId: "",
        message: ""
    })
    const [bookings, setBookings] = useState([])
    const [complaints, setComplaints] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        fetchComplaints()
        fetchBookings()
    }, [])

    const fetchComplaints = async () => {
        setIsLoading(true)
        try {
            const data = await getMyComplaints()
            setComplaints(Array.isArray(data) ? data : [])
        } catch (error) {
            setErrorMessage(error.message || "Could not load your complaints.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings()
            setBookings(Array.isArray(data) ? data : [])
        } catch (error) {
            // Keep complaints usable even if bookings fail to load
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleBookingChange = (event) => {
        const bookingId = event.target.value
        const selected = bookings.find(
            (booking) => String(booking.bookingId) === String(bookingId)
        )
        const roomNo =
            selected?.room?.roomNo ||
            selected?.roomNo ||
            selected?.room?.roomNumber ||
            formData.roomNo
        setFormData((prev) => ({ ...prev, bookingId, roomNo }))
    }

    const clearMessages = () => {
        setTimeout(() => {
            setErrorMessage("")
            setSuccessMessage("")
        }, 3000)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        const trimmedMessage = formData.message.trim()
        const trimmedRoomNo = formData.roomNo.trim()
        if (!trimmedMessage || !trimmedRoomNo) {
            setErrorMessage("Please enter both a room number and a message.")
            clearMessages()
            return
        }

        setIsSubmitting(true)
        try {
            await createComplaint({
                roomNo: trimmedRoomNo,
                message: trimmedMessage,
                bookingId: formData.bookingId || null
            })
            setSuccessMessage("Complaint submitted. Our team will respond soon.")
            setFormData({ roomNo: "", bookingId: "", message: "" })
            fetchComplaints()
        } catch (error) {
            setErrorMessage(error.message || "Failed to submit complaint.")
        } finally {
            setIsSubmitting(false)
            clearMessages()
        }
    }

    const bookingOptions = useMemo(() => {
        return bookings.map((booking) => {
            const roomNo = booking?.room?.roomNo || booking?.roomNo || "-"
            const code = booking?.bookingConfirmationCode || `Booking ${booking.bookingId}`
            return {
                value: booking.bookingId,
                label: `${code} · Room ${roomNo}`
            }
        })
    }, [bookings])

    return (
        <section className="container mt-5 mb-5">
            <Header title="Complaint Box" />

            {successMessage && (
                <div className="alert alert-success mt-4">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-4">{errorMessage}</div>
            )}

            <div className="row mt-4 g-4">
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title hotel-color mb-3">
                                <FaRegCommentDots className="me-2" />
                                Raise a Complaint
                            </h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Booking (optional)</label>
                                    <select
                                        className="form-select"
                                        value={formData.bookingId}
                                        onChange={handleBookingChange}
                                    >
                                        <option value="">Select a booking</option>
                                        {bookingOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Room Number</label>
                                    <input
                                        type="text"
                                        name="roomNo"
                                        className="form-control"
                                        placeholder="e.g. A101"
                                        value={formData.roomNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Describe the issue..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-hotel w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title hotel-color mb-3">My Complaints</h5>
                            {isLoading ? (
                                <p>Loading complaints...</p>
                            ) : complaints.length === 0 ? (
                                <div className="alert alert-info mb-0">
                                    You have not raised any complaints yet.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Room</th>
                                                <th>Message</th>
                                                <th>Status</th>
                                                <th>Raised</th>
                                                <th>Booking</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaints.map((complaint) => {
                                                const status = normalizeStatus(complaint.status)
                                                const timestamp = getTimestamp(complaint)
                                                const formattedTimestamp = timestamp
                                                    ? moment(timestamp).format("DD MMM YYYY, hh:mm A")
                                                    : "-"
                                                return (
                                                    <tr
                                                        key={
                                                            complaint.complaintId ||
                                                            complaint.id ||
                                                            complaint._id ||
                                                            `${getRoomNo(complaint)}-${formattedTimestamp}`
                                                        }
                                                    >
                                                        <td>{getRoomNo(complaint)}</td>
                                                        <td className="complaint-message">
                                                            {complaint.message || "-"}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${statusBadgeClass(status)}`}>
                                                                {status}
                                                            </span>
                                                        </td>
                                                        <td>{formattedTimestamp}</td>
                                                        <td>{getBookingId(complaint)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserComplaints
