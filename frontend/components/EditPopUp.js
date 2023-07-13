"use client"
import { useState } from 'react'

export default function EditPopUp({top, type, editValue, onSave}) {
    const [value, setValue] = useState(editValue)

    function handleCancel () {
    }

    function handleNewItem () {

    }

    const handleEdit = ((event) => {
        setValue(event.target.value)
    })

    const handleSave = ((event) => {
        event.preventDefault()
        console.log(event.target.value)
        onSave(value)
    })

    return (
        <div className={`card w-96 bg-base-100 shadow-xl absolute left-0 top-${top}`}>
        <div className="card-body">
            <h2 className="card-title">Edit!</h2>
            <input value={value} onChange={handleEdit}/>
            <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-primary" onClick={handleNewItem}>Add Item</button>
            <button className="btn btn-primary">Delete</button>
            </div>
        </div>
        </div>
    )
}