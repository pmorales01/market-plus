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
        <div className="flex flex-col items-center justify-between w-full sm:max-md:w-fit h-screen">
            <NavBar/>
            <form method='post' className="form-control w-[400px] my-20 xs:max-sm:w-11/12" onSubmit={handleSubmit}>
                {message && visible && <Alert message={message} onClick={updatePopup} />}
                <header className='flex flex-col items-center'>
                    <h1 className='title mb-5'>Login</h1>
                    <p className='self-center mb-5'>Please enter your e-mail and password:</p>
                </header>
                <div className='input-container'>
                    <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full max-w-full" placeholder=' ' required></input>
                    <label className="label" htmlFor="email">
                        <span>Email</span>
                    </label>
                </div>
                <div className='input-container'>
                    <input type="password" id="password" name="password" autoComplete='on' className="input input-bordered input-sm w-full max-w-full" placeholder=' ' required></input>
                    <label className="label" htmlFor="password">
                        <span>Password</span>
                    </label>
                </div>
                <div className='flex justify-center space-x-1 mb-5'>
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