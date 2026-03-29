import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import moment from "moment"
import Header from "../common/Header"
import { createPaymentOrder, verifyAndBook } from "../utils/ApiFunctions"

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(true))
            existingScript.addEventListener("error", () => resolve(false))
            return
        }

        const script = document.createElement("script")
        script.src = RAZORPAY_SCRIPT_SRC
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

const PaymentPage = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isPaying, setIsPaying] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const roomId = location.state?.roomId
    const booking = location.state?.booking
    const payment = location.state?.payment

    const totalPayment = Number.isFinite(payment) ? Math.max(0, payment) : 0
    const formattedTotalPayment = totalPayment.toFixed(2)

    const checkInDate = booking?.checkInDate
        ? moment(booking.checkInDate, "YYYY-MM-DD", true)
        : null
    const checkOutDate = booking?.checkOutDate
        ? moment(booking.checkOutDate, "YYYY-MM-DD", true)
        : null

    const formatDate = (date) => (date && date.isValid() ? date.format("DD MMM YYYY") : "-")

    const hasRequiredData = Boolean(roomId && booking && totalPayment > 0)

    const handlePayNow = async () => {
        if (!hasRequiredData || isPaying) return
        setIsPaying(true)
        setErrorMessage("")

        const isLoaded = await loadRazorpayScript()
        if (!isLoaded) {
            setErrorMessage("Failed to load payment gateway. Please try again.")
            setIsPaying(false)
            return
        }

        const orderRequest = {
            roomId,
            amount: totalPayment,
            guestFullName: booking.guestFullName,
            guestEmail: booking.guestEmail,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            numberOfAdults: Number(booking.numberOfAdults) || 0,
            numberOfChildren: Number(booking.numberOfChildren) || 0
        }

        try {
            const orderResponse = await createPaymentOrder(orderRequest)
            const orderId = orderResponse?.razorpayOrderId
            const currency = orderResponse?.currency || "INR"
            const amountInPaise = Math.round((orderResponse?.amount || totalPayment) * 100)
            const key = orderResponse?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID

            if (!orderId) {
                setErrorMessage("Payment order ID missing. Please contact support.")
                setIsPaying(false)
                return
            }
            if (!key) {
                setErrorMessage("Razorpay key not configured.")
                setIsPaying(false)
                return
            }

            const options = {
                key,
                amount: amountInPaise,
                currency,
                name: "QuickStay",
                description: "Room booking payment",
                order_id: orderId,
                prefill: {
                    name: booking.guestFullName || "",
                    email: booking.guestEmail || ""
                },
                handler: async (response) => {
                    try {
                        const verifyResponse = await verifyAndBook({
                            roomId,
                            guestFullName: booking.guestFullName,
                            guestEmail: booking.guestEmail,
                            checkInDate: booking.checkInDate,
                            checkOutDate: booking.checkOutDate,
                            numberOfAdults: Number(booking.numberOfAdults) || 0,
                            numberOfChildren: Number(booking.numberOfChildren) || 0,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        })
                        const confirmationMessage =
                            typeof verifyResponse === "string"
                                ? verifyResponse
                                : verifyResponse?.confirmationCode ||
                                  "Payment verified. Booking confirmed."
                        navigate("/booking-success", { state: { message: confirmationMessage } })
                    } catch (error) {
                        setErrorMessage(error.message)
                    } finally {
                        setIsPaying(false)
                    }
                },
                modal: {
                    ondismiss: () => setIsPaying(false)
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.on("payment.failed", (response) => {
                const failureMessage =
                    response?.error?.description || "Payment failed. Please try again."
                setErrorMessage(failureMessage)
                setIsPaying(false)
            })
            razorpay.open()
        } catch (error) {
            setErrorMessage(error.message)
            setIsPaying(false)
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <Header title="Payment" />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card card-body booking-card">
                        <h4 className="mb-3">Review & Pay</h4>

                        {!hasRequiredData && (
                            <p className="text-danger mb-0">
                                Booking details are missing. Please go back and start again.
                            </p>
                        )}

                        {hasRequiredData && (
                            <>
                                <ul className="summary-list">
                                    <li>
                                        <span className="summary-label">Name:</span>
                                        <span>{booking.guestFullName || "-"}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Email:</span>
                                        <span>{booking.guestEmail || "-"}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Check-in Date:</span>
                                        <span>{formatDate(checkInDate)}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Check-out Date:</span>
                                        <span>{formatDate(checkOutDate)}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Adults:</span>
                                        <span>{booking.numberOfAdults || 0}</span>
                                    </li>
                                    <li>
                                        <span className="summary-label">Children:</span>
                                        <span>{booking.numberOfChildren || 0}</span>
                                    </li>
                                </ul>
                                <p className="summary-total">
                                    Total payment: <strong>Rs {formattedTotalPayment}</strong>
                                </p>
                            </>
                        )}

                        {errorMessage && (
                            <div className="alert alert-danger fade show" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="button"
                            className="btn btn-hotel w-100"
                            onClick={handlePayNow}
                            disabled={!hasRequiredData || isPaying}
                        >
                            {isPaying ? "Opening payment..." : "Pay Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
