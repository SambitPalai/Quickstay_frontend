import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { FaHotel, FaCalendarCheck, FaPlus, FaList } from "react-icons/fa"

const Admin = () => {
    const { user } = useAuth()

    return (
        <section className="container mt-5 mb-5">
            <div className="row">
                <div className="col-12 mb-4">
                    <h2>Admin Panel</h2>
                    <p className="text-muted">Welcome back, <strong>{user?.name}</strong></p>
                    <hr />
                </div>
            </div>

            <div className="row g-4">

                {/* ---------- Room Management Card --------------------------- */}
                <div className="col-12 col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title hotel-color">
                                <FaHotel className="me-2" />
                                Room Management
                            </h5>
                            <p className="card-text text-muted">
                                Add, edit, delete and view all hotel rooms.
                            </p>
                            <div className="d-flex flex-column gap-2 mt-3">
                                <Link to="/existing-rooms" className="btn btn-hotel">
                                    <FaList className="me-2" />
                                    View All Rooms
                                </Link>
                                <Link to="/add-room" className="btn btn-outline-secondary">
                                    <FaPlus className="me-2" />
                                    Add New Room
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  ------------- Booking Management Card  ----------------- */}
                <div className="col-12 col-md-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title hotel-color">
                                <FaCalendarCheck className="me-2" />
                                Booking Management
                            </h5>
                            <p className="card-text text-muted">
                                View and manage all guest bookings.
                            </p>
                            <div className="d-flex flex-column gap-2 mt-3">
                                <Link to="/admin/bookings" className="btn btn-hotel">
                                    <FaList className="me-2" />
                                    View All Bookings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Admin