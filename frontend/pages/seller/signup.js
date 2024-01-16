import Footer from '/components/Footer'
import NavBar from '/components/NavBar'
import Alert from '/components/Alert'
import SelectList from '/components/SelectList'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function seller_signup() {
    const [message, setMessage] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [visible, setVisible] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const authenticate = async () => {
            try {
                var requestOptions = {
                    method: 'GET',
                    credentials: 'include'
                }

                // make a request to /validate-token to validate the user
                const response = await fetch("http://127.0.0.1:8000/validate-token", requestOptions)
                
                // if the user is not authenticated, prompt user to login
                if (response.status != 200) {
                    router.push('/login')
                    return
                }

                // set authenticated to true
                setAuthenticated(true)
            } catch (error) {
                console.log(error)
            }
        }

        authenticate()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")

        // FormData object to get the login form's values
        const formData = new FormData()

        formData.append('name', document.getElementById('name').value)
        formData.append('email', document.getElementById('email').value)
        const address = (document.getElementById('street').value + ' ' + document.getElementById('address2').value).trim()
        formData.append('address', address)
        formData.append('city', document.getElementById('city').value)
        formData.append('state', document.getElementById('state').value)
        formData.append('zipcode', document.getElementById('zipcode').value)

        try {
            var requestOptions = {
                method: 'POST',
                credentials: 'include',
                body: formData,
                redirect: 'follow'
            }

            // make a POST request to create a seller profile
            const response = await fetch("http://127.0.0.1:8000/seller/signup/", requestOptions)

            const data = await response.json()

            if (response.status == 200){ // successful request
                router.push('/account')
            } else { // bad request
                setMessage(data.detail)
                setVisible(true)
            }

        } catch (error) {
            console.log(error)
        }
    }

    function updatePopup() {
        setVisible(false)
    }

    if (authenticated) {
        const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California",
        "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii",
        "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
        "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
        "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
        "West Virginia", "Wisconsin", "Wyoming"]

        return (
            <div className="flex flex-col items-center space-y-14 w-full h-screen">
                <NavBar/>
                <h1 className="title">Seller Sign Up</h1>
                {message && visible && <Alert message={message} onClick={updatePopup}/>}
                <form method='post' className="w-[500px] form-control form-control flex items-center" onSubmit={handleSubmit}>
                    <div className='input-container w-5/6'>
                        <input type="text" id="name" name="name" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className="label" htmlFor="name">
                            Organization Name
                        </label>
                    </div>
                    <div className='input-container w-5/6'>
                        <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-full" placeholder='' required></input>
                        <label className="label" htmlFor="email">
                                Organization Email
                        </label>
                    </div>
                    <div className='input-container w-5/6'>
                        <input type="text" id="street" name="street" className="input input-bordered input-sm w-full" placeholder="" required></input>
                        <label className="label" htmlFor="street">
                            Street Address
                        </label>
                    </div>
                    <div className='input-container w-5/6'>
                        <input type="text" id="address2" name="address2" className="input input-bordered input-sm w-full" placeholder=""></input>
                        <label className="label" htmlFor="address2">
                        Address Line 2
                        </label>
                    </div>
                    <div className='input-container w-5/6'>
                        <input type="text" id="city" name="city" className="input input-bordered input-sm w-full" placeholder="" required></input>
                        <label className="label" htmlFor="city">
                        City
                        </label>
                    </div>
                    <SelectList items={states} name={'state'}/>
                    <div className='input-container w-5/6'>
                        <input type="text" id="zipcode" name="zipcode" className="input input-bordered input-sm w-full" placeholder="" required></input>
                        <label className="label" htmlFor="zipcode">
                            Zipcode
                        </label>
                    </div>
                    <br/>
                    <button className="btn btn-primary w-5/6">
                        <span className="capitalize">Submit</span>
                    </button>
                </form>
                <Footer/>
            </div>
        )
    }
}