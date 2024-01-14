"use client"

import Link from 'next/link';
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import Footer from '../components/Footer';
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login () {
    const [message, setMessage] = useState('')
    const [visible, setVisible] = useState(false)
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
                setVisible(true)
            } else if (response.status == 200) {
                router.push('/account')
            }
        } catch (error) {
            console.log("Unexpected Error")
        }
    }

    function updatePopup() {
        setVisible(false)
    }

    return (
        <div className="flex flex-col items-center space-y-12 w-full h-screen">
            <NavBar/>
            <h1 className='title'>Login</h1>
            <form method='post' className="grow form-control w-[400px] space-y-3" onSubmit={handleSubmit}>
                {message && visible && <Alert message={message} onClick={updatePopup} />}
                <p className='self-center'>Please enter your e-mail and password:</p>
                <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                </label>
                <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full max-w-full" required></input>
                <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                </label>
                <input type="password" id="password" name="password" autoComplete='on' className="input input-bordered input-sm w-full max-w-full" required></input>
                <div className='flex justify-center space-x-1'>
                    <p>Don't have an account?</p>
                    <Link href="/signup" className='link link-hover'>Create one</Link>
                </div>
                <button className="btn btn-primary">
                    LOGIN
                </button>
            </form>
            <Footer/>
        </div>
    )
}