import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { Link } from "react-router-dom"
import { buildRoomImageSrc } from '../utils/imageUtils.js'
import fallbackRoomImage from '../../assets/images/images.jpg'

const RoomCard = ({room}) => {
  const imageSrc = buildRoomImageSrc(room) || fallbackRoomImage

  return (
    <Col key={room.id} className='mb-4' xs={12}>
        <Card className="room-card">
            <Card.Body className="room-card-body">
                <div className="room-card-media">
                    <Link to={`/book-room/${room.id}`} className='room-card-image-link'>
                    <Card.Img
                        variant='top'
                        className="room-card-img"
                        src={imageSrc || undefined}
                        alt='Room Photo'/>
                    </Link>    
                </div>
                <div className="flex-shrink-0">
                    <Card.Title className='hotel-color'>{room.roomType}</Card.Title>
                    <Card.Title className='room-price'>Rs {room.roomPrice} / Night</Card.Title>
                </div>
                <div className="room-card-action">
                    <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
                        Book Now
                    </Link>
                </div>
            </Card.Body>
        </Card>
    </Col>
  )
}

export default RoomCard
