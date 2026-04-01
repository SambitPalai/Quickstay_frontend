import { useEffect, useMemo, useState } from "react"
import moment from "moment"
import Header from "../common/Header"
import { getAllComplaints, updateComplaintStatus, getComplaintsByStatus } from "../utils/ApiFunctions"
import { FaRegCommentDots } from "react-icons/fa"

const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" }
]
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

const getComplaintId = (complaint) =>
    complaint?.complaintId ||
    complaint?.id ||
    complaint?._id ||
    complaint?.requestId

const getRoomNo = (complaint) =>
    complaint?.roomNo ||
    complaint?.roomNumber ||
    complaint?.room?.roomNo ||
    complaint?.bookedRoom?.roomNo ||
    "-"

const getUserName = (complaint) =>
    complaint?.user?.name ||
    complaint?.userName ||
    complaint?.username ||
    complaint?.guestName ||
    "-"

const getUserEmail = (complaint) =>
    complaint?.user?.email ||
    complaint?.userEmail ||
    complaint?.guestEmail ||
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

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [updatingId, setUpdatingId] = useState(null)
    const [statusFilter, setStatusFilter] = useState("ALL")

    
    useEffect(() => {
        fetchComplaints(statusFilter)
    }, [statusFilter])

    const fetchComplaints = async (status) => {
        setIsLoading(true)
        try {
            const data = status && status !== "ALL"
                ? await getComplaintsByStatus(status)
                : await getAllComplaints()
            setComplaints(Array.isArray(data) ? data : [])
        } catch (error) {
            setErrorMessage(error.message || "Could not load complaints.")
        } finally {
            setIsLoading(false)
        }
    }

    const clearMessages = () => {
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

    const handleStatusChange = async (complaintId, status) => {
        if (!complaintId) return
        setUpdatingId(complaintId)
        try {
            await updateComplaintStatus(complaintId, status)
            setSuccessMessage(`Complaint ${complaintId} marked as ${status}.`)
            fetchComplaints(statusFilter)
        } catch (error) {
            setErrorMessage(error.message || "Failed to update complaint.")
        } finally {
            setUpdatingId(null)
            clearMessages()
        }
    }

    const filteredComplaints = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return complaints
        return complaints.filter((complaint) => {
            const combined = [
                getRoomNo(complaint),
                getUserName(complaint),
                getUserEmail(complaint),
                complaint?.message,
                getBookingId(complaint)
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return combined.includes(query)
        })
    }, [complaints, searchQuery])

    return (
        <section className="container mt-5 mb-5">
            <Header title="Complaint Dashboard" />

            {successMessage && (
                <div className="alert alert-success mt-4">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-4">{errorMessage}</div>
            )}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 mb-3">
                <div>
                    <h5 className="mb-1 hotel-color">
                        <FaRegCommentDots className="me-2" />
                        Guest Complaints
                    </h5>
                    <p className="text-muted mb-0">
                        Track, prioritize, and resolve guest issues.
                    </p>
                </div>
                 <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch w-100 w-md-auto">
                    <div className="d-flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`btn btn-sm ${
                                    statusFilter === option.value
                                        ? "btn-hotel"
                                        : "btn-outline-secondary"
                                }`}
                                onClick={() => setStatusFilter(option.value)}
                                aria-pressed={statusFilter === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ maxWidth: "360px", width: "100%" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by room, guest, message..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <p>Loading complaints...</p>
            ) : filteredComplaints.length === 0 ? (
                <div className="alert alert-info">No complaints found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Guest</th>
                                <th>Room</th>
                                <th>Booking</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Raised</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map((complaint) => {
                                const complaintId = getComplaintId(complaint)
                                const status = normalizeStatus(complaint.status)
                                const timestamp = getTimestamp(complaint)
                                const formattedTimestamp = timestamp
                                    ? moment(timestamp).format("DD MMM YYYY, hh:mm A")
                                    : "-"

                                return (
                                    <tr key={complaintId || complaint.message}>
                                        <td>{complaintId || "-"}</td>
                                        <td>
                                            <div className="fw-semibold">{getUserName(complaint)}</div>
                                            <div className="text-muted small">{getUserEmail(complaint)}</div>
                                        </td>
                                        <td>{getRoomNo(complaint)}</td>
                                        <td>{getBookingId(complaint)}</td>
                                        <td className="complaint-message">
                                            {complaint.message || "-"}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-2">
                                                <span className={`badge ${statusBadgeClass(status)}`}>
                                                    {status}
                                                </span>
                                                <select
                                                    className="form-select form-select-sm complaint-status-select"
                                                    value={status}
                                                    onChange={(event) =>
                                                        handleStatusChange(
                                                            complaintId,
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={updatingId === complaintId}
                                                >
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                    <option value="RESOLVED">RESOLVED</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>{formattedTimestamp}</td>
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

export default ManageComplaints
