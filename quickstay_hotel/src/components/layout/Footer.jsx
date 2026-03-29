import React from 'react'
import { Container } from 'react-bootstrap';
import { Col, Row } from "react-bootstrap"

const Footer = () => {
    let today = new Date();
  return (
    <footer className='bg-dark text-light py-4 footer mt-lg-5'>
        <Container>
            <Row>
                <Col xs={12} md={12} className="text-center">
                    <p className="mb-0">&copy; {today.getFullYear()} Quickstay. Your comfort, our priority. </p>       
                </Col>
            </Row>  
        </Container>
    </footer>
  )
}

export default Footer
