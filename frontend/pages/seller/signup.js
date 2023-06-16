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
        const address = document.getElementById('street').value + ' ' + document.getElementById('address2').value
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
            } else { // bad request
                setMessage(data.detail)
                setVisible(true)
            }

        } catch {
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
                <form method='post' className="grow form-control space-y-1.5 w-1/2 flex items-center" onSubmit={handleSubmit}>
                    <p className="w-2/3">
                        <span className='text-red-500'>* </span> 
                        Required Fields 
                    </p>
                    <label className="label w-2/3" htmlFor="name">
                        <span className="label-text min-w-min">
                            Organization Name
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="text" id="name" name="name" autoComplete='on' className="input input-bordered input-sm w-2/3" required></input>
                    <label className="label w-2/3" htmlFor="email">
                        <span className="label-text min-w-min">
                            Organization Email
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="email" id="email" name="email" autoComplete='on' className="input input-bordered input-sm w-2/3" required></input>
                    <p className="pt-3 w-2/3"><b>Shipping Address</b></p>
                    <label className="label w-2/3" htmlFor="street">
                        <span className="label-text min-w-min">
                            Street Address
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="text" id="street" name="street" className="input input-bordered input-sm w-2/3" required></input>
                    <label className="label w-2/3" htmlFor="address2">
                        <span className="label-text min-w-min">
                            Address Line 2
                        </span>
                    </label>
                    <input type="text" id="address2" name="address2" className="input input-bordered input-sm w-2/3" placeholder="Apt, suite, etc."></input>
                    <label className="label w-2/3" htmlFor="city">
                        <span className="label-text min-w-min">
                            City
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="text" id="city" name="city" className="input input-bordered input-sm w-2/3" required></input>
                    <label className="label w-2/3" htmlFor="state">
                        <span className="label-text min-w-min">
                            State
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <SelectList items={states} name={'state'}/>
                    <label className="label w-2/3" htmlFor="zipcode">
                        <span className="label-text min-w-min">
                            Zipcode
                            <span className="label-text-alt text-red-500"> * </span>
                        </span>
                    </label>
                    <input type="text" id="zipcode" name="zipcode" className="input input-bordered input-sm w-2/3" required></input>
                    <br/>
                    <button className="btn btn-primary w-1/2">
                        <span className="capitalize">Submit</span>
                    </button>
                </form>
                <Footer/>
            </div>
        )
    }
}