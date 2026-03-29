import moment from 'moment'
import React, { useState } from 'react'
import { Button } from "react-bootstrap"

const BookingSummary = ({booking, payment, isFormValid, onConfirm}) => {
    const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD", true)
    const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD", true)
    const isValidDates = checkInDate.isValid() && checkOutDate.isValid()
    const isDateRangeValid = isValidDates && checkOutDate.isAfter(checkInDate, "day")
    const rawNumberOfDays = isValidDates ? checkOutDate.diff(checkInDate, "days") : 0
    const numberOfDays = Math.max(0, rawNumberOfDays)
    const totalPayment = Number.isFinite(payment) ? Math.max(0, payment) : 0
    const formattedTotalPayment = totalPayment.toFixed(2)
    const formatDate = (date) => (date.isValid() ? date.format("DD MMM YYYY") : "-")
    const[isProcessingPayment, setIsProcessingPayment] = useState(false)

    const handleConfirmationBooking = () =>{
        setIsProcessingPayment(true)
        onConfirm()
    }

  return (
    <div className='card card-body mt-5 booking-card booking-summary'>
        <h4 className='mb-3'>Reservation Summary</h4>
        <ul className='summary-list'>
            <li><span className='summary-label'>Name:</span><span>{booking.guestFullName || "-"}</span></li>
            <li><span className='summary-label'>Email:</span><span>{booking.guestEmail || "-"}</span></li>
            <li><span className='summary-label'>Check-in Date:</span><span>{formatDate(checkInDate)}</span></li>
            <li><span className='summary-label'>Check-out Date:</span><span>{formatDate(checkOutDate)}</span></li>
            <li><span className='summary-label'>Number of Days Booked:</span><span>{numberOfDays}</span></li>
        </ul>
        <h5 className='section-title mt-3'>Number of Guests</h5>
        <ul className='summary-list'>
            <li><span className='summary-label'>Adult{booking.numberOfAdults > 1 ? "s" : ""}:</span><span>{booking.numberOfAdults || 0}</span></li>
            <li><span className='summary-label'>Children:</span><span>{booking.numberOfChildren || 0}</span></li>
        </ul>
        {isDateRangeValid ? (
            <>
            <p className='summary-total'>Total payment: <strong>Rs {formattedTotalPayment}</strong></p>
            
            {totalPayment > 0 && isFormValid ? (
                <Button
                variant='success' className='w-100' onClick={handleConfirmationBooking} disabled={isProcessingPayment}>
                    {isProcessingPayment ? (
                        <>
                        <span 
                        className='spinner-border spinner-border-sm mr-2' role='status' aria-hidden="true"></span>
                        Redirecting to payment . . .
                        </>
                    ): (
                        "Confirm booking and proceed to payment"
                    )}
                </Button>
            ): totalPayment <= 0 ? (
                <p className="text-warning mb-0">Room price is unavailable. Please refresh and try again.</p>
            ) : null}
            </>
        ): (
            <p className="text-danger">Check-out date must be after Check-in date</p>
        )}
    </div>
  )
}

export default BookingSummary
