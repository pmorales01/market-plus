"use client"
import { useState, useEffect } from 'react'

// displays a message (an alert box)
export default  function Alert({message, onClick}) {
    const errors = message.map((error, index) => (
        <p key={index} className="py-1.5 text-center">{error}</p>
    ))

    function handleClick() {
        onClick()
    }

    return (
        <div className="fixed z-50 h-screen w-screen top-0 left-0" id="popup">
            <div className="-translate-x-1/2 card w-96 bg-base-100 shadow-xl inset-1/2 rounded-none">
                <div className="card-body ">
                <h2 className="card-title self-center">Error!</h2>
                {errors}
                <div className="card-actions justify-center">
                    <button className="btn btn-primary" onClick={handleClick}>
                        <span className="capitalize">Close</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}