import React from 'react'
import { Link } from "react-router-dom"
import MainHeader from '../layout/MainHeader'
import HotelService from '../common/HotelService'
import Parallax from '../common/Parallax'
import RoomCarousel from '../common/RoomCarousel'

function Home() {
  return (
        <section>
          <MainHeader/>
          <section className="container">
            <RoomCarousel />
            <Parallax />
            <RoomCarousel />
            <HotelService />
            <section className="mt-4 mb-4">
              <h4 className="text-center mb-3">Estate Address</h4>
              <div className="row align-items-start">
                <div className="col-12 col-md-5">
                  <p className="mb-1">Einstein Academy of Technology and Management</p>
                  <p className="mb-1">4JJC+VMW, Baniatangi, Bajpur</p>
                  <p className="mb-0">Odisha 752060, India</p>
                </div>
                <div className="col-12 col-md-7 mt-3 mt-md-0">
                  <iframe
                    title="Einstein Academy of Technology and Management - Map"
                    src="https://www.google.com/maps?q=4JJC%2BVMW%2C%20Baniatangi%2C%20Bajpur%2C%20Odisha%20752060%20Einstein%20Academy%20of%20Technology%20and%20Management&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </section>
          </section>
        </section>
  )
}

export default Home
