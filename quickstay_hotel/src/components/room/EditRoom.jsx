import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRoomById, updateRoom } from '../utils/ApiFunctions.js'
import RoomTypeSelector from '../common/RoomTypeSelector.jsx'
import { buildImageSrc } from '../utils/imageUtils.js'

const EditRoom = () => {
   const[room, setRoom] = useState ({
          photo : null,
          roomNo: "",
          roomType : "",
          roomPrice : ""
      })
  
      const[imagePreview, setImagePreview]= useState("")
      const[successMessage, setSuccessMessage]= useState("")
      const[errorMessage, setErrorMessage]= useState("")
      const{roomId} = useParams()

      const applyRoomData = (roomData) => {
        setRoom({
            photo: null,
            roomNo: roomData?.roomNo ?? "",
            roomType: roomData?.roomType ?? "",
            roomPrice: roomData?.roomPrice ?? ""
        })
        setImagePreview(buildImageSrc(roomData?.photo))
      }

      const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        if(!selectedImage) {
            setRoom({...room, photo: null})
            setImagePreview("")
            return
        }
        setRoom({...room, photo: selectedImage})
        setImagePreview(URL.createObjectURL(selectedImage))
      }
      
      const handleInputChange= (e) => {
        const name= e.target.name
        let value= e.target.value
        if(name === "roomPrice"){
            const parsed = parseFloat(value)
            value = Number.isFinite(parsed) ? parsed : ""
        }
        setRoom({...room, [name]: value})
      }

      useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId)
                applyRoomData(roomData)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRoom()
      }, [roomId])

      const handleSubmit = async (e) => {
      e.preventDefault()
      setSuccessMessage("")
      setErrorMessage("")
      try {
            const formData = new FormData()
            formData.append("roomNo", room.roomNo)
            formData.append("roomType", room.roomType)
            formData.append("roomPrice", room.roomPrice)
            if (room.photo instanceof File) {
                  formData.append("photo", room.photo)
            }
            await updateRoom(roomId, formData)
            setSuccessMessage("Room updated successfully!")
            const updatedRoomData = await getRoomById(roomId)
            applyRoomData(updatedRoomData)
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
        } catch (error) {
            setErrorMessage(error.message)
        }
      }
      

       return (
        <>
        <section className= "container mt-5 mb-5 add-room-form">
            <div className= "row justify-content-center">
                <div className= "col-12 col-sm-10 col-md-8 col-lg-6">
                    <h3 className= "mt-2 mb-3 text-center">Edit Room</h3>
                    {successMessage && (
                        <div className="alert alert-success fade show" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger fade show" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <form className="add-room-form__body" onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label htmlFor="roomNo" className="form-label">Room Number</label>
                           <input
                                className="form-control"
                                required
                                id="roomNo"
                                type="text"
                                name="roomNo"
                                placeholder="e.g. A-101, B-123"
                                value={room.roomNo}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className= "mb-3">
                            <label htmlFor= "roomType" className= "form-label">Room Type</label>
                            <div>
                                <RoomTypeSelector 
                                    handleRoomInputChange={handleInputChange} 
                                    newRoom={room}
                                />
                            </div>
                        </div>
                        
                        <div className= "mb-3">
                            <label htmlFor= "roomPrice" className= "form-label">Room Price</label>
                            <input className= "form-control" required id="roomPrice" type= "number" name= "roomPrice" value={room.roomPrice} onChange={handleInputChange} />
                        </div>

                        <div className= "mb-3">    
                            <label htmlFor= "photo" className= "form-label">Room Photo</label>
                            <input id= "photo" name= "photo" type= "file" className= "form-control" onChange={handleImageChange} />
                            {imagePreview && (
                                <img src= {imagePreview} alt= "preview Room Photo" style={{maxWidth: "400px", maxHeight: "400px"}} className= "mb-3" />
                            )}
                        </div>

                        <div className= "mt-2">
                            <Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
                                Back
                            </Link>
                            <button type="submit" className= "btn btn-outline-warning">
                                Update Room
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </section>
        </>
    )
}
 
export default EditRoom
