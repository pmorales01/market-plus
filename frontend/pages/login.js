"use client"

import Link from 'next/link';
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
            const response = await fetch("http://127.0.0.1:8000/signup/", requestOptions)
            
            // set the message if the status returned is not 200 OK
            if (response.status != 200){
                setMessage(response.json())
            }
        } catch (error) {
            console.log("Error")
        }
    }

    return (
        <>
            <NavBar/>
            <form method='post' className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
                <div className="bg-red-200">
                    <p>{message}</p>
                </div>
                <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="password" id="password" name="password" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <p><Link href="/signup" className='link link-hover'>New Customer?</Link></p>
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}