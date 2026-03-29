import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

const getApiErrorMessage = (error, fallbackMessage) => {
    const data = error?.response?.data
    if (typeof data === "string") {
        return data
    }
    if (data && typeof data === "object") {
        if (typeof data.message === "string") return data.message
        if (typeof data.error === "string") return data.error
        if (typeof data.details === "string") return data.details
    }
    if (typeof error?.message === "string" && error.message) {
        return error.message
    }
    return fallbackMessage
}

// ------------ Attach JWT token to every request automatically ------------

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// --------Auth Functions -------------

/* Register a new user */
export async function registerUser(userData) {
    try {
        const response = await api.post("/auth/register", userData)
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Registration failed"))
    }
}

/* Login an existing user */
export async function loginUser(credentials) {
    try {
        const response = await api.post("/auth/login", credentials)
        return response.data   // { token, email, role, name }
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Login failed"))
    }
}

/* Request OTP for password reset */
export async function forgotPassword(email) {
    try {
        const response = await api.post("/auth/forgot-password", { email })
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to send OTP"))
    }
}

/* Verify OTP for password reset */
export async function verifyOtp(email, otp) {
    try {
        const response = await api.post("/auth/verify-otp", { email, otp })
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "OTP verification failed"))
    }
}

/* Reset password after OTP verification */
export async function resetPassword(email, newPassword, confirmPassword) {
    try {
        const response = await api.post("/auth/reset-password", {
            email,
            newPassword,
            confirmPassword
        })
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Password reset failed"))
    }
}

// ------- Room Functions -------------------- 

/* This function adds a new room to the database  */
export async function addRoom(photo, roomType, roomPrice, roomNo) {

    const formData = new FormData()
    formData.append("photo", photo)
    formData.append("roomType", roomType)
    formData.append("roomPrice", roomPrice)
    formData.append("roomNo", roomNo)
    await api.post("/rooms/add/new-room", formData)
    return true
}

/* This function gets all Room Types (room-types) */
export async function getRoomTypes() {

    try{
        const response =  await api.get("/rooms/room/types")
        return response.data
    }
    catch(error){
        throw new Error("Error fetching room types")   
    }

}

/* This function gets all Rooms from the database */
export async function getAllRooms() {
    try{
        const result = await api.get("/rooms/all-rooms")
        return result.data
    }
    catch(error){
        throw new Error("Error fetching rooms")
    }
}

/* This function deletes room by its Id  */
export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/rooms/delete/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}

/* This function updates room */ 
export async function updateRoom(roomId, roomData) {
    const formData = roomData instanceof FormData ? roomData : (() => {
        const data = new FormData()
        data.append("roomType", roomData.roomType)
        data.append("roomPrice", roomData.roomPrice)
        if (roomData.photo instanceof File) {
            data.append("photo", roomData.photo)
        }
        return data
    })()
    const response = await api.put(`/rooms/update/${roomId}`, formData)
    return response.data
}

/* This function gets a room by the ID */
export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/rooms/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error fetching room ${error.message}`)        
    }
}

// ----- Booking Functions -------------------  

/* This function saves a new booking in the database */
export async function bookRoom(roomId, booking) {
    try {
        const response = await api.post(`/bookings/room/${roomId}/booking`,booking)
        return response.data
    } 
    catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`Error booking room : ${error.message}`)
        }
    }
} 

// ----- Payment Functions -------------------

export async function createPaymentOrder(orderRequest) {
    try {
        const response = await api.post("/payment/create-order", orderRequest)
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to create payment order"))
    }
}

export async function verifyAndBook(verificationRequest) {
    try {
        const response = await api.post("/payment/verify-and-book", verificationRequest)
        return response.data
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Payment verification failed"))
    }
}

/* this function gets all the booking from the database */
export async function getAllBookings() {
    try {
        const result = await api.get(`/bookings/all-bookings`)
        return result.data
    }
    catch (error) {
        throw new Error(`Error fetching bookings : ${error.message}`)
    }
}

/* This function gets booking by the confirmation code */
export async function getBookingByConfirmationCode(confirmationCode){
    try{
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
        return result.data
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`Error finding booking : ${error.message}`)
        }
    }
}

/* This function cancels booking */
export async function cancelBooking(bookingId){
    try{
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
        return result.data
    }
    catch(error){
        const status = error.response?.status
        if (status === 401) {
            throw new Error("Login required to cancel booking.")
        }
        if (status === 403) {
            throw new Error("You are not authorized to cancel this booking.")
        }
        const message = error.response?.data || error.message
        throw new Error(`Error cancelling booking: ${message}`)
    }
}

/* Get logged-in user's own bookings — no email in URL */
export async function getMyBookings() {
    try {
        const result = await api.get("/bookings/my-bookings")
        return result.data
    } catch (error) {
        throw new Error(`Error fetching your bookings: ${error.message}`)
    }
}

/* Admin only — get bookings for any user by email */
export async function getUserBookingsByEmail(email) {
    try {
        const result = await api.get("/bookings/user/bookings", {
            params: { email }    // sends as ?email=user@quickstay.com
        })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`)
    }
}
