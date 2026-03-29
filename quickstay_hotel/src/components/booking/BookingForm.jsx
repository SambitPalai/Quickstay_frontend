import { useNavigate, useParams } from "react-router-dom"
import moment from "moment"
import React, { useState, useEffect } from "react"
import { Form, FormControl } from "react-bootstrap"
import { getRoomById } from "../utils/ApiFunctions"
import BookingSummary from "./BookingSummary"

const BookingForm = () => {
    const [isValidated,    setIsValidated]    = useState(false)
    const [isSubmitted,    setIsSubmitted]    = useState(false)
    const [errorMessage,   setErrorMessage]   = useState("")
    const [roomPrice,      setRoomPrice]      = useState(0)

    // ── Guest details come from form, not from token ───────────────────
    const [booking, setBooking] = useState({
        guestFullName   : "",
        guestEmail      : "",
        checkInDate     : "",
        checkOutDate    : "",
        numberOfAdults  : "",
        numberOfChildren: ""
    })

    const { roomId } = useParams()
    const navigate   = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setBooking({ ...booking, [name]: value })
        setErrorMessage("")
    }

    useEffect(() => {
        getRoomById(roomId)
            .then((data) => {
                const price = Number(data.roomPrice)
                setRoomPrice(Number.isFinite(price) ? price : 0)
            })
            .catch((error) => console.error(error))
    }, [roomId])

    const parseFormDate = (value) => moment(value, "YYYY-MM-DD", true)

    const calculatePayment = () => {
        const checkIn  = parseFormDate(booking.checkInDate)
        const checkOut = parseFormDate(booking.checkOutDate)
        if (!checkIn.isValid() || !checkOut.isValid()) {
            return 0
        }
        const days     = checkOut.diff(checkIn, "days")
        if (days <= 0) {
            return 0
        }
        if (!Number.isFinite(roomPrice) || roomPrice <= 0) {
            return 0
        }
        return days * roomPrice
    }

    const today = moment().format("YYYY-MM-DD")

    const isGuestCountValid = () => {
        const adults   = parseInt(booking.numberOfAdults)
        const children = parseInt(booking.numberOfChildren)
        return adults >= 1 && (adults + children) >= 1
    }

    const isCheckOutDateValid = () => {
        const checkIn = parseFormDate(booking.checkInDate)
        const checkOut = parseFormDate(booking.checkOutDate)
        if (!checkIn.isValid() || !checkOut.isValid() || !checkOut.isAfter(checkIn, "day")) {
            setErrorMessage("Check-out date must come after Check-in date")
            return false
        }
        setErrorMessage("")
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = e.currentTarget
        if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
            e.stopPropagation()
        } else {
            setIsSubmitted(true)
        }
        setIsValidated(true)
    }

    const handleProceedToPayment = () => {
        const bookingPayload = {
            ...booking,
            checkInDate     : moment(booking.checkInDate).format("YYYY-MM-DD"),
            checkOutDate    : moment(booking.checkOutDate).format("YYYY-MM-DD"),
            numberOfAdults  : parseInt(booking.numberOfAdults, 10),
            numberOfChildren: parseInt(booking.numberOfChildren, 10)
        }
        navigate("/payment", {
            state: {
                roomId,
                booking: bookingPayload,
                payment: calculatePayment()
            }
        })
    }

    return (
        <div className="container mb-5 booking-page">
            <div className="row">
                <div className="col-md-6">
                    <div className="card card-body mt-5 booking-card">
                        <h4 className="card-title mb-3">Reserve Room</h4>
                        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>

                            {/* Guest details — typed freely by whoever is booking */}
                            <Form.Group className="mb-3">
                                <Form.Label>Guest Full Name</Form.Label>
                                <FormControl
                                    required
                                    type="text"
                                    name="guestFullName"
                                    value={booking.guestFullName}
                                    placeholder="Enter guest full name"
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the guest name
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Guest Email</Form.Label>
                                <FormControl
                                    required
                                    type="email"
                                    name="guestEmail"
                                    value={booking.guestEmail}
                                    placeholder="Enter guest email"
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the guest email
                                </Form.Control.Feedback>
                            </Form.Group>

                            <fieldset className="booking-fieldset">
                                <legend className="booking-legend">Lodging Period</legend>
                                <div className="row">
                                    <div className="col-6">
                                        <Form.Label>Check-In Date</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            name="checkInDate"
                                            value={booking.checkInDate}
                                            min={today}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select check-in date
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className="col-6">
                                        <Form.Label>Check-Out Date</Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            name="checkOutDate"
                                            value={booking.checkOutDate}
                                            min={booking.checkInDate || today}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select check-out date
                                        </Form.Control.Feedback>
                                    </div>
                                    {errorMessage && (
                                        <p className="text-danger mt-2">{errorMessage}</p>
                                    )}
                                </div>
                            </fieldset>

                            <fieldset className="booking-fieldset">
                                <legend className="booking-legend">Number of Guests</legend>
                                <div className="row">
                                    <div className="col-6">
                                        <Form.Label>Adults</Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            name="numberOfAdults"
                                            value={booking.numberOfAdults}
                                            placeholder="0"
                                            min={1}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            At least 1 adult required
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className="col-6">
                                        <Form.Label>Children</Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            name="numberOfChildren"
                                            value={booking.numberOfChildren}
                                            placeholder="0"
                                            min={0}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <div className="form-group mt-2 mb-2">
                                <button className="btn btn-hotel" type="submit">
                                    Continue
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="col-md-6">
                    {isSubmitted && (
                        <BookingSummary
                            booking={booking}
                            payment={calculatePayment()}
                            isFormValid={isValidated}
                            onConfirm={handleProceedToPayment}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingForm
