"use client"
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function signup () {
    // tracks message of the alert box
    const [message, setMessage] = useState('')
    const [visible, setVisible] = useState(false)

    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            // headers
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json")

            // FormData object to get the login form's values
            const formData = new FormData()

            formData.append('fname', document.getElementById('fname').value)
            formData.append('lname', document.getElementById('lname').value)
            formData.append('username', document.getElementById('username').value)
            formData.append('email', document.getElementById('email').value)
            formData.append('password', document.getElementById('password').value)

            var requestOptions = {
                method: 'POST',
                credentials: 'include',
                body: formData,
                redirect: 'follow'
            };

            // make a POST request to sign up (create a user)
            const response = await fetch("http://127.0.0.1:8000/signup/", requestOptions)
            
            // get the response from HTTP request and create an <Alert/>
            const data = await response.json()

             if (response.status == 200) { // successful request
                router.push('/account')
            } else { // bad request
                setMessage(data.detail)
                setVisible(true)
            }
        } catch (error) {
            console.log("Error")
        }
    }

    function updatePopup() {
        setVisible(false)
    }

    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <h1 className='title'>Sign Up</h1>
            <form method='post' className="grow form-control w-full max-w-xs space-y-1.5" onSubmit={handleSubmit}>
                { message && visible && <Alert message={message} onClick={updatePopup}/>}
                <p className="self-start">
                    <span className='text-red-500'>* </span> 
                    Required Fields 
                </p>
                <div className='grid grid-rows-2 grid-flow-col gap-4'>
                    <label className='label' htmlFor='fname'>
                        <span className="label-text">
                            First Name
                            <span className="label-text-alt text-red-500"> * </span>
                        </span> 
                    </label>
                    <input type="text" id="fname" name="fname" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                    <label className='label' htmlFor='lname'>
                        <span className="label-text">
                            Last Name
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="text" id="lname" name="lname" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                </div>
                <label className="label" htmlFor="username">
                    <span className="label-text">
                        Username
                        <span className="label-text-alt text-red-500"> * </span>
                    </span>
                </label>
                <input type="text" id="username" name="username" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label" htmlFor="email">
                    <span className="label-text">
                        Email
                        <span className="label-text-alt text-red-500"> * </span>
                    </span>
                </label>
                <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label" htmlFor="password">
                    <span className="label-text">
                        Password
                        <span className="label-text-alt text-red-500"> * </span>
                    </span>
                </label>
                <input type="password" id="password" name="password" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <br/>
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
            <Footer/>
        </div>
    )
}