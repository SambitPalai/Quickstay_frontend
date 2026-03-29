import { Link } from "react-router-dom"

const Unauthorized = () => {
    return (
        <div className="container text-center mt-5">
            <h2 className="text-danger">Access Denied</h2>
            <p className="mt-3">You do not have permission to view this page.</p>
            <Link to="/" className="btn btn-hotel mt-3">
                Go back Home
            </Link>
        </div>
    )
}

export default Unauthorized