import {useRef, useState} from 'react'
import {addRoom} from "../utils/ApiFunctions.js"
import RoomTypeSelector from '../common/RoomTypeSelector.jsx'
import { Link } from 'react-router-dom'


const AddRoom = () => {
    const[newRoom, setNewRoom] = useState ({
        roomNo   : "",
        photo : null,
        roomType : "",
        roomPrice : ""
    })

    const[imagePreview, setImagePreview]= useState("")
    const[successMessage, setSuccessMessage]= useState("")
    const[errorMessage, setErrorMessage]= useState("")
    const fileInputRef = useRef(null)

    const handleRoomInputChange= (e) => {
        const name= e.target.name
        let value= e.target.value
        if(name === "roomPrice"){
            const parsed = parseFloat(value)
            value = Number.isFinite(parsed) ? parsed : ""
        }
        setNewRoom({...newRoom, [name]: value})
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        if(!selectedImage) {
            setNewRoom({...newRoom, photo: null})
            setImagePreview("")
            return
        }
        setNewRoom({...newRoom, photo: selectedImage})
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setSuccessMessage("")
        setErrorMessage("")
        if (!newRoom.roomNo || !newRoom.roomType || !newRoom.roomPrice || !newRoom.photo) {
        setErrorMessage("Please fill all required fields.")
        return
        }
        try {
            const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice, newRoom.roomNo)
            if(success === true) {
               setSuccessMessage("Room added succefully") 
               setNewRoom({photo: null, roomNo: "", roomType: "", roomPrice: ""})
               setImagePreview("")
               if (fileInputRef.current) {
                   fileInputRef.current.value = ""
               }
            }
            else {
                setErrorMessage("Error adding room")
            }
            setTimeout(() => {
                setSuccessMessage("")
                setErrorMessage("")
            }, 3000)
        }
        catch(error){
            setErrorMessage(error.message)
        }
    }

    return (
        <>
        <section className= "container mt-5 mb-5 add-room-form">
            <div className= "row justify-content-center">
                <div className= "col-12 col-sm-10 col-md-8 col-lg-6">
                    <h3 className= "mt-2 mb-3 text-center">Add a New Room</h3>
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
                                placeholder="e.g. A101, B123"
                                value={newRoom.roomNo}
                                onChange={handleRoomInputChange}
                            />
                        </div>

                        <div className= "mb-3">
                            <label htmlFor= "roomType" className= "form-label">Room Type</label>
                            <div>
                                <RoomTypeSelector 
                                    handleRoomInputChange={handleRoomInputChange} 
                                    newRoom={newRoom}
                                />
                            </div>
                        </div>
                        
                        <div className= "mb-3">
                            <label htmlFor= "roomPrice" className= "form-label">Room Price</label>
                            <input className= "form-control" required id="roomPrice" type= "number" name= "roomPrice" value={newRoom.roomPrice} onChange={handleRoomInputChange} />
                        </div>

                        <div className= "mb-3">    
                            <label htmlFor= "photo" className= "form-label">Room Photo</label>
                            <input id= "photo" name= "photo" type= "file" className= "form-control" onChange={handleImageChange} ref={fileInputRef}/>
                            {imagePreview && (
                                <img src= {imagePreview} alt= "preview Room Photo" style={{maxWidth: "400px", maxHeight: "400px"}} className= "mb-3" />
                            )}
                        </div>
                        <div className= "mt-2">
                            <Link to={"/existing-rooms"} className="btn btn-outline-info">
                                Back
                            </Link>
                            <button className= "btn btn-outline-primary btn-sm">
                                Save Room
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        </>
    )
}

export default AddRoom
