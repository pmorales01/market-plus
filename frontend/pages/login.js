"use client"

import NavBar from '../components/NavBar'
import { useState } from 'react'

export default function Login () {
    const [message, setMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        // FormData object to get the login form's values
        const formData = new FormData(event.target)

        try {
            // headers
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json")

            // create the JSON to send with the form's values
            var raw = JSON.stringify({
            "username": formData.get('username'),
            "email": formData.get('email'),
            "password": formData.get('password')
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }

            // make a POST request to login
            const response = await fetch("http://127.0.0.1:8000/login/", requestOptions)
            
            // set the message returned
            setMessage(response.json())
        } catch (error) {
            console.log("Error")
        }
    }

    return (
        <>
            <NavBar/>
            <form id="login-form" method='post' autoComplete='on' className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
                <label className="label">
                    <span className="label-text">Username</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="text" name="username" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label">
                    <span className="label-text">Email</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="email" name="email" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="password" name="password" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                <p>{message}</p>
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}