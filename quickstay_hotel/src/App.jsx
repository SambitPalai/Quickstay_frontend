import AddRoom from "./components/room/AddRoom.jsx"
import EditRoom from './components/room/EditRoom.jsx'
import ExistingRooms from './components/room/ExistingRooms.jsx'
import RoomListing from './components/room/RoomListing.jsx'
import Admin from './components/admin/Admin.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home.jsx'
import NavBar from "./components/layout/NavBar.jsx"
import Footer from "./components/layout/Footer.jsx"
import Checkout from "./components/booking/Checkout.jsx"
import BookingSuccess from "./components/booking/BookingSuccess.jsx"
import PaymentPage from "./components/booking/PaymentPage.jsx"
import Signup from "./components/auth/Signup.jsx"
import Login from "./components/auth/Login.jsx"
import Unauthorized from "./components/common/Unauthorized.jsx"
import { AuthProvider } from "./components/auth/AuthContext.jsx"
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import ManageBookings  from "./components/admin/ManageBookings.jsx"
import ManageComplaints from "./components/admin/ManageComplaints.jsx"
import UserProfile     from "./components/user/UserProfile.jsx"
import UserComplaints  from "./components/user/UserComplaints.jsx"
import FindBooking     from "./components/booking/FindBooking.jsx"
import OwnerDashboard  from "./components/owner/OwnerDashboard.jsx"
import ManageAdmins    from "./components/owner/ManageAdmins.jsx"

function App() {
  return (
    <AuthProvider>
      <>
        <main>
          <Router>
            <NavBar />
            <Routes>

              {/* ----- Public routes ---------------------------------- */}
              <Route path="/"                 element={<Home />} />
              <Route path="/login"            element={<Login />} />
              <Route path="/signup"           element={<Signup />} />
              <Route path="/browse-all-rooms" element={<RoomListing />} />
              <Route path="/unauthorized"     element={<Unauthorized />} />
              <Route path="/find-booking"     element={<FindBooking />} />

              {/* ----User routes (must be logged in) ------------------- */}
              <Route path="/book-room/:roomId" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }/>
              <Route path="/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }/>
              <Route path="/booking-success" element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }/>
               <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }/>
              <Route path="/complaints" element={
                <ProtectedRoute>
                  <UserComplaints />
                </ProtectedRoute>
              }/>

              {/* ----- Admin only routes ----------------------- */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }/>
               <Route path="/admin/bookings" element={
                <ProtectedRoute adminOnly>
                  <ManageBookings />
                </ProtectedRoute>
              }/>
              <Route path="/admin/complaints" element={
                <ProtectedRoute adminOnly>
                  <ManageComplaints />
                </ProtectedRoute>
              }/>
              <Route path="/existing-rooms" element={
                <ProtectedRoute adminOnly>
                  <ExistingRooms />
                </ProtectedRoute>
              }/>
              <Route path="/add-room" element={
                <ProtectedRoute adminOnly>
                  <AddRoom />
                </ProtectedRoute>
              }/>
              <Route path="/edit-room/:roomId" element={
                <ProtectedRoute adminOnly>
                  <EditRoom />
                </ProtectedRoute>
              }/>

              {/* ----- Owner only routes ----------------------- */}
               <Route path="/owner" element={
                    <ProtectedRoute ownerOnly>
                       <OwnerDashboard />
                    </ProtectedRoute>}/>
                <Route path="/owner/manage-admins" element={
                    <ProtectedRoute ownerOnly>
                        <ManageAdmins />
                    </ProtectedRoute>
                }/> 

            </Routes>
          </Router>
          <Footer />
        </main>
      </>
    </AuthProvider>
  )
}

export default App
