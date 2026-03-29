import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { FaUserShield, FaHotel, FaCalendarCheck, FaPlus, FaList } from "react-icons/fa"

const OwnerDashboard = () => {
    const { user } = useAuth()

    return (
        <section className="container mt-5 mb-5">
            <div className="mb-4">
                <h2>Owner Dashboard</h2>
                <p className="text-muted">
                    Welcome, <strong>{user?.name}</strong>. 
                    You have full control over this application.
                </p>
                <hr />
            </div>

            <div className="row g-4">

                {/* Admin Management  */}
                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm border-warning">
                        <div className="card-body">
                            <h5 className="card-title hotel-color">
                                <FaUserShield className="me-2" />
                                Admin Management
                            </h5>
                            <p className="card-text text-muted">
                                Create, remove, and manage admin accounts.
                            </p>
                            <Link to="/owner/manage-admins" className="btn btn-hotel w-100">
                                Manage Admins
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Room Management  */}
                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title hotel-color">
                                <FaHotel className="me-2" />
                                Room Management
                            </h5>
                            <p className="card-text text-muted">
                                Add, edit and delete hotel rooms.
                            </p>
                            <div className="d-flex flex-column gap-2">
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

                {/*  Booking Management  */}
                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title hotel-color">
                                <FaCalendarCheck className="me-2" />
                                Booking Management
                            </h5>
                            <p className="card-text text-muted">
                                View and manage all guest bookings.
                            </p>
                            <Link to="/admin/bookings" className="btn btn-hotel w-100">
                                <FaList className="me-2" />
                                View All Bookings
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default OwnerDashboard