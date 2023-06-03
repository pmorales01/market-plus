"use client"

import Link from 'next/link';
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login () {
    const [message, setMessage] = useState('')
    const [color, setColor] = useState('')
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            // FormData object to get the login form's values
            const formData = new FormData(event.target)

            formData.append('username', document.getElementById('email').value)
            formData.append('password', document.getElementById('password').value)

            var requestOptions = {
                method: 'POST',
                credentials: 'include',
                body: formData,
                redirect: 'follow'
            }

            // make a POST request to login
            const response = await fetch("http://127.0.0.1:8000/login", requestOptions)
            
            // set the message if the status returned is not 200 OK
            const data = await response.json()

            if (response.status != 200) {
                setMessage(data.detail)
                setColor('bg-red-200')
            } else if (response.status == 200) {
                router.push('/account')
            }
        } catch (error) {
            console.log("Unexpected Error")
        }
    }

    return (
        <>
            <NavBar/>
            <form method='post' className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
                {message && color && <Alert message={message} color={color} />}
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