import React, { useEffect, useState } from 'react'
import { getAllRooms } from '../utils/ApiFunctions'
import { Container, Row, Col } from 'react-bootstrap'
import RoomFilter from '../common/RoomFilter'
import RoomPaginator from '../common/RoomPaginator'
import RoomCard from './RoomCard'

const Room = () => {
    const[data, setData] = useState([])
    const[error, setError] = useState(null)
    const[isLoading, setIsLoading] = useState(false)
    const[currentPage, setCurrentPage] = useState(1)
    const[roomsPerPage] = useState(6)
    const[filteredData, setFilteredData] = useState([])

    useEffect(() =>{
        setIsLoading(true)
        getAllRooms().then((data) => {
            setData(data)
            setFilteredData(data)
            setIsLoading(false)
        }).catch((error) => {
            setError(error.message)
            setIsLoading(false)
        })
    }, [])
    
    useEffect(() => {
        setCurrentPage(1)
    }, [filteredData])

    if(isLoading) {
        return <div> Loading rooms... .. . </div>
    }
    if(error){
        return<div className="text-danger">Error : {error}</div>
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const totalPages = Math.ceil(filteredData.length / roomsPerPage)

    const renderRooms = () => {
        const startIndex = (currentPage-1) * roomsPerPage
        const endIndex = startIndex + roomsPerPage
        return filteredData
        .slice(startIndex, endIndex)
        .map((room) => <RoomCard key={room.id} room={room}/>)
    }

  return (
    <Container>
        <Row className="align-items-center mb-3">
            <Col md={6} className="mb-3 mb-md-0">
                <RoomFilter data={data} setFilteredData={setFilteredData}/>
            </Col>
            <Col md={6} className="d-flex align-items-center justify-content-end">
                <RoomPaginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}  
                />
            </Col>
        </Row>
        <Row>{renderRooms()}</Row>
        <Row>
             <Col md={6} className="d-flex align-items-center justify-content-end">
                <RoomPaginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}  
                />
            </Col>
        </Row>
    </Container>
  )
}

export default Room
