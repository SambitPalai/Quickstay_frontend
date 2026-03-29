import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../common/Header'

const BookingSuccess = () => {
    const location = useLocation()
    const message = location.state?.message
    const error = location.state?.error
    const isPending = !message && !error
  return (
    <div className='container'>
        <Header title="Booking Status"/>
        <div className='mt-5'>
            {isPending ? (
                <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                    <span className="text-muted">Finalizing your booking...</span>
                </div>
            ) : message ? (
                <div>
                <h3 className='text-success'>Room Successfully booked !</h3>
                <p className='text-success'>{message}</p>
                </div>
            ):(    
                <div>
                <h3 className='text-danger'>Error Booking room !</h3>
                <p className='text-danger'>{error}</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default BookingSuccess
