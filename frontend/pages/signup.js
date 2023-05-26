"use client"
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import { useState } from 'react'

export default function signup () {
    const [message, setMessage] = useState('')
    const [color, setColor] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            // headers
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json")

            // FormData object to get the login form's values
            const formData = new FormData()

            formData.append('username', document.getElementById('username').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('password', document.getElementById('password').value);

            var requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            };

            // make a POST request to sign up (create a user)
            const response = await fetch("http://127.0.0.1:8000/signup/", requestOptions)
            if (response.status == 200){ // successful request
                setColor('bg-lime-300')
            } else { // bad request
                setColor('bg-red-200')
            }

            // get the response from HTTP request and create an <Alert/>
            const data = await response.json()

            setMessage(data.detail)
        } catch (error) {
            console.log("Error")
        }
    }

    return (
        <>
            <NavBar/>
            <form method='post' className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
                { message && color && <Alert message={message} color={color} /> }
                <label className="label" htmlFor="username">
                    <span className="label-text">Username</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="text" id="username" name="username" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
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
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}