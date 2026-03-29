import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import Header from './Header'
import { FaClock, FaUtensils, FaWifi, FaTshirt, FaCocktail, FaSnowflake, FaParking } from 'react-icons/fa'
import { Card } from 'react-bootstrap'


const HotelService = () => {
  return (
    <>
    <Container className='mb-2'>
        <Header title={"Our Services"}/>
        <Row>
            <h4 className='text-center'>
                Services at <span className='hotel-color'>Quickstay</span>  
                <span className='gap-2'> <FaClock/> - 24-Hour Front Desk</span>
                <span className='gap-2'> Customer Care: 555-0147 / 555-0193 / 555-0178</span>
            </h4>
        </Row>
        <hr/>
        <Row xs={1} md={2} lg={3} className='g-4 mt-2'>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaWifi /> Wifi
                    </Card.Title>
                    <Card.Text>Stay connected with high-speed internet access.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaUtensils /> Breakfast
                    </Card.Title>
                    <Card.Text>Start your day with a delicious breakfast buffet.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaTshirt /> Laundry
                    </Card.Title>
                    <Card.Text>Keep your clothes clean and fresh with our laundary service.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaCocktail /> Mini-bar
                    </Card.Title>
                    <Card.Text>Life is better when you keep it chill, find your favorites in our in-room minibars.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaSnowflake /> Air conditioning
                    </Card.Title>
                    <Card.Text>Stay cool and comfortable with our air conditioning system.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="service-card h-100">
                <Card.Body>
                    <Card.Title className='hotel-color'>
                        <FaParking /> Parking Area
                    </Card.Title>
                    <Card.Text>Always a spot waiting, because your journey shouldn't include a search party.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default HotelService
