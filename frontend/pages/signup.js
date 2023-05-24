"use client"
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import { useState } from 'react'

export default function signup () {
    const [message, setMessage] = useState('')
    const [color, setColor] = useState('')

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
            
            setMessage(response.json())

            // set the message if the status returned is not 200 OK
            if (response.status == 200){
                setColor('lime-300')
            }

        } catch (error) {
            console.log("Error")
            setColor('red-400')
        }
    }

    return (
        <>
            <NavBar/>
            <form method='post' className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
                { message && <Alert msg={message} color={color} /> }
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