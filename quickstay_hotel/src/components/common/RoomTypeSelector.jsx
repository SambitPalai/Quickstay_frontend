import {useState, useEffect} from 'react'
import {getRoomTypes} from "../utils/ApiFunctions.js"

const RoomTypeSelector = ({handleRoomInputChange, newRoom}) => {
    const[roomTypes, setRoomTypes]= useState([])
    const[showNewRoomTypesInput, setShowNewRoomTypesInput]= useState(false)
    const[newRoomType, setNewRoomType]= useState("")
    const addNewValue = "__add_new__"

    useEffect(() => {
        getRoomTypes().then((data) => {
            setRoomTypes(data)
        })
    }, [])

    const handleNewRoomTypeInputChange= (e) => {
        setNewRoomType(e.target.value);
    }

    const handleAddNewRoomType= () => {
        if(newRoomType !== "" ) {
            setRoomTypes([...roomTypes, newRoomType])
            handleRoomInputChange({ target: { name: "roomType", value: newRoomType } })
            setNewRoomType("")
            setShowNewRoomTypesInput(false)
        }
    } 

    return (
    <>
        <div>
            <select className="form-select" id="roomType" name="roomType" value={newRoom.roomType} required onChange={(e) => {
                if(e.target.value === addNewValue) {
                    setShowNewRoomTypesInput(true)
                    handleRoomInputChange({ target: { name: "roomType", value: "" } })
                }
                else {
                    setShowNewRoomTypesInput(false)
                    handleRoomInputChange(e)
                }
            }}>
                
                <option value={""}>Select a room type</option>
                <option value={addNewValue}>Add new</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
            </select>

            {showNewRoomTypesInput && (
                <div className="input-group mt-2">
                    <input className="form-control" type="text" placeholder="Enter New Room Type" onChange={handleNewRoomTypeInputChange}/>
                    <button className="btn btn-hotel" type="button" onClick={handleAddNewRoomType}>
                        Add
                    </button>
                </div>
            )}

        </div>
    </>
  )
}

export default RoomTypeSelector
