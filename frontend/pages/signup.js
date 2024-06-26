"use client"
import NavBar from '../components/NavBar'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import Link from 'next/link';
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
        <div>
            <NavBar/>
            <div className='flex justify-center'>
                <form method='post' className="w-[400px] form-control my-20" onSubmit={handleSubmit}>
                    <h1 className='title text-center mb-5'>Sign Up</h1>
                    { message && visible && <Alert message={message} onClick={updatePopup}/>}
                    <div className='input-container mb-5' style={{'marginBottom': '0px'}}>
                        <input type="text" id="fname" name="fname" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className='label' htmlFor='fname'>
                            <span>First Name</span> 
                        </label>
                    </div>
                    <div className='input-container'>
                        <input type="text" id="lname" name="lname" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className='label' htmlFor='lname'>
                            <span>Last Name</span>
                        </label>
                    </div>
                    <div className='input-container'>
                        <input type="text" id="username" name="username" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className="label" htmlFor="username">
                            <span>Username</span>
                        </label>
                    </div>
                    <div className='input-container'>
                        <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className="label" htmlFor="email">
                            <span>Email</span>
                        </label>
                    </div>
                    <div className='input-container mb-0'>
                        <input type="password" id="password" name="password" className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className="label" htmlFor="password">
                            <span>Password</span>
                        </label>
                    </div>
                    <br/>
                    <div className='flex justify-center space-x-1 mb-5'>
                        <p>Already have an account?</p>
                        <Link href="/login" className='link link-hover'>Login</Link>
                    </div>
                    <button className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
            <Footer/>
        </div>
    )
}